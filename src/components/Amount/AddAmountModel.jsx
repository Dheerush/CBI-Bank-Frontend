"use client";
import { Dialog } from "@headlessui/react";
import { IoAdd } from "react-icons/io5";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { SiRazorpay } from "react-icons/si";
import { useFormik } from "formik";
import * as Yup from "yup";
import loadScript from "@/utils/loadScripts";
// Ensure checkout_url is correctly imported from your constants
import { checkout_url } from "@/utils/constant";
import { axiosClient } from "@/utils/AxiosClient";
import { useMainContext } from "@/context/MainContext"; // Import useMainContext to refresh user data

export default function AddAmountModel() {
  const [isOpen, setIsOpen] = useState(false);
  const { fetchUserProfile } = useMainContext(); // Get the function to refresh user data

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    formik.resetForm();
  }

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .typeError("Amount must be a number")
        .required("Type the amount for payment")
        .moreThan(0, "Amount must be more than ₹0"),
    }),
    onSubmit: async (values) => {
      const scriptLoaded = await loadScript(checkout_url);
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please try again later.");
        return;
      }

      try {
        // --- 1. Create order on your backend ---
        // CORRECTED: Headers are passed as the third argument (config object),
        // and the body is directly the second argument.
        const res = await axiosClient.post(
          "/amount/add-money", // Backend endpoint for creating order
          { amount: parseFloat(values.amount) }, // Send amount as a number, not stringified object
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        const data = res.data; // Axios response data is automatically parsed and available in .data

        if (!data.success) {
          alert("Failed to create Razorpay order: " + (data.message || "Unknown error."));
          return;
        }

        // --- 2. Configure and Open Razorpay Checkout ---
        const options = {
          key: data.key_id, // <--- CORRECTED: Use key_id from backend response
          amount: data.amount, // <--- CORRECTED: Use amount (in paisa) from backend response
          currency: data.currency, // <--- CORRECTED: Use currency from backend response
          name: "CBI Bank App",
          description: "Transaction for adding money",
          order_id: data.orderId, // <--- CORRECTED: Use orderId from backend response
          // callback_url: razorpayCallBackUrl(data.txn_id), // <--- REMOVED: Not needed for handler-based flow
          handler: async function (response) {
            // This function is called by Razorpay on successful payment
            try {
              // --- 3. Verify Payment on Backend ---
              // CORRECTED: Use axiosClient for consistency, correct endpoint,
              // and include 'amount' in the body.
              const verifyRes = await axiosClient.post(
                "/amount/payment/txn_id", // <--- CORRECTED: Match your backend route
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: parseFloat(values.amount), // <--- ADDED: Send the original amount for verification
                  // userId is securely retrieved from req.user.id on the backend (due to AuthMiddleware)
                },
                {
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"), // Always send token
                  },
                }
              );

              const result = verifyRes.data; // Axios response data is directly in .data

              if (result.success) {
                alert("Payment successful!");
                close(); // Close the modal on success
                // Refresh user profile/balance after successful transaction
                if (fetchUserProfile) {
                  await fetchUserProfile();
                }
              } else {
                alert("Payment verification failed: " + (result.message || "Unknown error."));
              }
            } catch (error) {
              console.error(
                "Error during payment verification:",
                error.response ? error.response.data : error.message
              );
              alert(
                "Payment successful but verification failed. Please contact support. Error: " +
                  (error.response ? error.response.data.message : error.message)
              );
            }
          },
          prefill: {
            name: "CBI Bank User",
            email: "info@CBI.com", // You can replace this with actual user email if available
            contact: "1800000000", // Replace with actual user contact if available
          },
          theme: {
            color: "#6366f1",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error(
          "Error initiating payment:",
          error.response ? error.response.data : error.message
        );
        alert(
          "Failed to initiate payment: " +
            (error.response ? error.response.data.message : error.message)
        );
      }
    },
  });

  return (
    <>
      <button
        onClick={open}
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md transition-all duration-200"
      >
        <IoAdd className="text-xl" />
      </button>

      <Dialog open={isOpen} onClose={close} className="relative z-50">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <Dialog.Title className="text-2xl font-semibold text-gray-800">
                💳 Make Payment
              </Dialog.Title>
              <button
                onClick={close}
                className="text-gray-500 hover:text-red-600 transition-all"
              >
                <IoMdCloseCircle className="text-2xl" />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="1"
                  inputMode="numeric"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      formik.setFieldValue("amount", val);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.amount}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.amount && formik.errors.amount
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                  placeholder="Enter amount in ₹"
                />
                {formik.touched.amount && formik.errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.amount}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!formik.isValid || !formik.dirty}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white py-2 px-4 rounded-lg font-medium shadow-md transition-all"
              >
                <SiRazorpay className="text-xl" />
                Pay with Razorpay
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}








