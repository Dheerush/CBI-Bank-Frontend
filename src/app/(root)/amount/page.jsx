"use client";
import React, { useEffect, useState } from "react";
import HeaderName from "@/components/reusable/HeaderName";
import AddAmountModel from "@/components/Amount/AddAmountModel"; // Assuming this is your AddAmountModel
import { useMainContext } from "@/context/MainContext"; // Correct context hook
import { HiArrowCircleRight } from "react-icons/hi"; // Icon for navigation/action
import { MdOutlineAccountBalanceWallet, MdSend } from "react-icons/md"; // Icons for sections
import { IoInformationCircleOutline } from "react-icons/io5"; // Info icon
import TransferPolicyModal from "@/components/Amount/TransferAmount/TransferPolicyModal";
import TransferMoneyModal from "@/components/Amount/TransferAmount/TransferMoneyModal";
import AddPayeeModal from "@/components/Amount/TransferAmount/AddPayeeModal";
import { toast } from "react-toastify";
import { axiosClient } from "@/utils/AxiosClient";

const AmountPage = () => {
  // Use 'loading' directly from your context
  const { user, loading } = useMainContext();
  const [payees, setPayees] = useState([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false); // State for transfer modal
  const [isTransferPolicyOpen, setIsTransferPolicyOpen] = useState(false);
  const [isAddPayeeModalOpen, setIsAddPayeeModalOpen] = useState(false);

  // Display a loader while user data is being fetched
  if (loading) {
    return (
      <div className="w-full px-4 py-6">
        <HeaderName />
        <div className="mt-6 text-center text-lg font-medium text-gray-600 animate-pulse">
          Loading user data...
        </div>
      </div>
    );
  }

  //API Call for getting all the payees
  const fetchPayees = async () => {
  const token = localStorage.getItem("token");

  // ✅ Skip the call if token is missing or user is not available
  if (!user || !token) {
    console.log("User not logged in. Skipping payee fetch.");
    return;
  }

  try {
    const response = await axiosClient.get("/payee/all-payees", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (response.data.success) {
      setPayees(response.data.data);
    } else {
      toast.error(response.data.message || "Failed to fetch payees");
    }
  } catch (error) {
    console.error("Error while fetching Payees", error);
    toast.error(
      error.response?.data?.message || "Error while fetching Payees"
    );
  }
};


  useEffect(() => {
    if (user) {
      fetchPayees();
    }
  }, [user]);

  // Safely access user properties using optional chaining (?) or logical OR (||)
  const accountNumber = user?.account_number || "N/A";
  const currentBalance =
    user?.amount !== undefined ? `₹${Number(user.amount).toFixed(2)}` : "N/A"; // Removed trailing "/-"

  return (
    <div className="w-full px-4 py-6 md:p-8 lg:p-12">
      <HeaderName />

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Add Amount Card */}
        <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:scale-[1.01] transition-all duration-300 hover:cursor-pointer">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MdOutlineAccountBalanceWallet className="text-green-700 text-3xl" />
              <h1 className="text-2xl font-bold text-gray-800">Add Amount</h1>
            </div>
            <p className="text-sm text-gray-600">
              Account Number:{" "}
              <span className="font-semibold text-gray-800">
                {accountNumber}
              </span>
            </p>
            <p className="text-base text-gray-700">
              Current balance:{" "}
              <span className="text-green-700 font-extrabold text-lg">
                {currentBalance}
              </span>
            </p>
          </div>
          <AddAmountModel />
        </div>

        {/* Transfer Money Card */}
        <div
          className="flex-1 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 "
          onClick={() => {
            /* Implement transfer money modal/navigation here */
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MdSend className="text-red-700 text-3xl" />
              <div className="text-2xl font-bold text-neutral-700">
                Transfer Money
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold">
              Account Number:{" "}
              <span className="text-gray-800">{accountNumber}</span>
            </p>
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-xs font-semibold text-green-700">
                IMPS | 24 X 7 | Zero Charges | Secure Payment
              </p>
              <p className="text-xs text-gray-600 transition-colors cursor-pointer flex items-center gap-1 mt-2">
                <IoInformationCircleOutline className="text-blue-600 text-base" />
                <span
                  className="underline text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    setIsTransferPolicyOpen(true);
                  }}
                >
                  Click here
                </span>
                to read our Transfer Policy
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 bg-red-600 text-white font-semibold p-1 rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 text- md:text-sm sm:text-sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card's onClick from firing
              // Implement transfer money action, e.g., open a specific modal
              setIsTransferModalOpen(true); // Assuming you have a TransferMoneyModel to open
            }}
          >
            Make the Payment <HiArrowCircleRight className="text-3xl" />
          </button>
        </div>
      </div>
      <TransferPolicyModal
        isOpen={isTransferPolicyOpen}
        onClose={() => setIsTransferPolicyOpen(false)}
      />
      <TransferMoneyModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        payees={payees}
        onAddPayeeClick={() => setIsAddPayeeModalOpen(true)}
      />
      <AddPayeeModal
        isOpen={isAddPayeeModalOpen}
        onClose={() => {
          setIsAddPayeeModalOpen(false);
          fetchPayees(); // refresh payees
        }}
      />
    </div>
  );
};

export default AmountPage;
