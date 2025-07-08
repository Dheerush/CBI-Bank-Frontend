"use client";
import { useMainContext } from '@/context/MainContext';
import React from 'react'; 
import { FiUser, FiPhone, FiMail, FiShield, FiCalendar, FiCreditCard } from 'react-icons/fi'; 

const Profile = () => {
  const { user } = useMainContext();
  // Format account opening date (remains the same)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Show loading state if user data isn't available yet (remains the same)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 select-none ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Account Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FiUser className="text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-indigo-200 mt-1">Premium Banking Customer</p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="p-6">
                <div className="flex items-center mb-5">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <FiCreditCard className="text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Account Type</p>
                    <p className="font-medium capitalize">{user.ac_type || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center mb-5">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <FiShield className="text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Verification Status</p>
                    <p className="font-medium text-green-600">
                      Verified
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <FiCalendar className="text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">Member Since</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 flex items-center">
                <FiShield className="text-yellow-500 mr-2" />
                Security Tips
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  Never share your account details with anyone
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  Always log out after using online banking
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  Monitor your account activity regularly
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                 Session will be active for only 2 hrs, please login again if expired.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Personal Details */}
          <div className="lg:col-span-2">
            {/* Personal Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiUser className="text-indigo-600 mr-2" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <div className="text-gray-900 font-medium">{user.name || 'N/A'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <div className="text-gray-900 font-medium flex items-center">
                    {user.email || 'N/A'}
                    {user.isEmailVerified && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <div className="text-gray-900 font-medium">
                    {user.phoneNumber ? `+91 ${user.phoneNumber}` : 'N/A'}
                  </div>
                </div>

              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className=" text-sm font-medium text-gray-500 mb-1 flex items-center">
                      Account Number
                    </label>
                    {/* Simplified: Always show the full account number */}
                    <div className="text-purple-800 font-medium font-mono">
                      {user.account_number || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Type</label>
                    <div className="text-gray-900 font-medium capitalize">{user.ac_type || 'N/A'}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                    <div className="text-gray-900 font-medium">{formatDate(user.createdAt)}</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Account Security Status */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiShield className="text-indigo-600 mr-2" />
                Security Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FiMail className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email Verification</h3>
                      <p className="text-sm text-gray-600">
                        Your email is verified
                      </p>
                    </div>
                  </div>
                  <span className={"text-white text-xs px-2 py-1 rounded-full bg-green-500"}>
                    Secure
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiPhone className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Phone Verification</h3>
                      <p className="text-sm text-gray-600">
                        {user.phoneNumber ? 'Your phone is verified' : 'Phone number not provided'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-white text-xs px-2 py-1 rounded-full ${
                    user.phoneNumber ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    {user.phoneNumber ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;