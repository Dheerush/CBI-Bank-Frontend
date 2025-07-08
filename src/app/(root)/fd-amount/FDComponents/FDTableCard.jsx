"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const FDTableCard = ({ fd, index, onClaim }) => {
  // const [showModal, setShowModal] = useState(false); // This state is no longer needed here

  if (!fd) {
    return (
      <tr>
        <td colSpan={4} className="p-3 text-center text-gray-500">
          Invalid FD data.
        </td>
      </tr>
    );
  }

  const isMatured = fd.maturityDate
    ? dayjs().isAfter(dayjs(fd.maturityDate))
    : false;

  const isClaimedFromStatus = [
    "claimed",
    "withdrawn",
    "closed",
    "prematurely_closed",
  ].includes(fd.status);

  let statusText = fd.status;
  let statusColorClass = "text-gray-600 bg-gray-100";

  if (fd.status === "active") {
    statusText = "Active";
    statusColorClass = "text-green-600 bg-green-100";
  } else if (fd.status === "matured") {
    statusText = "Matured";
    statusColorClass = "text-red-600 bg-red-100";
  } else if (isMatured) {
    statusText = "Matured (Pending Claim)";
    statusColorClass = "text-red-600 bg-red-100";
  } else if (fd.status === "claimed") {
    statusText = "Claimed";
    statusColorClass = "text-blue-600 bg-blue-100";
  } else if (fd.status === "withdrawn") {
    statusText = "Withdrawn";
    statusColorClass = "text-yellow-600 bg-yellow-100";
  } else if (fd.status === "closed") {
    statusText = "Closed";
    statusColorClass = "text-gray-600 bg-gray-200";
  } else if (fd.status === "prematurely_closed") {
    statusText = "Prematurely Closed";
    statusColorClass = "text-orange-600 bg-orange-100";
  }

  const isClaimButtonDisabled = isClaimedFromStatus || isMatured;

  const handleClaimClick = () => {
    if (isClaimButtonDisabled) return;
    onClaim(fd); // Directly call onClaim from props, passing the FD object
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-t transition-colors duration-100"
    >
      {/* Index */}
      <td className="px-3 py-2 text-left font-medium text-gray-800">
        {index + 1}
      </td>

      {/* FD Details */}
      <td className="px-3 py-2 text-left text-gray-700">
        <div className="flex flex-col space-y-1">
          <p className="font-semibold">
            Principal: ₹{fd.principalAmount?.toLocaleString("en-IN") || "N/A"}
          </p>
          <p className="text-sm">
            Maturity:{" "}
            <span className="text-green-600 font-semibold">
              ₹
              {fd.maturityAmount?.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "N/A"}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Reason:{" "}
            <span className="text-gray-600">{fd.fdReason || "N/A"}</span>
          </p>
          <p className="text-xs text-gray-500">
            Interest:{" "}
            {fd.interestRate
              ? `${(fd.interestRate * 100).toFixed(2)}%`
              : "N/A"}
          </p>
          <p className="text-xs text-gray-500">
            Tenure:{" "}
            {fd.tenure ? `${fd.tenure} ${fd.tenureUnit || "years"}` : "N/A"}
          </p>
          <p className="text-xs text-gray-500">
            Opened:{" "}
            {fd.createdAt ? dayjs(fd.createdAt).format("DD MMM YYYY") : "N/A"}
          </p>
          <p className="text-xs text-gray-500">
            Maturity:{" "}
            {fd.maturityDate
              ? dayjs(fd.maturityDate).format("DD MMM YYYY")
              : "N/A"}
          </p>
          <p className="text-xs text-purple-700 break-words">
            Policy No.: {fd._id || "N/A"}
          </p>
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-2 text-left">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColorClass}`}
        >
          {statusText}
        </span>
      </td>

      {/* Action */}
      <td className="px-3 py-2 text-left">
        <button
          onClick={handleClaimClick}
          disabled={isClaimButtonDisabled}
          className={`px-4 py-2 rounded-md font-medium text-white transition-colors duration-200 ${
            !isClaimButtonDisabled
              ? "bg-purple-600 hover:bg-purple-700 shadow-sm"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isClaimedFromStatus
            ? "Claimed"
            : isMatured
            ? "Matured"
            : "Claim"}
        </button>
      </td>
    </motion.tr>
    // The ClaimConfirmationModal is now rendered in FDPage, not here.
  );
};

export default FDTableCard;