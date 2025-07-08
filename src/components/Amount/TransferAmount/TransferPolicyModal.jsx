"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const TransferPolicyModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
            >
              <IoClose size={24} />
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold text-purple-700 mb-4 underline">
              CBI Bank : Money Transfer Policy
            </h2>

            <ul className="list-disc pl-5 text-gray-700 space-y-2 text-xs">
              <li>
                The user can <strong> only transfer money to the payee</strong>{" "}
                he/she has added by him/her. User firstly needs to add the payee.
              </li>
              <li>
                All transfers are secured using industry-standard encryption.
              </li>
              <li>
                IMPS transfers are available <strong>24x7</strong>, including
                holidays.
              </li>
              <li>
                Minimum transfer amount is <strong>₹1</strong>.
              </li>
              <li>
                Maximum transfer limit per transaction is{" "}
                <strong>₹5,00,000</strong>.
              </li>
              <li>
                Please verify the payee details carefully before confirming a
                transfer.
              </li>
              <li>
                Transactions once initiated <strong>cannot be reversed</strong>{" "}
                if processed.
              </li>
              <li>
                For large transfers, additional <strong>KYC checks</strong> may
                apply.
              </li>
              <li>
                All transfers require <strong>OTP authentication</strong>.
              </li>
              <li>
                In case of failed transfers, the refund will be processed within
                <strong> 2–3 working days</strong>.
              </li>
              <li>
                Repeated failed attempts may temporarily{" "}
                <strong>restrict account access</strong> for security.
              </li>
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransferPolicyModal;
