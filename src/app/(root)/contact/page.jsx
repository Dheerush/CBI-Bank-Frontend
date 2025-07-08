"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaPhoneAlt,
  FaClock,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify"; // Import toast

const Contact = () => {
  const [isComplaintFormOpen, setIsComplaintFormOpen] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleComplaintToggle = () => {
    setIsComplaintFormOpen((prev) => !prev);
    // Clear all messages and states when opening/closing the form
    setIssueType("");
    setIssueDescription("");
    setSubmissionMessage(""); // Clear static message
    setErrorMessage(""); // Clear static error message
    setIsLoading(false);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage(""); // Clear previous static messages
    setErrorMessage(""); // Clear previous static error messages
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // Use toast.error for login required
        toast.error("You must be logged in to register a complaint.");
        setIsLoading(false);
        return;
      }

      const response = await axiosClient.post(
        "auth/register-complaint",
        {
          complaintIssueType: issueType,
          complaintDescription: issueDescription,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = response.data;

      // Success: Use toast.info
      toast.info(
        data.message ||
          "Complaint registered successfully! We will get back to you shortly."
      );

      setSubmissionMessage("Complaint submitted!"); // Short message for immediate UI feedback if needed

      // Close form and clear fields
      setIsComplaintFormOpen(false);
      setIssueType("");
      setIssueDescription("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        "An unexpected error occurred. Please try again.";

      // Error: Use toast.error
      toast.error(errorMsg);
      setErrorMessage(errorMsg); // Still setting static error message if you want both
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-10">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-10 border-b-4 border-blue-500 pb-4">
        Contact Us
      </h1>

      {/* Head Office & Nearest Branch */}
      <section className="grid md:grid-cols-2 gap-8 mb-14">
        {/* Head Office */}
        <div className="bg-gradient-to-tr from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg text-center">
          <FaBuilding className="text-blue-700 text-4xl mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">
            Head Office
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Office- 123, CBI Bank Street,
            <br />
            Financial District, Connaught Place
            <br />
            New Delhi 110001, India
          </p>
          <a
            href="https://www.google.com/maps/place/Connaught+Place,+New+Delhi,+Delhi+110001/@28.6320168,77.2188465,746m/data=!3m1!1e3!4m6!3m5!1s0x390cfd37b741d057:0xcdee88e47393c3f1!8m2!3d28.6304203!4d77.2177216!16zL20vMDR4eDB4?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaMapMarkerAlt className="mr-2" /> View on Map
          </a>
        </div>

        {/* Nearest Branch */}
        <div className="bg-gradient-to-tr from-green-50 to-green-100 p-6 rounded-2xl shadow-lg text-center">
          <FaMapMarkerAlt className="text-green-700 text-4xl mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-green-900 mb-3">
            Nearest Branch
          </h2>
          <p className="text-gray-700">
            Find your closest branch for cash deposits, withdrawals, and
            support.
          </p>
          <a
            href="https://www.google.com/maps/place/Connaught+Place,+New+Delhi,+Delhi+110001/@28.6320168,77.2188465,746m/data=!3m1!1e3!4m6!3m5!1s0x390cfd37b741d057:0xcdee88e47393c3f1!8m2!3d28.6304203!4d77.2177216!16zL20vMDR4eDB4?entry=ttu&g_ep=EgoyMDI1MDYzMC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <FaMapMarkerAlt className="mr-2" /> Locate a Branch
          </a>
        </div>
      </section>

      {/* Support Info */}
      <section className="bg-white p-6 rounded-2xl shadow mb-14 text-center">
        <h2 className="text-2xl font-bold mb-6">
          Toll-Free: <span className="text-red-600">1800 0000 0000</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaClock className="text-blue-500 text-3xl mr-4" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Business Hours</h3>
              <p className="text-gray-600">9 AM - 5 PM, Mon - Fri</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            <FaPhoneAlt className="text-green-500 text-3xl mr-4" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Call Support</h3>
              <p className="text-gray-600">Available 24 x 7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Raise Complaint */}
      <section className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Need Help? Raise a Complaint
        </h2>
        <p className="text-gray-600 mb-6">
          Have an issue? Let us know, and we’ll resolve it quickly.
        </p>

        <button
          onClick={handleComplaintToggle}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition shadow-md ${
            isComplaintFormOpen
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : isComplaintFormOpen ? (
            "Close Complaint Form"
          ) : (
            "Raise a Complaint"
          )}
        </button>

        {submissionMessage && (
          <div className="mt-6 bg-green-100 text-green-800 px-4 py-3 rounded-lg inline-flex items-center justify-center max-w-xl mx-auto">
            <FaCheckCircle className="mr-2" /> {submissionMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 bg-red-100 text-red-800 px-4 py-3 rounded-lg inline-flex items-center justify-center max-w-xl mx-auto">
            <FaTimesCircle className="mr-2" /> {errorMessage}
          </div>
        )}

        {/* Animated Complaint Form */}
        <AnimatePresence>
          {isComplaintFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden mt-8"
            >
              <form
                onSubmit={handleComplaintSubmit}
                className="max-w-xl mx-auto grid gap-6 text-left"
              >
                <div>
                  <label
                    htmlFor="issueType"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Select Issue Type:
                  </label>
                  <select
                    id="issueType"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    required
                    className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50"
                  >
                    <option value="">-- Please select --</option>
                    <option value="payment_issue">
                      Payment Issue (e.g., Debited but Not Received)
                    </option>
                    <option value="account_issue">Account Access Issue</option>
                    <option value="transaction_issue">
                      Transaction Dispute
                    </option>
                    <option value="fraud_issue">
                      Report Fraudulent Activity
                    </option>
                    <option value="other_issue">Other Issue</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="issueDescription"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Describe Your Issue:
                  </label>
                  <textarea
                    id="issueDescription"
                    rows="4"
                    required
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 resize-y"
                    placeholder="Please describe the issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-center transition"
                  disabled={isLoading} // Disable submit button while loading
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Submitting...
                    </>
                  ) : (
                    <>
                      <FaExclamationCircle className="mr-2" /> Submit Complaint
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Contact;
