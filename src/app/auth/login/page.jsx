"use client";
import { axiosClient } from "@/utils/AxiosClient";
import React, { useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Link from "next/link";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useMainContext } from "@/context/MainContext";
import { useRouter } from "next/navigation";
import DisclaimerBar from "@/components/reusable/DisclaimerBar";
const LoginPage = () => {
  const { fetchUserProfile } = useMainContext();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const onSubmitHandler = async (values, helpers) => {
    try {
      const response = await axiosClient.post("/auth/login", values);
      const data = await response.data;
      toast.success(data.msg);
      // token
      localStorage.setItem("token", data.token);
      //after the token is saved,we can call the fetchUserProfile();
      await fetchUserProfile();
      router.push("/");
      helpers.resetForm();
    } catch (error) {
      console.log(error);
      console.log(
        " ❌ Login failed: ",
        error.response.data.message || error.message
      );
      toast.error(error.response.data.message || error.message);
    }
  };

  return (
    // Main container
    <div>
      <DisclaimerBar />
      <div className="max-h-screen w-9/12 mx-auto flex flex-col lg:flex-row justify-center sm:p-6 md:p-8 mt-7 ">
        {/* Left Side - Image and Tagline */}
        <div className="hidden lg:flex w-full lg:w-1/2 xl:w-2/5 flex-col items-center justify-center rounded-2xl lg:rounded-r-none p-6 sm:p-8 md:p-10 border border-gray-200 lg:border-r-0 shadow-2xl text-center select-none">
          <img
            src="https://img.freepik.com/premium-vector/emoney-vector-illustration-woman-transferring-money-digital-account-banking-transactions-digital-transaction-security-financial-transactions-concept-flat-vector-illustration_923732-4586.jpg?ga=GA1.1.819700191.1728751895&semt=ais_hybrid&w=740"
            alt="Banking Illustration"
            className="w-11/12 max-w-sm mb-3 rounded-lg"
          />
          <h4 className="text-sm font-bold text-gray-700">
            Access your funds, defended by our security.
          </h4>
          <p className="mt-2 text-gray-500 text-sm">
            Empower your finances. Experience banking that's as easy as it is
            safe.
          </p>
        </div>
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex flex-col items-center justify-center bg-white rounded-2xl lg:rounded-l-none p-6 sm:p-8 md:p-10 border border-gray-200 lg:border-l-0 overflow-hidden ">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            {({ isSubmitting }) => (
              <Form className="w-full max-w-md">
                {" "}
                {/* Added max-w-md to form for consistent width */}
                <h2 className="text-2xl font-bold text-center mb-7 text-gray-800 underline">
                  Login into your CBI Bank Account
                </h2>
                {/* Email */}
                <div className="mb-1">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Registered Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                  />
                  <ErrorMessage
                    name="email"
                    className="text-red-600 text-xs mt-1"
                    component="p"
                  />
                </div>
                {/* Password */}
                <div className="mb-1 relative">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                  />
                  <ErrorMessage
                    name="password"
                    className="text-red-600 text-xs mt-1"
                    component="p"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 top-8 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="h-5 w-5" />
                    ) : (
                      <RiEyeLine className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center mt-3 justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Please wait...
                    </>
                  ) : (
                    <>
                      Login <IoMdLogIn className="text-xl" />
                    </>
                  )}
                </button>
                {/* Login link */}
                <p className=" mt-2 text-xs text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors duration-200"
                  >
                    Register here
                  </Link>
                </p>
                {/* Forgot Password */}
                <div>
                  <p className="mt-2 text-xs text-gray-600">
                    Forgot Password?{" "}
                    <Link
                      href="/auth/forgot-password"
                      className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors duration-200"
                    >
                      Click here
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
