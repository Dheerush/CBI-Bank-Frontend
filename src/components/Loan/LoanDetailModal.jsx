// src/components/LoanDetailModal.jsx
// src/components/LoanDetailModal.jsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

const LoanDetailModal = ({ isOpen, onClose, loan }) => {
  const router = useRouter();

  const handleApplyClick = () => {
    onClose(); // Close modal before navigating
    router.push('/apply-loans'); // Redirect to apply-loans page
  };

  return (
    <AnimatePresence>
      {isOpen && ( // Only render if isOpen is true for AnimatePresence to detect
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }} // Start with opacity 0 for fade-in
          animate={{ opacity: 1 }} // Animate to opacity 1
          exit={{ opacity: 0 }}    // Animate to opacity 0 on exit
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative"
            // Animation for the modal content itself (fade in and scale up)
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }} // Control animation speed and easing
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close"
            >
              <FaTimes className="text-2xl" />
            </button>

            <h3 className="text-2xl font-bold text-blue-800 mb-4 border-b pb-2">
              {loan.title} Details
            </h3>

            <p className="text-gray-700 mb-4">{loan.description}</p>

            {/* Features List */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                <FaCheckCircle className="mr-2 text-blue-500" /> Key Features
              </h4>
              <ul className="space-y-2 text-gray-800">
                {/* Use optional chaining (?) for loan.features to prevent errors if loan is null */}
                {loan?.features && Object.entries(loan.features).map(([key, value]) => (
                  <li key={key} className="flex justify-between items-center text-sm">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="ml-2 text-right">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply Button */}
            <div className="text-center">
              <button
                onClick={handleApplyClick}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
              >
                Apply Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoanDetailModal;