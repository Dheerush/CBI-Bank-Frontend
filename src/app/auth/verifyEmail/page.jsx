"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import { useMainContext } from "@/context/MainContext";
import Link from "next/link";
import * as yup from "yup";
import { Formik, ErrorMessage, Form, Field } from "formik";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email"); // Get email from query parameter

  const { fetchUserProfile } = useMainContext();
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registrationData, setRegistrationData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // New state for data loading

  useEffect(() => {
    // Set email for display from query params
    if (emailFromQuery) {
      setRegisteredEmail(decodeURIComponent(emailFromQuery));
    }

    // Retrieve temporary registration data from localStorage
    const storedData = localStorage.getItem("tempRegistrationData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setRegistrationData(parsedData);
        setIsDataLoaded(true); // Mark data as loaded
      } catch (error) {
        console.error("Failed to parse temp registration data:", error);
        toast.error("Error retrieving registration data. Please try again.");
        router.replace("/auth/register"); // Redirect if data is corrupt
      }
    } else {
      toast.error("No registration data found. Please register first.");
      router.replace("/auth/register"); // Redirect if no data
    }
  }, [emailFromQuery, router]);

  const initialValues = {
    otp: "",
  };

  const validationSchema = yup.object({
    otp: yup
      .string()
      .matches(/^\d{6}$/, "OTP must be a 6-digit number") // Assuming 6-digit OTP
      .required("OTP is required"),
  });

  const onSubmitHandler = async (values, helpers) => {
    if (!registrationData) {
      toast.error("Missing registration data. Please go back and register again.");
      router.replace("/auth/register");
      return;
    }

    try {
      // Combine stored registration data with the entered OTP
      const fullRegistrationPayload = {
        ...registrationData,
        otp: values.otp, // Add the OTP from the form
      };

      // Call the backend /auth/register endpoint with all data including OTP
      const res = await axiosClient.post("/auth/register", fullRegistrationPayload);

      const data = res.data;
      toast.success("Account verified and registered successfully!");
      localStorage.setItem("token", data.token); // Save token
      await fetchUserProfile(); // Fetch user profile
      localStorage.removeItem("tempRegistrationData"); // Clear temporary data
      router.push("/"); // Redirect to home page on success
    } catch (err) {
      console.error("Registration (with OTP) error:", err);
      toast.error(err.response?.data?.message || "OTP verification failed. Please try again.");
      // Redirect back to /auth/register on failure
      router.push("/auth/register");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  // Show a loading state or redirect if data isn't loaded yet
  if (!isDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading registration data...</p>
      </div>
    );
  }

  // Render the form only if data is loaded
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Verify Your Email</h2>
        <p className="text-gray-700 mb-6">
          An OTP has been sent to your email:{" "}
          <span className="font-semibold text-indigo-600">
            {registeredEmail}
          </span>
          . Please enter it below to complete your registration.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label
                  htmlFor="otp"
                  className="sr-only" // Screen reader only label
                >
                  Enter OTP
                </label>
                <Field
                  type="text"
                  id="otp"
                  name="otp"
                  maxLength="6" // Max length for OTP
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 placeholder-gray-400 text-lg text-center tracking-widest transition-all duration-200"
                />
                <ErrorMessage
                  name="otp"
                  className="text-red-600 text-xs mt-2"
                  component="p"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Account
                  </>
                )}
              </button>

              <p className="mt-4 text-sm text-gray-500">
                Didn't receive the OTP?{" "}
                <button
                  type="button"
                  onClick={async () => {
                    // This resends OTP for the email already present in registrationData
                    if (registrationData?.email) {
                      try {
                        const resendResponse = await axiosClient.post("/auth/send-otp", {
                          email: registrationData.email,
                        });
                        toast.success(resendResponse.data.message || "OTP resent successfully!");
                      } catch (resendError) {
                        toast.error(resendError.response?.data?.message || "Failed to resend OTP.");
                      }
                    } else {
                      toast.error("Email not found for resending OTP. Please go back to registration.");
                      router.push("/auth/register");
                    }
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Resend OTP
                </button>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                <Link
                  href="/auth/register"
                  className="text-gray-600 hover:underline"
                >
                  &larr; Go back to registration
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default VerifyEmail;