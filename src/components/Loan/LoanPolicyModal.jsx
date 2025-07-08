// src/components/Loan/LoanPolicyModal.jsx
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

// Loan Policy Modal
const LoanPolicyModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl relative max-h-[90vh] overflow-hidden flex flex-col" // Added flex-col and overflow-hidden
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-2xl"
              aria-label="Close policy modal"
            >
              <IoClose />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center flex-shrink-0"> {/* flex-shrink-0 to prevent title from shrinking */}
              Loan Policy - Coders Bank of India Ltd.
            </h3>
            <div className="text-xs text-gray-700 space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow"> {/* flex-grow and custom-scrollbar */}
              <p>
                Welcome to the official loan policy of{" "}
                <strong>CBI (Coders Bank of India Ltd.)</strong>.
              </p>
              <p>
                By proceeding with this loan, you agree to the terms and conditions as defined under the Reserve Bank of Coders Act.
              </p>
              <ul className="list-disc pl-5 space-y-2"> {/* Changed list-inside to pl-5 for better alignment */}
                <li>
                  <span className="text-purple-600 font-semibold">Loan Eligibility: </span>  Eligibility for any loan product is subject to a comprehensive assessment of the applicant's creditworthiness, financial history, and verification of all submitted documents (KYC, income proofs, etc.). The bank reserves the right to approve or reject any loan application.
                </li>
                <li>
                  <span className="text-purple-600 font-semibold">Interest Rates </span> : Interest rates are competitive and may be fixed or floating. The applicable rate will be clearly communicated in your loan agreement. Changes to floating rates will be notified in accordance with regulatory guidelines.
                </li>
                <li>
                   <span className="text-purple-600 font-semibold">Processing Fees: </span> A one-time non-refundable processing fee, inclusive of applicable taxes, is levied at the time of loan disbursement. This fee covers administrative and operational costs.
                </li>
                <li>
                   <span className="text-purple-600 font-semibold"> Loan Tenure & Repayment: </span> Loan tenure varies by product type. Repayment is through Equated Monthly Installments (EMIs) via auto-debit from your linked bank account. Timely repayments are crucial to maintaining a good credit score.
                </li>
                <li>
                   <span className="text-purple-600 font-semibold">Prepayment & Foreclosure: </span> Partial or full prepayment of the loan is allowed. Applicable prepayment charges may apply as per the loan agreement and prevailing bank policy.
                </li>
                <li>
                    <span className="text-purple-600 font-semibold">Penalties for Default: </span> Non-payment or delay in EMI payments will attract penal interest charges as per the agreed terms and may negatively impact your credit score and future borrowing capacity.
                </li>
                <li>
                   <span className="text-purple-600 font-semibold">Maximum Loan Limit: </span>  A single customer can avail a <span className="text-red-500 font-semibold">maximum of two concurrent loan. </span> (E.g., 1 personal loan and 1 car loan).
                </li>
                <li>
                   <span className="text-purple-600 font-semibold"> Document Verification:</span>All submitted documents are subject to thorough verification. Any discrepancy or misrepresentation of facts may lead to the cancellation of the loan and legal action.
                </li>
                <li>
                   <span className="text-purple-600 font-semibold"> Changes to Policy:</span>  CBI reserves the right to amend or update its loan policies, terms, and conditions at any time, with prior notice to customers where required by law.
                </li>
              </ul>
              <p className="font-semibold text-center mt-4">
                *All loan products are subject to CBI's internal policies and regulatory compliance.*
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

export default LoanPolicyModal;