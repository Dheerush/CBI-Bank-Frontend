"use client";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";

const ClaimConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  // Remove 'fd' prop as it's not being passed from FDPage
  fdToClaim, // Use this as the primary prop for the FD object
}) => {
  const token = localStorage.getItem("token") || "";
  const [loading, setLoading] = useState(false);

  // derive isMatured and fdId from fdToClaim
  const fdId = fdToClaim?._id;


  const isMatured = fdToClaim?.maturityDate
    ? dayjs().isAfter(dayjs(fdToClaim.maturityDate))
    : false;


  const modalTitle = isMatured
    ? "Confirm Matured FD Payout"
    : "Confirm FD Claim (Premature)";

  const modalMessage = isMatured
    ? "This Fixed Deposit has matured. You will receive the full maturity amount."
    : "Claiming a premature FD may impose a penalty as per policy. This action cannot be undone.";

  const claimFD = useCallback(async () => {
    if (!token || !fdId) {
      toast.error("Something went wrong. Try again.");
      setLoading(false); // Ensure loading is reset even on early exit
      onClose(); // Close modal even on error if ID is missing
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post(
        `fd/claim/${fdId}`,
        {}, // Send an empty object because in the body we expect empty data
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("FD claimed successfully.");
        onConfirm(); // Notify parent to refresh
      } else {
        toast.error(response.data.message || "Failed to claim FD.");
      }
    } catch (error) {
      console.error("Claim FD Error:", error);
      toast.error(error.response?.data?.message || "Error occurred while claiming FD.");
    } finally {
      setLoading(false);
      onClose(); // Always close the modal after the API call (success or failure)
    }
  }, [token, fdId, onClose, onConfirm, fdToClaim]); // Add fdToClaim to dependencies of useCallback

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-md p-6 max-w-md w-full shadow-lg"
          >
            <h2
              className={`text-lg font-semibold ${
                isMatured ? "text-green-600" : "text-red-600"
              } mb-2`}
            >
              {modalTitle}
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              {modalMessage}
              <br />
              Are you sure you want to proceed?
            </p>
            {/* Display relevant FD details in the modal */}
            {fdToClaim && (
                <div className="bg-gray-50 p-3 rounded-md text-sm mb-4 border border-gray-200">
                    <p className="font-medium text-gray-800">FD Details:</p>
                    <p>Principal: ₹{fdToClaim.principalAmount?.toLocaleString("en-IN")}</p>
                    <p>Maturity: ₹{fdToClaim.maturityAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p>Policy No.: {fdToClaim._id}</p>
                </div>
            )}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                onClick={onClose}
                disabled={loading}
              >
                No, Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  loading
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white transition-colors duration-200`}
                onClick={claimFD}
                disabled={loading}
              >
                {loading ? "Processing..." : `Yes, ${isMatured ? "Payout" : "Claim it"}`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClaimConfirmationModal;