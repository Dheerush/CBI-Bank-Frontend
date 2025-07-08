"use-client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import OTPInput from "../reusable/OTPInput";

const LoanApplicationModal = ({
  isOpen,
  onClose,
  details,
  onConfirm,
  onRequestOtp,
}) => {
  // All hooks must be declared unconditionally at the top level
  const [otp, setOtp] = useState(new Array(6).fill("")); // Initialize OTP as an array of 6 empty strings
  const [isConfirming, setIsConfirming] = useState(false); // State for the final confirmation button
  const [isOtpRequesting, setIsOtpRequesting] = useState(false); // State for the "Send OTP" button loading
  const [hasRequestedOtp, setHasRequestedOtp] = useState(false); // State to track if OTP has been successfully requested

  const otpInputRefs = useRef([]); // Ref to manage focus for OTP inputs

  // Effect to focus the first OTP input when OTP has been requested and modal is open
  useEffect(() => {
    if (isOpen && hasRequestedOtp) {
      // Small delay to ensure input fields are rendered before focusing
      const timer = setTimeout(() => {
        const firstOtpInput = document.getElementById("otp-0");
        if (firstOtpInput) {
          firstOtpInput.focus();
        }
      }, 100); // Adjust delay if needed
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasRequestedOtp]);

  const handleOtpChange = (newOtpArray) => {
    setOtp(newOtpArray);
  };

  const handleSendOtpClick = async () => {
    setIsOtpRequesting(true);
    try {
      const success = await onRequestOtp(); // Call the parent's OTP request handler
      if (success) {
        setHasRequestedOtp(true); // Mark that OTP has been successfully requested
        // toast.info("OTP sent! Please enter it to confirm."); // Moved toast to parent for more control if needed
      }
    } finally {
      setIsOtpRequesting(false);
    }
  };

  const handleConfirmClick = async () => {
    const enteredOtp = otp.join(""); // Join the array to get the full OTP string
    if (!enteredOtp || enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    if (isNaN(enteredOtp)) {
      toast.error("OTP must be numeric.");
      return;
    }

    setIsConfirming(true);
    try {
      // The onConfirm function (handleLoanConfirmation in parent) will handle the actual API call
      // and any success/error toasts or state changes based on the response.
      await onConfirm(details.originalValues, enteredOtp);
      // If onConfirm completes successfully without throwing, it means the parent handled everything.
      // We don't close the modal here directly; the parent is responsible for that if it reloads or navigates.
    } catch (error) {
      // This catch block will only be hit if onConfirm explicitly re-throws an error.
      // The error toast should come from onConfirm in the parent.
      console.error(
        "Error during modal confirmation (passed to parent):",
        error
      );
      // No toast here as parent handles it
    } finally {
      setIsConfirming(false);
      // We don't reset OTP or hasRequestedOtp here after a failed confirmation,
      // as the user might want to re-enter OTP or retry.
      // This should only be reset upon successful application or explicit close.
    }
  };

  // Early return statement should come AFTER all hook declarations
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full transform transition-all scale-95 md:scale-100 ease-out duration-300">
        <h2 className="text-xl font-bold text-center text-blue-700 mb-4">
          Confirm Your Loan Application
        </h2>
        <p className="text-gray-700 mb-4 text-center">
          Please review the details below.
          {!hasRequestedOtp &&
            " Click 'Send OTP' to receive a confirmation code."}
          {hasRequestedOtp &&
            " Enter the OTP sent to your registered email/phone to confirm."}
        </p>

        {details && (
          <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm font-semibold">
            <p>
              <span className="text-gray-600">Loan Category:</span>{" "}
              <span className="text-blue-800 capitalize">
                {details.category}
              </span>
            </p>
            <p>
              <span className="text-gray-600">Loan Amount:</span>{" "}
              <span className="text-green-700">
                ₹{details.amount.toFixed(2)}
              </span>
            </p>
            <p>
              <span className="text-gray-600">Loan Tenure:</span>{" "}
              <span className="text-blue-800">
                {details.tenureYears} Year{details.tenureYears > 1 ? "s" : ""} (
                {details.tenureMonths} Months)
              </span>
            </p>
            <p>
              <span className="text-gray-600">Annual Interest Rate:</span>{" "}
              <span className="text-red-600">
                {details.annualInterestRate}%
              </span>
            </p>
            <p>
              <span className="text-gray-600">Processing Fee:</span>{" "}
              <span className="text-red-600">
                ₹{details.processingFee.toFixed(2)}
              </span>
            </p>
            <p className="mt-2 text-lg font-bold">
              <span className="text-gray-600">Estimated Monthly EMI:</span>{" "}
              <span className="text-purple-700">
                ₹{details.estimatedEMI.toFixed(2)}
              </span>
            </p>
            {details.originalValues.remarks && (
              <p className="mt-2">
                <span className="text-gray-600">Your Remarks:</span>{" "}
                <span className="italic">
                  "{details.originalValues.remarks}"
                </span>
              </p>
            )}
          </div>
        )}

        {/* OTP Input Field - shown only after OTP is requested */}
        {hasRequestedOtp && (
          <div className="mb-4">
            <label
              htmlFor="otp-input"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Enter OTP <span className="text-pink-600">*</span>
            </label>
            <OTPInput value={otp} onChange={handleOtpChange} length={6} />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 text-sm font-semibold"
            disabled={isConfirming || isOtpRequesting}
          >
            Cancel
          </button>
          {!hasRequestedOtp ? (
            <button
              onClick={handleSendOtpClick}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isOtpRequesting}
            >
              {isOtpRequesting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          ) : (
            <button
              onClick={handleConfirmClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isConfirming}
            >
              {isConfirming ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  Confirming...
                </>
              ) : (
                "Confirm Application"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationModal;
