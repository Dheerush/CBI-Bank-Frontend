"use client";
import React from "react";

const OTPInput = ({ value, onChange, length = 6 }) => {
  // Ensure 'value' is always an array. If it's undefined or null, default to an array of empty strings.
  const otpArray = Array.isArray(value) ? value : new Array(length).fill("");

  const handleChange = (e, index) => {
    const inputVal = e.target.value.replace(/\D/, ""); // Only digits
    if (!inputVal) {
      // If the input is cleared, update the value and potentially move focus
      const newOtp = [...otpArray];
      newOtp[index] = "";
      onChange(newOtp);
      // If the current field is empty and backspace wasn't pressed,
      // it means a character was deleted, so no need to move focus forward.
      // We only move focus forward if a digit is entered.
      return;
    }

    const newOtp = [...otpArray]; // Use the guaranteed array
    newOtp[index] = inputVal;
    onChange(newOtp);

    // Auto-focus next input
    if (inputVal && index < length - 1) { // Only move if a digit was entered and not the last field
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        // If current field is empty and backspace is pressed, move to previous field
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          // Optionally clear the previous field as well when backspacing from an empty field
          const newOtp = [...otpArray];
          newOtp[index - 1] = "";
          onChange(newOtp);
        }
      } else if (otpArray[index]) {
        // If current field has a value, clear it
        const newOtp = [...otpArray];
        newOtp[index] = "";
        onChange(newOtp);
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center mt-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-10 h-10 text-center border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={otpArray[index] || ""} // Use the guaranteed array
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleBackspace(e, index)}
        />
      ))}
    </div>
  );
};

export default OTPInput;