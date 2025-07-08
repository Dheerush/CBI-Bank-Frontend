"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiDollarSign,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiCalendar,
  FiTrendingUp,
  FiInfo,
  FiX,
  FiFileText,
} from "react-icons/fi";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import { axiosClient } from "@/utils/AxiosClient";
import { useMainContext } from "@/context/MainContext";

const LoanPage = () => {
  const router = useRouter();
  const { user } = useMainContext();
  const [activeTab, setActiveTab] = useState("ongoing");
  const [loans, setLoans] = useState({ ongoing: [], closed: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);
  const [isCloseLoanModalOpen, setIsCloseLoanModalOpen] = useState(false);
  const [isLoanDetailsModalOpen, setIsLoanDetailsModalOpen] = useState(false);
  const [installments, setInstallments] = useState([]);
  const [otp, setOtp] = useState("");
  const [remarks, setRemarks] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [loanDetails, setLoanDetails] = useState(null);
  const [isLoadingLoanDetails, setIsLoadingLoanDetails] = useState(false);
  const [isClosingLoan, setIsClosingLoan] = useState(false);

  const [loanStats, setLoanStats] = useState([
    {
      title: "Total Loans",
      value: "0",
      change: "+0",
      icon: <FiCreditCard className="text-purple-500" />,
    },
    {
      title: "Active Loans",
      value: "0",
      change: "+0",
      icon: <FiClock className="text-blue-500" />,
    },
    {
      title: "Paid Back",
      value: "₹0",
      change: "+₹0",
      icon: <FaRupeeSign className="text-green-500" />,
    },
    {
      title: "Interest Saved",
      value: "0",
      change: "+₹0",
      icon: <FiTrendingUp className="text-teal-500" />,
    },
  ]);

  // Fetch all loans
  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosClient.get("loan/all-loans", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        const allLoans = response.data.loans;
        const ongoing = allLoans.filter((loan) => loan.status === "active");
        const closed = allLoans.filter((loan) => loan.status === "closed");

        setLoans({ ongoing, closed });

        // Calculate statistics
        const totalLoans = allLoans.length;
        const activeLoans = ongoing.length;
        const paidBack = allLoans.reduce(
          (sum, loan) => sum + (loan.totalPaidAmount || 0),
          0
        );
        const interestSaved = allLoans.reduce((sum, loan) => {
          // Estimate interest saved as total interest paid
          if (loan.totalPayableAmount && loan.loanAmount) {
            return (
              sum +
              (loan.totalPayableAmount -
                loan.loanAmount -
                (loan.processingFee || 0))
            );
          }
          return sum;
        }, 0);

        setLoanStats([
          {
            title: "Total Loans",
            value: totalLoans,
            change: `+${totalLoans}`,
            icon: <FiCreditCard className="text-purple-500" />,
          },
          {
            title: "Active Loans",
            value: activeLoans,
            change: `+${activeLoans}`,
            icon: <FiClock className="text-blue-500" />,
          },
          {
            title: "Paid Back",
            value: `₹${paidBack.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            change: "",
            icon: <FaRupeeSign className="text-green-500" />,
          },
          {
            title: "Interest Saved",
            value: `₹${interestSaved.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            change: "",
            icon: <FiTrendingUp className="text-teal-500" />,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to load loan data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch installments for a loan
  const fetchInstallments = async (loanId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`loan/${loanId}/installments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setInstallments(response.data.installments);
      }
    } catch (error) {
      console.error("Error fetching installments:", error);
      toast.error("Failed to load installment details");
    }
  };

  // Send OTP to user's email
  const sendOtp = async () => {
    try {
      setIsSendingOtp(true);
      if (!user || !user.email) {
        toast.error("User email not available");
        return false;
      }

      const token = localStorage.getItem("token");
      const response = await axiosClient.post("/auth/send-otp", {
        email: user.email,
      });

      if (response.data && response.data.success) {
        toast.success("OTP sent to your email!");
        return true;
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
    return false;
  };

  // Handle EMI payment
  const handlePayEMI = async () => {
    if (!selectedInstallment || !paymentAmount || !otp) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        loanId: selectedLoan.loanId,
        installmentNumber: selectedInstallment.installmentNumber,
        otp,
        paymentAmount: parseFloat(paymentAmount),
      };

      const response = await axiosClient.post("loan/pay-emi", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        toast.success("EMI paid successfully!");
        // Refresh data
        fetchLoans();
        setIsEMIModalOpen(false);
        setOtp("");
        setPaymentAmount("");
        setSelectedInstallment(null);
      } else {
        toast.error(response.data?.message || "Failed to process payment");
      }
    } catch (error) {
      console.error("Error paying EMI:", error);
      toast.error(error.response?.data?.message || "Failed to process payment");
    }
  };

  // Handle loan closure
  const handleCloseLoan = async () => {
  if (!remarks || !otp) {
    toast.error("Please fill all fields");
    return;
  }

  setIsClosingLoan(true); // START loading

  try {
    const token = localStorage.getItem("token");
    const payload = {
      loanId: selectedLoan.loanId,
      remarks,
      otp,
    };

    const response = await axiosClient.post("loan/close-loan", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data && response.data.success) {
      toast.success("Loan closed successfully!");
      fetchLoans();
      setIsCloseLoanModalOpen(false);
      setOtp("");
      setRemarks("");
    } else {
      toast.error(response.data?.message || "Failed to close loan");
    }
  } catch (error) {
    console.error("Error closing loan:", error);
    toast.error(error.response?.data?.message || "Failed to close loan");
  } finally {
    setIsClosingLoan(false); // END loading
  }
};


  // Open EMI modal and fetch installments
  const openEMIModal = (loan) => {
    setSelectedLoan(loan);
    fetchInstallments(loan.loanId);
    setIsEMIModalOpen(true);
    setSelectedInstallment(null);
    setPaymentAmount("");
    setOtp("");
  };

  // Open close loan modal
  const openCloseLoanModal = (loan) => {
    setSelectedLoan(loan);
    setIsCloseLoanModalOpen(true);
  };

  // Fetch loan details for modal
  const fetchLoanDetails = async (loanId) => {
    try {
      setIsLoadingLoanDetails(true);
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(`loan/loan-info/${loanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setLoanDetails(response.data.loan);
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
      toast.error("Failed to load loan details");
    } finally {
      setIsLoadingLoanDetails(false);
    }
  };

  // Open loan details modal
  const openLoanDetailsModal = (loan) => {
    setSelectedLoan(loan);
    fetchLoanDetails(loan.loanId);
    setIsLoanDetailsModalOpen(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Loan Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your loans and track repayment progress
            </p>
          </div>
          <button
            onClick={() => router.push("/apply-loans")}
            className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Apply for New Loan</span>
            <FiArrowRight className="text-lg" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loanStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-gray-100">{stat.icon}</div>
              </div>
              {stat.change && (
                <p className="text-green-500 text-sm font-medium mt-3">
                  <span className="inline-flex items-center">
                    {stat.change}
                  </span>{" "}
                  this month
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Hero Image */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800/80 to-indigo-900/80 z-10 flex flex-col justify-end p-8">
              <h2 className="text-3xl font-bold text-white">
                Simplify Your Loan Journey
              </h2>
              <p className="text-purple-200 mt-2 max-w-lg">
                Pre-approved offers | Flexible installments | Competitive
                interest rates
              </p>
              <div className="flex items-center mt-6">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mr-4">
                  <FiInfo className="text-white text-xl" />
                </div>
                <p className="text-purple-100 text-sm">
                  Check your eligibility for special rates and faster approvals
                </p>
              </div>
            </div>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80" />
          </div>

          {/* Apply Loan Card */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Apply New Loan</h2>
                <p className="text-purple-100 mt-2 text-sm">
                  Get instant approval with minimal documentation
                </p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <FiDollarSign className="text-2xl" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <FiCheckCircle className="text-green-300 mr-2" />
                <span className="text-sm">Pre-approved offers</span>
              </div>
              <div className="flex items-center">
                <FiCheckCircle className="text-green-300 mr-2" />
                <span className="text-sm">Flexible repayment plans</span>
              </div>
              <div className="flex items-center">
                <FiCheckCircle className="text-green-300 mr-2" />
                <span className="text-sm">Competitive interest rates</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/apply-loans")}
              className="mt-8 w-full bg-white text-purple-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Loan Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === "ongoing"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Ongoing Loans
              </button>
              <button
                onClick={() => setActiveTab("closed")}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === "closed"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Closed Loans
              </button>
            </nav>
          </div>

          {/* Loan Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Loan Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Interest Rate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  {activeTab === "ongoing" ? (
                    <>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Next Payment
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Progress
                      </th>
                    </>
                  ) : (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Closure Date
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={activeTab === "ongoing" ? 7 : 6}
                      className="px-6 py-8 text-center"
                    >
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                      <p className="mt-2 text-gray-500">Loading loan data...</p>
                    </td>
                  </tr>
                ) : activeTab === "ongoing" ? (
                  loans.ongoing.map((loan) => (
                    <tr key={loan.loanId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 capitalize">
                          {loan.loanType.replace("_", " ")}
                        </div>
                        <div className="text-gray-500 text-sm">
                          #{loan.loanId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">
                          {formatCurrency(loan.loanAmount)}
                        </div>
                        <div className="text-gray-500 text-sm">
                          EMI: {formatCurrency(loan.monthlyEMI)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {loan.interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-indigo-500" />
                          {formatDate(loan.nextDueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${loan.loanProgress || 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {loan.loanProgress?.toFixed(2) || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEMIModal(loan)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md"
                          >
                            Pay EMI
                          </button>
                          <button
                            onClick={() => openLoanDetailsModal(loan)}
                            className="text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-md"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => openCloseLoanModal(loan)}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                          >
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  loans.closed.map((loan) => (
                    <tr key={loan.loanId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 capitalize">
                          {loan.loanType.replace("_", " ")}
                        </div>
                        <div className="text-gray-500 text-sm">
                          #{loan.loanId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">
                          {formatCurrency(loan.loanAmount)}
                        </div>
                        <div className="text-gray-500 text-sm">
                          EMI: {formatCurrency(loan.monthlyEMI)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {loan.interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-indigo-500" />
                          {formatDate(loan.updatedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openLoanDetailsModal(loan)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading &&
            activeTab === "ongoing" &&
            loans.ongoing.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-purple-50 rounded-full">
                  <FaRupeeSign className="text-3xl text-purple-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No active loans
                </h3>
                <p className="mt-1 text-gray-500 max-w-md mx-auto">
                  You currently don't have any active loans. Apply for a new
                  loan to get started.
                </p>
                <button
                  onClick={() => router.push("/apply-loans")}
                  className="mt-4 text-purple-600 font-medium hover:text-purple-500"
                >
                  Apply for a loan →
                </button>
              </div>
            )}

          {!isLoading &&
            activeTab === "closed" &&
            loans.closed.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-50 rounded-full">
                  <FiCheckCircle className="text-3xl text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No closed loans
                </h3>
                <p className="mt-1 text-gray-500 max-w-md mx-auto">
                  You haven't closed any loans yet. Your completed loans will
                  appear here.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Loan Details Modal */}
      {isLoanDetailsModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Loan Details: {selectedLoan.loanType.replace("_", " ")} (ID:{" "}
                  {selectedLoan.loanId})
                </h2>
                <button
                  onClick={() => setIsLoanDetailsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {isLoadingLoanDetails ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading loan details...</p>
                </div>
              ) : loanDetails ? (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiFileText className="mr-2 text-indigo-500" />
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Type:</span>
                        <span className="font-medium capitalize">
                          {loanDetails.loanType.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(loanDetails.loanAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-medium">
                          {loanDetails.interestRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Tenure:</span>
                        <span className="font-medium">
                          {loanDetails.loanTenure} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee:</span>
                        <span className="font-medium">
                          {formatCurrency(loanDetails.processingFee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiCalendar className="mr-2 text-indigo-500" />
                      Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">
                          {formatDate(loanDetails.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">
                          {formatDate(loanDetails.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Payment:</span>
                        <span className="font-medium">
                          {formatDate(loanDetails.lastPaymentDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Due:</span>
                        <span className="font-medium">
                          {formatDate(loanDetails.nextDueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiDollarSign className="mr-2 text-indigo-500" />
                      Payment Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly EMI:</span>
                        <span className="font-medium">
                          {formatCurrency(loanDetails.monthlyEMI)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Payable:</span>
                        <span className="font-medium">
                          {formatCurrency(loanDetails.totalPayableAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Paid:</span>
                        <span className="font-medium">
                          {formatCurrency(loanDetails.totalPaidAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(loanDetails.remainingAmount)}
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-gray-600">Installments:</span>
                        <span className="font-medium">
                          {loanDetails.paidInstallments || 0} of {loanDetails.totalInstallments}
                        </span>
                      </div> */}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <FiTrendingUp className="mr-2 text-indigo-500" />
                      Status & Progress
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            loanDetails.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {loanDetails.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium">
                          {loanDetails.loanProgress?.toFixed(2) || 0}%
                        </span>
                      </div>
                      <div className="pt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${loanDetails.loanProgress || 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium capitalize">
                          {loanDetails.paymentMethod?.replace("-", " ") ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remarks:</span>
                        <span className="font-medium text-right">
                          {loanDetails.remarks || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="inline-block p-4 bg-red-100 rounded-full">
                    <FiX className="text-2xl text-red-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Failed to load loan details
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Could not retrieve details for loan ID:{" "}
                    {selectedLoan.loanId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pay EMI Modal */}
      {isEMIModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Pay EMI for {selectedLoan.loanType.replace("_", " ")} (ID:{" "}
                  {selectedLoan.loanId})
                </h2>
                <button
                  onClick={() => {
                    setIsEMIModalOpen(false);
                    setSelectedInstallment(null);
                    setPaymentAmount("");
                    setOtp("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <div>
                <p className="text-gray-600 font-semibold text-xs">
                  NOTE: Once you click on 'Pay Now', please scroll down to
                  proceed further.
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Installments
                </h3>

                {installments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-block p-4 bg-gray-100 rounded-full">
                      <FiInfo className="text-2xl text-gray-500" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No installments found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      There are no installments available for this loan.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Principal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Interest
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {installments.map((installment) => (
                            <tr key={installment.installmentNumber}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {installment.installmentNumber}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(installment.dueDate)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(installment.emiAmount)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(installment.principalComponent)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(installment.interestComponent)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    installment.status === "paid"
                                      ? "bg-green-100 text-green-800"
                                      : installment.status === "waived"
                                      ? "bg-blue-100 text-blue-800"
                                      : installment.status === "partially_paid"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {installment.status === "partially_paid"
                                    ? "Partial"
                                    : installment.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                {(installment.status === "due" ||
                                  installment.status === "overdue" ||
                                  installment.status === "partially_paid") && (
                                  <button
                                    onClick={() => {
                                      // Calculate remaining amount for partially paid installments
                                      const remaining =
                                        installment.emiAmount -
                                        (installment.amountPaid || 0);
                                      setSelectedInstallment(installment);
                                      setPaymentAmount(
                                        remaining > 0 ? remaining : 0
                                      );
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-colors duration-200"
                                  >
                                    Pay Now
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedInstallment && (
                      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                          <FiDollarSign className="mr-2 text-green-500" />
                          Pay Installment #
                          {selectedInstallment.installmentNumber}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Payment Amount
                            </label>
                            <input
                              type="number"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              min="0"
                              step="0.01"
                            />
                            <div className="mt-1 text-sm text-gray-500">
                              <p>
                                EMI Amount:{" "}
                                {formatCurrency(selectedInstallment.emiAmount)}
                              </p>
                              {selectedInstallment.amountPaid > 0 && (
                                <p>
                                  Already Paid:{" "}
                                  {formatCurrency(
                                    selectedInstallment.amountPaid
                                  )}
                                </p>
                              )}
                              <p className="font-medium mt-1">
                                Remaining:{" "}
                                {formatCurrency(
                                  selectedInstallment.emiAmount -
                                    (selectedInstallment.amountPaid || 0)
                                )}
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              OTP (6-digit code)
                            </label>
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              maxLength={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter OTP"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              We'll send a 6-digit code to your email
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <button
                            onClick={sendOtp}
                            disabled={isSendingOtp}
                            className={`flex items-center text-indigo-600 hover:text-indigo-800 ${
                              isSendingOtp
                                ? "opacity-70 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {isSendingOtp ? (
                              <span className="flex items-center">
                                <span className="animate-pulse">
                                  Sending OTP...
                                </span>
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <FiArrowRight className="mr-1" />
                                Send OTP to my email
                              </span>
                            )}
                          </button>

                          <div className="flex gap-3 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                setSelectedInstallment(null);
                                setPaymentAmount("");
                              }}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full sm:w-auto"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handlePayEMI}
                              disabled={
                                !paymentAmount || !otp || paymentAmount <= 0
                              }
                              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto ${
                                !paymentAmount || !otp || paymentAmount <= 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Confirm Payment
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Loan Modal */}
      {isCloseLoanModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Close Loan: {selectedLoan.loanType.replace("_", " ")} (ID:{" "}
                  {selectedLoan.loanId})
                </h2>
                <button
                  onClick={() => setIsCloseLoanModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="mt-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    placeholder="Reason for closing the loan..."
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP (6-digit code)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter OTP"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={sendOtp}
                    disabled={isSendingOtp}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                  >
                    {isSendingOtp ? (
                      <>
                        <span className="animate-pulse">Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <FiArrowRight className="mr-1" />
                        Send OTP to my email
                      </>
                    )}
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsCloseLoanModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCloseLoan}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center justify-center min-w-[120px]"
                      disabled={isClosingLoan}
                    >
                      {isClosingLoan ? (
                        <span className="animate-pulse">Closing...</span>
                      ) : (
                        "Confirm Closure"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanPage;
