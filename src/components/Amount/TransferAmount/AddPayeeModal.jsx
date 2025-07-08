"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import { useMainContext } from "@/context/MainContext";

const AddPayeeModal = ({ isOpen, onClose }) => {
  const [showOTP, setShowOTP] = useState(false);
  const { user } = useMainContext();

  const initialValues = {
    accountNumber: "",
    nickname: "",
  };

  const otpInitialValues = {
    otp: "",
  };

  const validationSchema = Yup.object({
    accountNumber: Yup.string()
      .length(24, "Must be exactly 24 characters")
      .required("Account number is required"),
    nickname: Yup.string(),
  });

  const otpValidationSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const handleInitialSubmit = async (values, actions) => {
    try {
      if (!user?.email) {
        toast.error("User email not found.");
        return;
      }

      // Send OTP
      await axiosClient.post(
        "/auth/send-otp",
        { email: user.email },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Store payee details for OTP verification
      localStorage.setItem("pendingPayee", JSON.stringify(values));
      setShowOTP(true);
      toast.success("OTP sent to your email.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleOTPSubmit = async (values, actions) => {
    const storedData = JSON.parse(localStorage.getItem("pendingPayee"));

    if (!storedData) {
      toast.error("Payee information not found. Please try again.");
      return;
    }

    const payload = {
      payeeId: storedData.accountNumber,
      nickname: storedData.nickname,
      otp: values.otp,
    };

    try {
      await axiosClient.post("payee/add-new", payload, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      toast.success("Payee added successfully!");
      localStorage.removeItem("pendingPayee");
      setShowOTP(false);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add payee.");
    }

    actions.setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "-10%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-10%" }}
        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-lg font-bold mb-4">Add New Payee</h2>

          {!showOTP ? (
            <Formik
              key="payee"
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleInitialSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Account Number</label>
                    <Field
                      name="accountNumber"
                      type="text"
                      className="w-full border rounded px-3 py-2"
                    />
                    <ErrorMessage
                      name="accountNumber"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Nickname (Optional)</label>
                    <Field
                      name="nickname"
                      type="text"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
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
                        Sending OTP...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              key="otp"
              initialValues={otpInitialValues}
              validationSchema={otpValidationSchema}
              onSubmit={handleOTPSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Enter OTP</label>
                    <Field
                      name="otp"
                      type="text"
                      className="w-full border rounded px-3 py-2"
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
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
                        Verifying...
                      </>
                    ) : (
                      "Verify & Add Payee"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
            onClick={() => {
              localStorage.removeItem("pendingPayee");
              setShowOTP(false);
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddPayeeModal;
