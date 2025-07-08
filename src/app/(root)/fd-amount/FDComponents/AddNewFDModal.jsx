// components/FDComponents/AddNewFDModal.jsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import BankLogo from "@/components/reusable/BankLogo"; // Adjust path if needed
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa"; // Icons for form fields
import { axiosClient } from "@/utils/AxiosClient";

const AddNewFDModal = ({ isOpen, onClose, onFdCreated }) => {
  const [estimatedMaturityAmount, setEstimatedMaturityAmount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //Get token
  const token = localStorage.getItem("token") || "";

  //initial values for the formik
  const initialValues = {
    fdAmount: "",
    fdTenure: "", // In years
    fdReason: "",
  };

  // Example fixed interest rate for FD (you can make this dynamic)
  const FD_ANNUAL_INTEREST_RATE = 0.07; // 7% per annum

  const validationSchema = yup.object({
    fdAmount: yup
      .number()
      .typeError("FD amount must be a number")
      .min(500, "Minimum FD amount is ₹500")
      .required("FD amount is required"),
    fdTenure: yup
      .number()
      .typeError("Tenure must be a number")
      .min(1, "Minimum tenure is 1 year")
      .max(10, "Maximum tenure is 10 years")
      .required("Tenure is required"),
    fdReason: yup
      .string()
      .max(200, "Reason cannot exceed 200 characters")
      .required("Reason is required"),
  });

  const calculateMaturityAmount = (amount, tenure) => {
    if (!amount || !tenure) return 0;
    const principal = parseFloat(amount);
    const years = parseInt(tenure);
    // Compound interest formula: A = P(1 + r)^n
    const maturity = principal * Math.pow(1 + FD_ANNUAL_INTEREST_RATE, years);
    return maturity;
  };

  const onSubmitHandler = async (values, helpers) => {
    setLoading(true);
    try {
      //Step 1: calculate the maturity amount based on the form data (formik values) submitted based by the user --> we'll show it on the UI
      const maturity = calculateMaturityAmount(
        values.fdAmount,
        values.fdTenure
      );
      setEstimatedMaturityAmount(maturity); //calculate maturity amount
      //Step 2: backend API call for
      const response = await axiosClient.post(
        "fd/create-new",
        {
          principalAmount: parseFloat(values.fdAmount), //convert the string into the float
          tenure: parseInt(values.fdTenure),
          fdReason: values.fdReason,
        },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"), // Always send token
          },
          }
      );
      //Step 3 : if fd creation is successful, we reset everything like reset maturity amount, reset form, close the modal and we pass the fd creation data to the parent (FDPage)
      if (response.data.success) {       
        toast.success(response.data.message);
        helpers.resetForm();
        setEstimatedMaturityAmount(0); // Reset calculation
        onClose(); // Close modal on success
        if (onFdCreated) {
          onFdCreated(response.data.fd); // Pass the new FD data to parent
        }
      } else {
        setError(response.data.message || "Failed to submit FD application.");
        toast.error(
          response.data.message || "Failed to submit FD application."
        );
      }

    } catch (error) {
      console.error("FD submission error:", error);
       setError(error.response?.data?.message || error.message || "Failed to submit FD application. Please try again.");
        toast.error(error.response?.data?.message || error.message || "Failed to submit FD application. Please try again.");
    } finally {
      setLoading(false);
      helpers.setSubmitting(false);      
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close new FD modal"
            >
              <IoClose />
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-4 flex-shrink-0">
              <BankLogo />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex-shrink-0">
              Create New Fixed Deposit
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmitHandler}
            >
              {({ values, isSubmitting, setFieldValue }) => (
                <Form className="flex flex-col gap-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  {/* FD Amount */}
                  <div>
                    <label
                      htmlFor="fdAmount"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      <FaMoneyBillWave className="inline-block mr-2 text-blue-500" />
                      FD Amount <span className="text-pink-600">*</span>
                    </label>
                    <Field
                      type="number"
                      id="fdAmount"
                      name="fdAmount"
                      placeholder="Enter the FD Amount (Min ₹500)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => {
                        setFieldValue("fdAmount", e.target.value);
                        setEstimatedMaturityAmount(
                          calculateMaturityAmount(
                            e.target.value,
                            values.fdTenure
                          )
                        );
                      }}
                    />
                    <ErrorMessage
                      name="fdAmount"
                      component="p"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>

                  {/* Tenure (in years) */}
                  <div>
                    <label
                      htmlFor="fdTenure"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      <FaCalendarAlt className="inline-block mr-2 text-blue-500" />
                      Tenure (in years) <span className="text-pink-600">*</span>
                    </label>
                    <Field
                      as="select"
                      name="fdTenure"
                      id="fdTenure"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => {
                        setFieldValue("fdTenure", e.target.value);
                        setEstimatedMaturityAmount(
                          calculateMaturityAmount(
                            values.fdAmount,
                            e.target.value
                          )
                        );
                      }}
                    >
                      <option value="">Select Tenure</option>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year} Year{year > 1 ? "s" : ""}
                          </option>
                        )
                      )}
                    </Field>
                    <ErrorMessage
                      name="fdTenure"
                      component="p"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label
                      htmlFor="fdReason"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      <FaEdit className="inline-block mr-2 text-blue-500" />
                      Reason
                    </label>
                    <Field
                      type="text"
                      id="fdReason"
                      name="fdReason"
                      placeholder="e.g., Savings for future, Tax saving"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="fdReason"
                      component="p"
                      className="text-red-600 text-xs mt-1"
                    />
                  </div>

                  {/* Estimated Maturity Amount Display */}
                  {values.fdAmount &&
                    values.fdTenure &&
                    estimatedMaturityAmount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 p-4 rounded-lg text-center text-green-800 font-semibold text-lg flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle className="text-green-600" />
                        Estimated Maturity: ₹
                        {estimatedMaturityAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </motion.div>
                    )}

                  {/* Create FD Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating FD...
                      </>
                    ) : (
                      "Create FD"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddNewFDModal;
