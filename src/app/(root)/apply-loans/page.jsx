// src/app/apply-loans/page.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useMainContext } from "@/context/MainContext";
import { axiosClient } from "@/utils/AxiosClient";
import LoanApplicationModal from "@/components/Loan/LoanApplicationModal";
import LoanPolicyModal from "@/components/Loan/LoanPolicyModal";
import loan_image from "../../../assets/images/loan_image.jpg";

// Define the mapping from frontend category to backend loanType
const loanCategoryMap = {
  personal: "personal_loan",
  car: "car_loan",
  home: "home_loan",
  business: "business_loan",
  education: "education_loan",
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const ApplyLoan = () => {
  const { user } = useMainContext();
  const [loanConfirmDetails, setLoanConfirmDetails] = useState(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const initialValues = {
    loanCategory: "",
    loanAmount: "",
    loanTenure: "",
    remarks: "",
  };

  const validationSchema = yup.object({
    loanCategory: yup.string().required("Loan category is required"),
    loanAmount: yup
      .number()
      .typeError("Loan amount must be a number")
      .min(100000, "Minimum loan amount is ₹1,00,000")
      .required("Loan amount is required"),
    loanTenure: yup
      .number()
      .typeError("Loan tenure must be a number")
      .min(1, "Minimum tenure is 1 year")
      .max(10, "Maximum tenure is 10 years")
      .required("Loan tenure is required"),
    remarks: yup
      .string()
      .max(500, "Remarks cannot exceed 500 characters"),
  });

  const onSubmitHandler = (values, helpers) => {
    try {
      const principal = parseFloat(values.loanAmount);
      const annualInterestRate = 0.05;
      const processingFeeRate = 0.01;
      const tenureInYears = parseInt(values.loanTenure);

      const processingFee = principal * processingFeeRate;
      const monthlyInterestRate = annualInterestRate / 12;
      const tenureInMonths = tenureInYears * 12;

      let estimatedEMI = 0;
      if (monthlyInterestRate > 0) {
        estimatedEMI =
          (principal *
            monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, tenureInMonths)) /
          (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
      } else {
        estimatedEMI = principal / tenureInMonths;
      }

      setLoanConfirmDetails({
        category: values.loanCategory,
        amount: principal,
        tenureYears: tenureInYears,
        tenureMonths: tenureInMonths,
        processingFee: processingFee,
        annualInterestRate: annualInterestRate * 100,
        estimatedEMI: estimatedEMI,
        originalValues: values,
      });

      setIsApplicationModalOpen(true);
      toast.info("Review your loan details and confirm with OTP.");
    } catch (error) {
      console.error("Loan calculation error:", error);
      toast.error("Failed to calculate loan details. Please try again.");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const handleRequestOtpForLoan = async () => {
    if (!user || !user.email) {
      toast.error("User email not available. Please log in.");
      return false;
    }

    try {
      const response = await axiosClient.post(
        "/auth/send-otp",
        {
          email: user.email,
        }
      );

      toast.success(response.data.message || "OTP sent successfully! Please check your email.");
      return true;
    } catch (error) {
      console.error("API call error during OTP request:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
      return false;
    }
  };

  const handleLoanConfirmation = async (originalFormValues, otp) => {
    try {
      const loanType = loanCategoryMap[originalFormValues.loanCategory];
      if (!loanType) {
        toast.error("Invalid loan category selected.");
        return;
      }

      const payload = {
        loanAmount: parseFloat(originalFormValues.loanAmount),
        loanTenure: parseInt(originalFormValues.loanTenure),
        loanType: loanType,
        otp: otp,
        remarks: originalFormValues.remarks || "No remarks provided.",
        paymentMethod: "auto-debit",
      };

      const response = await axiosClient.post(
        "/loan/apply-new",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message || "Loan application successful!");
      setIsApplicationModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("API call error during loan confirmation:", error);
      toast.error(error.response?.data?.message || "Loan application failed. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Apply for a <span className="text-blue-600">Loan</span> Today
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get pre-approved for competitive interest rates and flexible repayment options
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-2/5 w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Why Choose Us?</h3>
                </div>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-5"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="flex gap-3 items-start"
                  >
                    <div className="bg-green-100 p-2 rounded-lg mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Quick Approval</h4>
                      <p className="text-gray-600 text-sm">Get decisions within 24 hours</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="flex gap-3 items-start"
                  >
                    <div className="bg-purple-100 p-2 rounded-lg mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Competitive Rates</h4>
                      <p className="text-gray-600 text-sm">Interest rates starting at 5%</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="flex gap-3 items-start"
                  >
                    <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Minimal Documents</h4>
                      <p className="text-gray-600 text-sm">Simple online application</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="relative h-64 w-full">
                <Image
                  src={loan_image}
                  alt="Loan application illustration"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-b-2xl"
                />
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-white rounded-2xl p-6 shadow-md border border-blue-100"
            >
              <h3 className="font-bold text-gray-800 text-lg mb-3">Loan Eligibility</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p>Minimum Salary: ₹25,000 per month</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p>Age: 21-60 years</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p>Minimum Credit Score: 650</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p>Employment: At least 1 year in current job</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-3/5 w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between mb-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Loan Application
                  </h2>
                  <p className="text-gray-600">
                    Complete your application in just 5 minutes
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                  Step 1 of 2
                </div>
              </motion.div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      {/* Loan Category */}
                      <motion.div variants={itemVariants}>
                        <label
                          htmlFor="loanCategory"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Loan Category
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          as="select"
                          name="loanCategory"
                          id="loanCategory"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                          <option value="">Select loan type</option>
                          <option value="personal">Personal Loan</option>
                          <option value="car">Car Loan</option>
                          <option value="home">Home Loan</option>
                          <option value="business">Business Loan</option>
                          <option value="education">Education Loan</option>
                        </Field>
                        <ErrorMessage
                          name="loanCategory"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </motion.div>

                      {/* Loan Amount */}
                      <motion.div variants={itemVariants}>
                        <label
                          htmlFor="loanAmount"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Loan Amount (₹)
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <Field
                            type="number"
                            id="loanAmount"
                            name="loanAmount"
                            placeholder="Enter amount (e.g., 500000)"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>
                        <ErrorMessage
                          name="loanAmount"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Minimum loan amount: ₹1,00,000
                        </div>
                      </motion.div>

                      {/* Loan Tenure - REVERTED TO ORIGINAL DROPDOWN */}
                      <motion.div variants={itemVariants}>
                        <label
                          htmlFor="loanTenure"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Choose the Loan Tenure (in years){" "}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <Field
                          as="select"
                          name="loanTenure"
                          id="loanTenure"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                          <option value="">Select the loan tenure</option>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((year) => (
                            <option key={year} value={year}>
                              {year} Year{year > 1 ? "s" : ""}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="loanTenure"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </motion.div>

                      {/* Remarks */}
                      <motion.div variants={itemVariants}>
                        <label
                          htmlFor="remarks"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Additional Information
                        </label>
                        <Field
                          as="textarea"
                          id="remarks"
                          name="remarks"
                          rows="3"
                          placeholder="Tell us about your loan purpose or any special requests..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        <ErrorMessage
                          name="remarks"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div 
                        variants={itemVariants}
                        className="pt-4"
                      >
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium disabled:opacity-70 transition-all duration-300 shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
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
                              Processing...
                            </div>
                          ) : (
                            "Calculate & Apply Now"
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </Form>
                )}
              </Formik>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 pt-4 border-t border-gray-100 text-center"
              >
                <p className="text-sm text-gray-600">
                  By submitting, you agree to our{" "}
                  <button
                    type="button"
                    onClick={() => setIsPolicyModalOpen(true)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Terms & Conditions
                  </button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      {loanConfirmDetails && (
        <LoanApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          details={loanConfirmDetails}
          onConfirm={handleLoanConfirmation}
          onRequestOtp={handleRequestOtpForLoan}
        />
      )}

      <LoanPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </div>
  );
};

export default ApplyLoan;