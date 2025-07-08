"use client";
import React, { useState, useRef } from "react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockPasswordLine,
  RiMailLine,
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import BankLogo from "@/components/reusable/BankLogo";
import OTPInput from "@/components/reusable/OTPInput";
import { axiosClient } from "@/utils/AxiosClient";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordResetFields, setShowPasswordResetFields] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown for resend OTP button
  const [isResendingOtp, setIsResendingOtp] = useState(false); // Loading state for resend OTP
  const router = useRouter(); // Initialize useRouter

  // Initial form values
  const initialValues = {
    email: "",
    newPassword: "",
    confirmPassword: "",
    otp: new Array(6).fill(""),
  };

  // Validation schema for the email step (sending OTP)
  const emailSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Validation schema for the password reset step (with OTP and new passwords)
  const passwordResetSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .required("New Password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
    otp: Yup.array()
      .of(Yup.string()) // Removed .required("Required") here
      .min(6, "OTP must be 6 digits") // This will now handle the overall required message
      .max(6, "OTP must be 6 digits")
      .test("is-numeric", "OTP must be numeric", (value) =>
        value.every((char) => /^\d$/.test(char))
      )
      .required("OTP is required"), // Added overall required for the array
  });

  // Determine which schema to use based on the step
  const validationSchema = showPasswordResetFields
    ? passwordResetSchema
    : emailSchema;

  const startResendCooldown = () => {
    setResendCooldown(60); // Start 60-second cooldown
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Function to handle resending OTP
  const handleResendOtp = async (email, setFieldValue) => {
    if (resendCooldown > 0 || isResendingOtp) return; // Prevent multiple requests

    setIsResendingOtp(true);
    try {
      const response = await axiosClient.post("/auth/send-otp", {
        email: email,
      });

      if (response.data) {
        toast.success(
          response.data.msg || "New OTP sent successfully to your email."
        );
        setFieldValue("otp", new Array(6).fill("")); // Clear OTP field
        startResendCooldown(); // Start cooldown
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error(
        error.response?.data?.message ||
          "Error resending OTP. Please try again."
      );
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    // Step 1: Send OTP
    if (!showPasswordResetFields) {
      try {
        const response = await axiosClient.post("/auth/send-otp", {
          email: values.email,
        });

        if (response.data) {
          toast.success(
            response.data.msg || "OTP sent successfully to your email."
          );
          setShowPasswordResetFields(true); // Show new password and OTP fields
          startResendCooldown(); // Start cooldown after initial OTP send
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error(
          error.response?.data?.message ||
            "Error sending OTP. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      // Step 2: Reset Password with OTP
      try {
        const response = await axiosClient.post("/auth/reset-password", {
          email: values.email,
          newPassword: values.newPassword.trim(),
          confirmNewPassword: values.confirmNewPassword.trim(),
          otp: values.otp.join(""), // Join OTP array into a string
        });

        if (response.data && response.data.msg) {
          toast.success(
            response.data.msg ||
              "Password reset successfully! You can now log in with your new password."
          );
          resetForm(); // Clear the form
          setShowPasswordResetFields(false); // Go back to initial state
          setResendCooldown(0); // Clear cooldown
          router.push("/auth/login"); // Redirect user to login page
        } else {
          toast.error(
            response.data.message ||
              "Password reset failed. Please check your OTP and try again."
          );
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        toast.error(
          error.response?.data?.message ||
            "Error resetting password. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
      >
        {/* Left Section: Image and Text */}
        <div className="w-full md:w-5/12 p-6 flex flex-col justify-center items-center bg-blue-50/50 rounded-l-2xl">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1095.jpg?ga=GA1.1.819700191.1728751895&semt=ais_hybrid&w=740"
            alt="Forgot Password Illustration"
            className="w-full max-w-[450px] h-auto object-contain rounded-lg shadow-md"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-gray-600 mt-4 text-center px-4"
          >
            Enter your registered email address to receive a One-Time Password
            (OTP) for resetting your account password securely.
          </motion.div>
        </div>

        {/* Right Section: Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="w-8/12 sm:w-6/12 mx-auto mb-6">
            <BankLogo />
          </div>
          <h3 className="text-center text-3xl font-bold text-gray-800 mb-6 select-none border-b-2 border-blue-400 pb-2">
            Password Reset
          </h3>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={false} // Prevents form from resetting when schema changes
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-5">
                {/* Registered Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Email <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Your Registered Email ID"
                      className="border border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none p-3 w-full rounded-md pr-10"
                      disabled={isSubmitting || showPasswordResetFields}
                      value={values.email || ""}
                    />
                    <RiMailLine
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {showPasswordResetFields && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden space-y-5"
                    >
                      {/* New Password */}
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          New Password <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            id="newPassword"
                            placeholder="Enter your new password"
                            className="border border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none p-3 w-full rounded-md pr-10"
                            disabled={isSubmitting}
                            value={values.newPassword || ""}
                          />
                          <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <RiEyeOffLine size={20} />
                            ) : (
                              <RiEyeLine size={20} />
                            )}
                          </span>
                        </div>
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          Confirm New Password{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmNewPassword"
                            id="confirmNewPassword"
                            placeholder="Confirm your new password"
                            className="border border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none p-3 w-full rounded-md pr-10"
                            disabled={isSubmitting}
                            value={values.confirmNewPassword || ""}
                          />
                          <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <RiEyeOffLine size={20} />
                            ) : (
                              <RiEyeLine size={20} />
                            )}
                          </span>
                        </div>
                        <ErrorMessage
                          name="confirmNewPassword"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      {/* Enter OTP */}
                      <div>
                        <label
                          htmlFor="otp"
                          className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                          OTP <span className="text-red-600">*</span>
                        </label>
                        {/* <OTPInput
                          otp={values.otp}
                          setOtp={(newOtp) => setFieldValue("otp", newOtp)}
                          numInputs={6}
                          disabled={isSubmitting}
                        /> */}
                        <OTPInput
                          value={values.otp} // Renamed from 'otp' to 'value' for consistency with OTPInput component
                          onChange={(newOtp) => setFieldValue("otp", newOtp)} // Renamed from 'setOtp' to 'onChange'
                          length={6} // Renamed from 'numInputs' to 'length' for consistency
                          disabled={isSubmitting}
                        />
                        <ErrorMessage
                          name="otp"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                        <div className="text-right mt-2">
                          <button
                            type="button" // Important: set type="button" to prevent form submission
                            onClick={() =>
                              handleResendOtp(values.email, setFieldValue)
                            }
                            disabled={
                              resendCooldown > 0 ||
                              isResendingOtp ||
                              !values.email
                            } // Disable if cooldown active or email empty
                            className={`text-xs text-blue-700 underline font-semibold transition-opacity duration-200 ${
                              resendCooldown > 0 ||
                              isResendingOtp ||
                              !values.email
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:text-blue-900"
                            }`}
                          >
                            {isResendingOtp
                              ? "Sending..."
                              : resendCooldown > 0
                              ? `Resend OTP (${resendCooldown}s)`
                              : "Resend OTP"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex justify-center mt-6">
                  {!showPasswordResetFields ? (
                    <motion.button
                      key="send-otp-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isSubmitting ? "Sending OTP..." : "Send OTP"}
                      <RiMailLine size={20} />
                    </motion.button>
                  ) : (
                    <motion.button
                      key="reset-password-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isSubmitting ? "Resetting..." : "Reset Password"}
                      <RiLockPasswordLine size={20} />
                    </motion.button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
