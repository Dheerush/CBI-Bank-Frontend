"use client";
import { axiosClient } from "@/utils/AxiosClient";
import React, { useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Link from "next/link";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    ac_type: "",
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phoneNumber: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone Number is required"),
    ac_type: yup
      .string()
      .oneOf(["saving", "current"], "Choose a valid account type")
      .required("Account type is required"),
  });

  const onSubmitHandler = async (values, helpers) => {
    try {
      // Step 1: Request OTP from backend (only send email)
      const response = await axiosClient.post("/auth/send-otp", {
        email: values.email,
      });

      toast.success(response.data.message || "OTP sent to your email!");

      // Step 2: Store full registration data in localStorage
      // IMPORTANT: For production, do NOT store sensitive data like passwords in localStorage.
      // Consider server-side sessions for multi-step forms.
      localStorage.setItem("tempRegistrationData", JSON.stringify(values));

      // Step 3: Redirect to the VerifyEmail page with email in query for display
      router.push(
        `/auth/verifyEmail?email=${encodeURIComponent(values.email)}`
      );
    } catch (error) {
      console.error("Registration initiation error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP. Please check your email or try again."
      );
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className="max-h-screen w-9/12 mx-auto flex flex-col lg:flex-row justify-center sm:p-6 md:p-8 mt-28">
      {/* Image Section (same as before) */}
      <div className="hidden lg:flex w-full lg:w-1/2 xl:w-2/5 flex-col items-center justify-center rounded-2xl lg:rounded-r-none p-6 sm:p-8 md:p-10 border border-gray-300 lg:border-r-0 shadow-2xl text-center select-none">
        <img
          src="https://img.freepik.com/free-vector/credit-card-payment-landing-page-concept_52683-24893.jpg?ga=GA1.1.819700191.1728751895&semt=ais_hybrid&w=740"
          alt="Banking Illustration"
          className="w-11/12 max-w-sm mb-6 rounded-lg"
        />
        <h4 className="text-lg font-bold text-gray-700">
          Join us for faster internet banking
        </h4>
        <p className="mt-2 text-gray-500 text-sm">
          Easy, secure, and efficient banking at your fingertips.
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 xl:w-3/5 flex flex-col items-center justify-center bg-white rounded-2xl lg:rounded-l-none p-6 sm:p-8 md:p-10 border border-gray-300 lg:border-l-0 overflow-hidden ">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
        >
          {({ isSubmitting }) => (
            // <Form className="w-full max-w-md">
            //   <h2 className="text-xl font-bold text-center mb-7 text-gray-800 underline">
            //     Create Your CBI Bank Account
            //   </h2>
            //   {/* Full Name */}
            //   <div className="mb-1">
            //     <label
            //       htmlFor="name"
            //       className="block mb-2 text-sm font-semibold text-gray-700"
            //     >
            //       Full Name <span className="text-red-500">*</span>
            //     </label>
            //     <Field
            //       type="text"
            //       id="name"
            //       name="name"
            //       placeholder="John Doe"
            //       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
            //     />
            //     <ErrorMessage
            //       name="name"
            //       className="text-red-600 text-xs mt-1"
            //       component="p"
            //     />
            //   </div>
            //   {/* Email */}
            //   <div className="mb-1">
            //     <label
            //       htmlFor="email"
            //       className="block mb-2 text-sm font-semibold text-gray-700"
            //     >
            //       Registered Email <span className="text-red-500">*</span>
            //     </label>
            //     <Field
            //       type="email"
            //       id="email"
            //       name="email"
            //       placeholder="your.email@example.com"
            //       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
            //     />
            //     <ErrorMessage
            //       name="email"
            //       className="text-red-600 text-xs mt-1"
            //       component="p"
            //     />
            //   </div>
            //   {/* Password */}
            //   <div className="mb-1 relative">
            //     <label
            //       htmlFor="password"
            //       className="block mb-2 text-sm font-semibold text-gray-700"
            //     >
            //       Password <span className="text-red-500">*</span>
            //     </label>
            //     <Field
            //       type={showPassword ? "text" : "password"}
            //       id="password"
            //       name="password"
            //       placeholder="••••••••"
            //       className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
            //     />
            //     <ErrorMessage
            //       name="password"
            //       className="text-red-600 text-xs mt-1"
            //       component="p"
            //     />
            //     <button
            //       type="button"
            //       onClick={() => setShowPassword(!showPassword)}
            //       className="absolute inset-y-0 right-0 pr-3 top-8 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-indigo-500 outline-none"
            //       aria-label={showPassword ? "Hide password" : "Show password"}
            //     >
            //       {showPassword ? (
            //         <RiEyeOffLine className="h-5 w-5 " />
            //       ) : (
            //         <RiEyeLine className="h-5 w-5" />
            //       )}
            //     </button>
            //   </div>
            //   {/* Phone Number */}
            //   <div className="mb-1">
            //     <label
            //       htmlFor="phoneNumber"
            //       className="block mb-2 text-sm font-semibold text-gray-700"
            //     >
            //       Phone Number <span className="text-red-500">*</span>
            //     </label>
            //     <Field
            //       type="text" // Use text for phone number to handle leading zeros easily, validation with regex
            //       id="phoneNumber"
            //       name="phoneNumber"
            //       placeholder="e.g., 9876543210"
            //       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
            //     />
            //     <ErrorMessage
            //       name="phoneNumber"
            //       className="text-red-600 text-xs mt-1"
            //       component="p"
            //     />
            //   </div>
            //   {/* Account Type */}
            //   <div className="mb-1">
            //     <label
            //       htmlFor="ac_type"
            //       className="block mb-2 text-sm font-semibold text-gray-700"
            //     >
            //       Account Type <span className="text-red-500">*</span>
            //     </label>
            //     <Field
            //       as="select"
            //       id="ac_type"
            //       name="ac_type"
            //       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 bg-white appearance-none transition-all duration-200"
            //     >
            //       <option value="">-- Select Account Type --</option>
            //       <option value="saving">Savings Account</option>
            //       <option value="current">Current Account</option>
            //     </Field>
            //     <ErrorMessage
            //       name="ac_type"
            //       className="text-red-600 text-xs mt-1"
            //       component="p"
            //     />
            //   </div>
            //   {/* Submit Button */}
            //   <button
            //     type="submit"
            //     disabled={isSubmitting}
            //     className="w-full flex items-center mt-3 justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            //   >
            //     {isSubmitting ? (
            //       <>
            //         <svg
            //           className="animate-spin h-5 w-5 mr-3"
            //           viewBox="0 0 24 24"
            //         >
            //           <circle
            //             className="opacity-25"
            //             cx="12"
            //             cy="12"
            //             r="10"
            //             stroke="currentColor"
            //             strokeWidth="4"
            //           ></circle>
            //           <path
            //             className="opacity-75"
            //             fill="currentColor"
            //             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            //           ></path>
            //         </svg>
            //         Sending OTP...
            //       </>
            //     ) : (
            //       <>
            //         Register & Send OTP <IoMdLogIn className="text-xl" />
            //       </>
            //     )}
            //   </button>
            //   {/* Login link */}
            //   <p className="text-center mt-2 text-xs text-gray-600">
            //     Already have an account?{" "}
            //     <Link
            //       href="/auth/login"
            //       className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors duration-200 sm:py-2"
            //     >
            //       Login here
            //     </Link>
            //   </p>
            // </Form>
            <Form className="w-full max-w-2xl">
              <h2 className="text-xl font-bold text-center mt-6 mb-4 text-gray-800 underline">
                Create Your CBI Bank Account
              </h2>

              {/* Grid container for fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="">
                  <label
                    htmlFor="name"
                    className="block mb-1 text-sm font-semibold text-gray-700"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <ErrorMessage
                    name="name"
                    className="text-red-600 text-xs mt-1"
                    component="p"
                  />
                </div>

                {/* Phone Number */}
                <div className="">
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-1 text-sm font-semibold text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    className="text-red-600 text-xs mt-1"
                    component="p"
                  />
                </div>

                {/* Email */}
                <div className="col-span-1 sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-semibold text-gray-700"
                  >
                    Registered Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <ErrorMessage
                    name="email"
                    className="text-red-600 text-xs mt-1"
                    component="p"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-semibold text-gray-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <ErrorMessage
                    name="password"
                    className="text-red-600 text-xs mt-1"
                    component="p"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 top-7 text-gray-500"
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>

                {/* Account Type */}
                <div className="">
                  <label
                    htmlFor="ac_type"
                    className="block mb-1 text-sm font-semibold text-gray-700"
                  >
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    id="ac_type"
                    name="ac_type"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="">-- Select Account Type --</option>
                    <option value="saving">Savings Account</option>
                    <option value="current">Current Account</option>
                  </Field>
                  <ErrorMessage
                    name="ac_type"
                    className="text-red-600 text-xs mt-1"
                    component="p"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center mt-6 justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Register & Send OTP <IoMdLogIn className="text-xl" />
                  </>
                )}
              </button>

              {/* Login link */}
              <p className="text-center mt-3 text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  Login here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
