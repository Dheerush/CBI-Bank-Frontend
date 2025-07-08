"use client"; // This directive is necessary for client-side interactivity in Next.js

import React, { useEffect, useState, useCallback } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import HeaderName from "@/components/reusable/HeaderName";
import { txn_type } from "@/utils/constant"; // Assuming this provides color/desc for transaction types
import dayjs from "dayjs"; // For easy date and time formatting

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false); // State to toggle showing all transactions or just the last 5

  // Memoized function to fetch transactions
  const fetchTransactions = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await axiosClient.get("/amount/all-transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        // Sort transactions by 'createdAt' in descending order (newest first).
        // This ensures that .slice(0, 5) will always get the 5 most recent transactions.
        const sortedTransactions = res.data.transactions.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sortedTransactions);
      } else {
        setError(res.data.message || "Failed to fetch transactions.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.message || "Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect hook to call fetchTransactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Depend on fetchTransactions to satisfy useCallback's dependency array

  // Determine which transactions to display based on 'showAll' state
  // `transactions.slice(0, 5)` will get the first 5 elements from the sorted array (most recent)
  const transactionsToDisplay = showAll
    ? transactions
    : transactions.slice(0, 5);

  // Function to toggle between showing all and showing only the last 5
  const handleToggle = () => setShowAll((prev) => !prev);

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header component */}
      <HeaderName />

      <div className="w-11/12 mx-auto px-4 py-4 border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b-gray-300 border-b">
          Transaction History
        </h2>

        {/* Conditional rendering for loading, error, and no transactions */}
        {loading ? (
          <p className="text-center mt-6 text-gray-600">Loading transactions...</p>
        ) : error ? (
          <p className="text-center mt-6 text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          <>
            {/* Scrollable container for the table */}
            <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header: Made sticky */}
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRANSACTION ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIME</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REMARK</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                  </tr>
                </thead>
                {/* Table Body: CAREFULLY CHECK THIS SECTION FOR ANY EXTRA WHITESPACE OR NEWLINES */}
                {/* The opening `{` of the map should ideally be immediately after the `>` of <tbody> for robustness */}
                <tbody className="bg-white divide-y divide-gray-200 text-sm">{transactionsToDisplay.map((txn, index) => {
                    const {
                      _id,
                      amount,
                      type,
                      remark,
                      createdAt,
                      isSuccess,
                      razorpayPaymentId,
                    } = txn;
                    const typeMeta = txn_type[type] || {}; // Get metadata for transaction type

                    return (
                      // Ensure no whitespace between <tr> and the first <td>, and the last <td> and </tr>
                      <tr key={_id}><td className="px-4 py-4 text-xs whitespace-nowrap text-gray-500">{index + 1}</td>
                        <td className="px-4 py-4 text-xs whitespace-nowrap text-gray-900 overflow-hidden text-ellipsis max-w-xs">
                          {razorpayPaymentId || _id} {/* Prefer Razorpay ID, fallback to _id */}
                        </td>
                        <td className="px-4 py-4 text-xs whitespace-nowrap text-gray-500">
                          {dayjs(createdAt).format("DD/MM/YYYY HH:mm")} {/* Format date/time */}
                        </td>
                        <td className="px-4 py-4 text-xs whitespace-nowrap font-medium" style={{ color: typeMeta.color || "#000" }}>
                          {typeMeta.desc || type}
                        </td>
                        <td className="px-4 py-4 text-xs whitespace-nowrap text-gray-700">₹{amount}</td>
                        <td className="px-4 py-4 text-xs whitespace-normal text-gray-600"> {/* whitespace-normal for remarks that might wrap */}
                          {remark || "-"} {/* Display remark, or '-' if empty */}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {isSuccess ? (
                            <span className="text-green-600 font-medium text-xs">Success ✅</span>
                          ) : (
                            <span className="text-red-600 font-medium text-xs">Failed ❌</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}</tbody>
              </table>
            </div>

            {/* "See All Transactions" / "See Less" Button */}
            {/* Only show the button if there are more than 5 transactions */}
            {transactions.length > 5 && (
              <div className="text-center mt-4">
                <button
                  onClick={handleToggle}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {showAll ? "Show Less Transactions" : "Show All Transactions"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Transaction;
