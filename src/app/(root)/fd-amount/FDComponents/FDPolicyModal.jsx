// components/FDComponents/FDPolicyModal.jsx
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const FDPolicyModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking outside
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close FD policy modal"
            >
              <IoClose />
            </button>

            {/* Modal Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center flex-shrink-0">
              Fixed Deposit Policy - CBI Bank
            </h3>

            {/* Policy Content - Scrollable */}
            <div className="text-xs text-gray-700 space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
              <p>
                Welcome to the Fixed Deposit policy of <strong>CBI (Coders Bank of India Ltd.)</strong>.
                By opening a Fixed Deposit account, you agree to the following terms and conditions.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                <span className='text-purple-700 font-semibold'>  Minimum Deposit Amount:</span>  The minimum amount required to open an FD is ₹500.
                </li>
                <li>
                  <span className='text-purple-700 font-semibold'>Tenure Options: </span>  FDs can be opened for a minimum tenure of 1 year and a maximum of 10 years.
                </li>
                <li>
                 <span className='text-purple-700 font-semibold'> Interest Rates:</span>   Interest rates are fixed for the chosen tenure and are subject to change at the bank's discretion for new deposits. The rate applicable will be the rate prevailing on the date of deposit.
                </li>
                <li>
                 <span className='text-purple-700 font-semibold'>Interest Payout:</span>  Interest can be paid out monthly, quarterly, half-yearly, annually, or compounded and paid at maturity, as per your selection.
                </li>
                <li>
                 <span className='text-purple-700 font-semibold'> Premature Withdrawal:</span>   Premature withdrawal of Fixed Deposits is generally allowed, but it may attract a penalty (e.g., 0.5% to 1% less than the applicable interest rate for the period the deposit remained with the bank).
                </li>
                <li>
                  <span className='text-purple-700 font-semibold'> Tax Deducted at Source (TDS):</span>  Interest earned on FDs is subject to TDS as per prevailing income tax laws. You may submit Form 15G/15H to avoid TDS if eligible.
                </li>
                <li>
                 <span className='text-purple-700 font-semibold'> Nomination Facility:</span>   Nomination facility is available for all Fixed Deposit accounts.
                </li>
                <li>
                 <span className='text-purple-700 font-semibold'>Auto-Renewal: </span>   You can opt for auto-renewal of your FD upon maturity, where the principal and/or interest will be re-invested for the same tenure at the prevailing interest rate.
                </li>
                <li>
                  <span className='text-purple-700 font-semibold'>Loan Against FD</span> : You can avail a loan against your Fixed Deposit, typically up to 90% of the deposit value, at a slightly higher interest rate than the FD rate.
                </li>

              </ul>
              <p className="font-semibold text-center mt-4">
                *All Fixed Deposit products are subject to CBI's internal policies and regulatory compliance.*
              </p>
              <p className="text-center italic mt-2">
                For complete details and personalized guidance, please visit your nearest CBI branch or contact our customer service helpline.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FDPolicyModal;