// src/app/service/page.jsx or src/components/Service.jsx
"use client";

import React, { useState } from "react";
// Import all necessary icons
import { FaHome, FaCarSide, FaMoneyBillWave, FaGraduationCap, FaCoins, FaHandshake, FaCreditCard, FaPiggyBank, FaRegBuilding, FaGlobe, FaWifi, FaMobileAlt, FaWallet, FaShieldAlt, FaChartLine, FaLock } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

// Import your loan data
import { loanItems } from "@/assets/loanDetails";
import LoanDetailModal from "@/components/Loan/LoanDetailModal";

// Import motion from framer-motion
import { motion } from "framer-motion";

// --- Framer Motion Variants ---
// Variants for the container (the grid div)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the animation of children by 0.1 seconds
      delayChildren: 0.2,   // Delay the start of children animations by 0.2 seconds
    },
  },
};

// Variants for each item (the ServiceCard)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4, // Duration for each item's animation
      ease: "easeOut",
    },
  },
};

// --- ServiceCard Component (Reusable) ---
// Now accepts an onKnowMoreClick prop and optional 'loan' prop
// Changed to motion.div to apply Framer Motion variants
const ServiceCard = ({ icon: Icon, title, description, onKnowMoreClick, className = "" }) => {
  return (
    // Apply itemVariants to the motion.div
    <motion.div variants={itemVariants} className={`flex flex-col items-center p-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out text-center ${className} h-full select-none`}>
      {Icon && <Icon className="text-blue-600 text-4xl mb-3" />}
      <h4 className="font-semibold text-sm mb-1 text-gray-800">{title}</h4>
      {description && <p className="text-xs text-gray-600 px-2 mb-4">{description}</p>} {/* Added mb-4 for spacing */}
      {onKnowMoreClick && ( // Conditionally render button
        <button
          onClick={onKnowMoreClick}
          className="mt-auto px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors duration-300 shadow-sm"
        >
          Click to Know More
        </button>
      )}
    </motion.div>
  );
};

// --- Main Service Component ---
const Service = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const openModal = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  return (
    <div className="w-11/12 mx-auto py-8">
      <h1 className="text-2xl sm:text-2xl font-bold text-gray-800 mb-8 border-b-2 border-gray-100 pb-2 ">
        Services & Offers
      </h1>

      {/* --- Loans & Credit Facilities Section --- */}
      <section className="mb-12">
        <h2 className="text-base font-semibold text-gray-700 mb-6 pb-1 border-b border-gray-300">
          Loans & Credit Facilities
        </h2>
        {/* Apply containerVariants to the motion.div that wraps the grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 "
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Animate when the section comes into view
          viewport={{ once: true, amount: 0.2 }} // Only animate once, when 20% of the element is visible
        >
          {loanItems.map((loan) => ( // Map over loanItems data
            <ServiceCard
              key={loan.id}
              icon={loan.icon} // Use icon from loan data
              title={loan.title}
              description={loan.description}
              onKnowMoreClick={() => openModal(loan)} // Pass handler to open modal with specific loan
            />
          ))}
        </motion.div>
      </section>

      {/* --- Accounts & Deposits Section --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-1 border-b border-gray-300">
          Accounts & Deposits
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ServiceCard
            icon={FaPiggyBank}
            title="Savings Account"
            description="Secure your savings with attractive interest rates."
          />
          <ServiceCard
            icon={FaRegBuilding}
            title="Current Account"
            description="Manage your business transactions efficiently."
          />
          <ServiceCard
            icon={FaCoins}
            title="Fixed Deposits"
            description="Grow your wealth with high-yield fixed deposits."
          />
          <ServiceCard
            icon={FaIndianRupeeSign}
            title="Recurring Deposits"
            description="Save systematically with flexible recurring deposit schemes."
          />
        </motion.div>
      </section>

      {/* --- Digital Banking & Payments Section --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-1 border-b border-gray-300">
          Digital Banking & Payments
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ServiceCard
            icon={FaWifi}
            title="Internet Banking"
            description="Bank anytime, anywhere with our secure online platform."
          />
          <ServiceCard
            icon={FaMobileAlt}
            title="Mobile Banking"
            description="Access banking services on the go with our mobile app."
          />
          <ServiceCard
            icon={FaWallet}
            title="UPI Payments"
            description="Instant and secure payments via UPI."
          />
          <ServiceCard
            icon={FaCreditCard}
            title="Debit Cards"
            description="Convenient access to your funds with our debit cards."
          />
        </motion.div>
      </section>

      {/* --- Special Offers & Benefits Section --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-1 border-b border-gray-300">
          Special Offers & Benefits
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ServiceCard
            icon={FaGlobe}
            title="Airport Lounge Access"
            description="Enjoy complimentary lounge access with select premium cards."
          />
          <ServiceCard
            icon={FaCoins}
            title="Cash & Reward Points"
            description="Earn 10 Reward Points for every ₹500 spent on your cards."
          />
          <ServiceCard
            icon={FaShieldAlt}
            title="Insurance Solutions"
            description="Comprehensive insurance plans for life, health, and more."
          />
          <ServiceCard
            icon={FaChartLine}
            title="Wealth Management"
            description="Expert advice to grow and manage your investments."
          />
        </motion.div>
      </section>

      {/* --- Other Important Services Section --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-1 border-b border-gray-300">
          Other Services
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ServiceCard
            icon={FaLock}
            title="Locker Facilities"
            description="Secure your valuables with our safe deposit lockers."
          />
          <ServiceCard
            icon={FaGlobe}
            title="Forex Services"
            description="Smooth currency exchange for your international travel."
          />
        </motion.div>
      </section>

      {/* Loan Detail Modal */}
      <LoanDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        loan={selectedLoan}
      />
    </div>
  );
};

export default Service;