"use client";
import { FaRupeeSign, FaPiggyBank, FaChartLine, FaExchangeAlt } from "react-icons/fa";
import { MdAccountBalance, MdSavings, MdPayment } from "react-icons/md";
import Link from "next/link";
import HeaderName from "@/components/reusable/HeaderName";
import { useMainContext } from "@/context/MainContext";
import ATMCard from "../../components/ATMCardComponent/ATMCard";
import { useState, useEffect } from "react";

const HomePage = () => {
  const { user } = useMainContext();
  const [currentTime, setCurrentTime] = useState("");
  const [activePromo, setActivePromo] = useState(0);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Promotional offers data
  const promotions = [
    {
      title: "Personal Loan @ 4.99%",
      description: "Special interest rate for existing customers",
      icon: <FaExchangeAlt className="text-2xl" />,
      color: "bg-gradient-to-r from-blue-500 to-indigo-600"
    },
    {
      title: "Savings Account Bonus",
      description: "Earn 5% extra interest for 3 months",
      icon: <MdSavings className="text-2xl" />,
      color: "bg-gradient-to-r from-green-500 to-teal-600"
    },
    {
      title: "Credit Card Offer",
      description: "Get ₹5,000 cashback on new card",
      icon: <MdPayment className="text-2xl" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-600"
    }
  ];

  // Rotate promotions every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promotions.length]);

  return (
    <div className="flex flex-col gap-6 py-6 px-4 max-w-7xl mx-auto w-full">
      {/* Header with greeting and time */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back, <span className="text-indigo-600">{user?.name || "Customer"}</span>
          </h1>
          <p className="text-gray-600 mt-1">Here's your financial overview</p>
        </div>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
            <span className="text-gray-500 mr-2">Today</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="bg-indigo-100 text-indigo-800 rounded-lg px-4 py-2 font-medium flex items-center">
            <span className="mr-2">🕒</span>
            {currentTime || "Loading..."}
          </div>
        </div>
      </div>

      {/* Account Balance Card - Enhanced */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium">Account Balance</h2>
            <br />
            <div className="flex items-baseline mt-2">
              <FaRupeeSign className="text-2xl mr-1" />
              <p className="text-4xl font-bold">
                {user && user?.amount !== undefined
                  ? `${Number(user.amount).toFixed(2)}`
                  : '0.00'}
              </p>
            </div>
            <p className="mt-1 text-indigo-200">Available to spend</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <MdAccountBalance className="text-3xl" />
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/amount" className="flex-1 min-w-[120px] bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-3 px-4 text-center transition-all">
            <div className="flex items-center justify-center gap-2">
              <FaExchangeAlt />
              <span>Transfer</span>
            </div>
          </Link>
          <Link href="/amount" className="flex-1 min-w-[120px] bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-3 px-4 text-center transition-all">
            <div className="flex items-center justify-center gap-2">
              <MdPayment />
              <span>Add Money </span>
            </div>
          </Link>
          <Link href="/transactions" className="flex-1 min-w-[120px] bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-3 px-4 text-center transition-all">
            <div className="flex items-center justify-center gap-2">
              <FaChartLine />
              <span>Statements</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATM Card Preview */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Your Card</h2>
            <div className="flex justify-center">
              <ATMCard />
            </div>
            <div className="mt-6 flex justify-between">
              {/* <div className="text-indigo-300 hover:text-white flex items-center gap-1">
                <span>Card Controls</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div> */}
              <Link href="/transactions" className="text-indigo-300 hover:text-white flex items-center gap-1">
                <span>View Transactions</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bank Promotions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Special Offers</h2>
              <p className="text-gray-600">Exclusive deals for you</p>
            </div>
            
            {/* Promotions carousel */}
            <div className="relative h-64 overflow-hidden">
              {promotions.map((promo, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-1000 ease-in-out ${
                    activePromo === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                  }`}
                >
                  <div className={`${promo.color} rounded-xl p-6 text-white h-full flex flex-col justify-center`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{promo.title}</h3>
                        <p className="mt-2 opacity-90">{promo.description}</p>
                        <button className="mt-4 bg-white text-gray-800 font-medium py-2 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
                          Learn More
                        </button>
                      </div>
                      <div className="text-5xl opacity-20">
                        {promo.icon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Promotion indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {promotions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePromo(index)}
                    className={`w-2.5 h-2.5 rounded-full ${
                      activePromo === index ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Tips Section */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Wellness Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <FaPiggyBank className="text-blue-600 text-xl" />
            </div>
            <h3 className="font-medium text-lg text-gray-800">Emergency Fund</h3>
            <p className="text-gray-600 mt-2">Aim to save 3-6 months of expenses for financial security.</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
            <h3 className="font-medium text-lg text-gray-800">Debt Management</h3>
            <p className="text-gray-600 mt-2">Prioritize paying off high-interest debts first.</p>
          </div>
          <div className="bg-white p5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <MdSavings className="text-purple-600 text-xl" />
            </div>
            <h3 className="font-medium text-lg text-gray-800">Retirement Planning</h3>
            <p className="text-gray-600 mt-2">Start early to benefit from compound interest growth.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;