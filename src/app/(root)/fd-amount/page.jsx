"use client";

import React, { useCallback, useState, useEffect, Suspense } from "react";
import HeaderName from "@/components/reusable/HeaderName"; // Assuming this is correct
import { RiAddBoxFill } from "react-icons/ri";
import FDPolicyModal from "./FDComponents/FDPolicyModal"; // Assuming this is correct
import AddNewFDModal from "./FDComponents/AddNewFDModal"; // Assuming this is correct
import { axiosClient } from "@/utils/AxiosClient"; // Assuming this is correct
import { toast } from "react-toastify"; // Assuming this is correct
import FDTableCard from "./FDComponents/FDTableCard";
import ClaimConfirmationModal from "./FDComponents/ClaimConfirmationModal";

const FDPage = () => {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isAddNewFDModalOpen, setIsAddNewFDModalOpen] = useState(false);
  const [allFd, setAllFd] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [fdToConfirm, setFdToConfirm] = useState(null); // This state holds the FD object for the claim modal

  const fetchAllFD = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      setAllFd([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axiosClient.get("fd/my-fds", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const fetchedFDs = response.data.data || [];
        const sortedFDs = fetchedFDs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllFd(sortedFDs);
      } else {
        setError(response.data.message || "Failed to fetch FDs.");
        setAllFd([]);
      }
    } catch (err) {
      console.error("Error fetching FDs:", err);
      setError(err.response?.data?.message || "Failed to fetch FDs.");
      setAllFd([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFD();
  }, [fetchAllFD]);

  const visibleFDs = showAll ? allFd : allFd.slice(0, 5);

  const handleToggleShowAll = () => setShowAll(!showAll);

  // This function is passed to FDTableCard via the 'onClaim' prop.
  // When FDTableCard calls it, it passes the FD object that needs confirmation.
  const handleClaimFD = (fd) => {
    setFdToConfirm(fd); // Set this state to the FD object, which opens the modal
  };

  // This function is called by the ClaimConfirmationModal after a successful claim.
  const handleClaimConfirmedAndRefresh = () => {
    setFdToConfirm(null); // Close the confirmation modal
    fetchAllFD(); // Refresh the FD list to show the updated status
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Fixed Deposits</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your fixed deposit accounts efficiently.
        </p>
      </div>

      {/* Action Panel */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <button
          onClick={() => setIsAddNewFDModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg text-xs flex items-center gap-2 shadow-md transition-all duration-200"
        >
          <RiAddBoxFill className="text-white text-xl" />
          Create New FD
        </button>

        <div className="text-sm text-gray-700">
          <span
            className="text-blue-600 underline hover:text-blue-700 cursor-pointer transition-colors duration-200"
            onClick={() => setIsPolicyModalOpen(true)}
          >
            Read Fixed Deposit Policy
          </span>
        </div>
      </div>

      {/* FD List / Empty State */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center">
        {loading && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 animate-pulse">
              Loading Fixed Deposits...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && allFd.length === 0 && (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Fixed Deposits Found
            </h2>
            <p className="text-sm text-gray-500">
              Create your first fixed deposit to see it listed here.
            </p>
          </div>
        )}

        {!loading && !error && allFd.length > 0 && (
          <>
            <div className="max-h-[500px] overflow-y-auto overflow-x-auto border border-gray-300 rounded-md shadow-inner">
              <table className="w-full min-w-[800px] table-auto border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                  <tr className="text-sm text-gray-700 uppercase">
                    <th className="p-3 text-left border-b border-gray-300 w-[5%]">
                      #
                    </th>
                    <th className="p-3 text-left border-b border-gray-300 w-[40%] sm:w-[20%] md:w-[10%]">
                      FD Details
                    </th>
                    <th className="p-3 text-left border-b border-gray-300 w-[25%]">
                      Status
                    </th>
                    <th className="p-3 text-left border-b border-gray-300 w-[30%]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {visibleFDs.map((fd, index) => (
                    <Suspense
                      key={fd._id}
                      fallback={
                        <tr>
                          <td
                            colSpan={4}
                            className="p-3 text-center text-gray-500"
                          >
                            Loading FD details...
                          </td>
                        </tr>
                      }
                    >
                      {/* Pass the actual fd object to FDTableCard, and the handleClaimFD function */}
                      <FDTableCard
                        fd={fd}
                        index={index}
                        onClaim={handleClaimFD} // This prop is called by FDTableCard when "Claim" is clicked
                      />
                    </Suspense>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show All/Less Button */}
            {allFd.length > 5 && (
              <div className="text-center mt-6">
                <button
                  onClick={handleToggleShowAll}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold shadow-md"
                >
                  {showAll ? "Show Less FDs" : "Show All FDs"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals - Rendered OUTSIDE the table structure */}
      <FDPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />

      <AddNewFDModal
        isOpen={isAddNewFDModalOpen}
        onClose={() => {
          setIsAddNewFDModalOpen(false);
          fetchAllFD(); // Refresh FDs after a new one is added
        }}
        onFdCreated={fetchAllFD} // Prop to trigger refresh from modal
      />

      {/* Claim Confirmation Modal - Only render if fdToConfirm is set */}
      {fdToConfirm && ( // This ensures the modal is only in the DOM when needed
        <ClaimConfirmationModal
          isOpen={!!fdToConfirm} // isOpen prop should be true when fdToConfirm exists
          onClose={() => setFdToConfirm(null)} // Close the modal by clearing fdToConfirm
          onConfirm={handleClaimConfirmedAndRefresh} // Callback after claim success in the modal
          fdToClaim={fdToConfirm} // Pass the complete FD object to the modal for display/processing
        />
      )}
    </div>
  );
};

export default FDPage;