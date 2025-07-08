"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import OTPInput from "@/components/reusable/OTPInput";
import { axiosClient } from "@/utils/AxiosClient"; // Assuming this exists
import { toast } from "react-toastify";
import { useMainContext } from "@/context/MainContext";
// import { headers } from "next/headers";

const TransferMoneyModal = ({
  isOpen,
  onClose,
  payees = [],
  onAddPayeeClick,
}) => {
  const { user, loading } = useMainContext();
  const [showOTP, setShowOTP] = useState(false);
  const [transactionPayload, setTransactionPayload] = useState(null);

  const initialValues = {
    payeeId: "",
    transferMoney: "",
    remark: "",
    otp: new Array(6).fill(""),
  };

  const transferSchema = Yup.object({
    payeeId: Yup.string().required("Please select a payee"),
    transferMoney: Yup.number()
      .required("Amount is required")
      .min(1, "Minimum ₹1")
      .max(500000, "Maximum ₹5,00,000"),
    remark: Yup.string().required("Please enter a remark"),
  });

  const otpSchema = Yup.object({
    otp: Yup.array()
      .of(Yup.string().required("Required"))
      .min(6, "OTP must be 6 digits")
      .max(6, "OTP must be 6 digits"),
  });

  const handleSubmit = async (values, helpers) => {
    const { payeeId, transferMoney, remark, otp } = values;

    if (!showOTP) {
      try {
        // Step 1: Validate transfer & trigger OTP
        const payload = { payeeId, transferMoney, remark };
        await axiosClient.post(
          "/auth/send-otp",
          { email: user.email },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setTransactionPayload(payload);
        setShowOTP(true);
        toast.success("OTP sent to your registered mobile/email.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to send OTP.");
      } finally {
        helpers.setSubmitting(false);
      }
    } else {
      try {
        // Step 2: Final transfer with OTP
        const finalPayload = {
          ...transactionPayload,
          otp: otp.join(""),
        };
        //API Call for Money Transfer
        const res = await axiosClient.post(
          "payee/money-transfer",
          finalPayload,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        toast.success("Money transferred successfully!");
        onClose();
        setShowOTP(false);
        setTransactionPayload(null);
        helpers.resetForm();
      } catch (err) {
        toast.error(err.response?.data?.message || "Transfer failed.");
      } finally {
        helpers.setSubmitting(false);
      }
    }
  };

  const validationSchema = showOTP
    ? transferSchema.concat(otpSchema)
    : transferSchema;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <IoClose size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Transfer Money
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  {/* Payee Dropdown */}
                  <label className="text-sm font-medium text-gray-700">
                    Select Payee
                  </label>
                  <Field
                    as="select"
                    name="payeeId"
                    className="w-full border rounded-md p-2 mt-1 mb-1"
                    disabled={showOTP}
                  >
                    <option value="">-- Choose Payee --</option>
                    {payees.map((payee) => (
                      <option key={payee._id} value={payee.payee}>
                        {payee.nickname} - {payee.payee}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="payeeId"
                    component="div"
                    className="text-red-500 text-xs mb-2"
                  />

                  {/* Amount */}
                  <label className="text-sm font-medium text-gray-700">
                    Amount (₹)
                  </label>
                  <Field
                    name="transferMoney"
                    type="number"
                    className="w-full border rounded-md p-2 mt-1 mb-1"
                    placeholder="Enter amount"
                    disabled={showOTP}
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-xs mb-2"
                  />

                  {/* Remark */}
                  <label className="text-sm font-medium text-gray-700">
                    Remark
                  </label>
                  <Field
                    name="remark"
                    type="text"
                    className="w-full border rounded-md p-2 mt-1 mb-1"
                    placeholder="Purpose of transfer"
                    disabled={showOTP}
                  />
                  <ErrorMessage
                    name="remark"
                    component="div"
                    className="text-red-500 text-xs mb-2"
                  />

                  {/* OTP Input */}
                  {showOTP && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Enter OTP
                      </label>
                      <OTPInput
                        value={values.otp} // CHANGE: Renamed from 'otp' to 'value'
                        onChange={(newOtp) => setFieldValue("otp", newOtp)} // CHANGE: Renamed from 'setOtp' to 'onChange'
                      />
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  )}

                  <div className="flex justify-center items-center mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      {isSubmitting
                        ? showOTP
                          ? "Transferring..."
                          : "Sending OTP..."
                        : showOTP
                        ? "Confirm Transfer"
                        : "Generate OTP"}
                    </button>
                  </div>

                  {/* Add Payee */}
                  {!showOTP && (
                    <div
                      className="mt-4 text-sm text-blue-700 underline cursor-pointer hover:text-blue-900"
                      onClick={onAddPayeeClick}
                    >
                      <p>+ Add New Payee</p>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransferMoneyModal;
