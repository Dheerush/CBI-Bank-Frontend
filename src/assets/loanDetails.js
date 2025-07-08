// src/assets/loanDetails.js
import { FaGraduationCap, FaMoneyBillWave, FaCarSide, FaHome, FaHandshake } from "react-icons/fa";

export const loanItems = [
  {
    id: 1,
    title: "Education Loan",
    description: "Invest in your future with hassle-free education loans.",
    icon: FaGraduationCap, 
    features: { 
      tenure: "Upto 10 years",
      interest: "5.0% per annum",
      processingFees: "1%",
      loanAmount: "Between 1 Lakh to 25 Lakhs"
    }
  },
  {
    id: 2,
    title: "Personal Loan",
    description: "Avail our quick and easy access to funds for all your personal needs.",
    icon: FaMoneyBillWave, 
    features: {
      tenure: "Upto 10 years",
      interest: "5.0% per annum",
      processingFees: "1%",
      loanAmount: "Between 1 Lakh to 25 Lakhs"
    }
  },
  {
    id: 3,
    title: "Car Loans",
    description: "Drive home your dream car with flexible financing options.",
    icon: FaCarSide, 
    features: {
      tenure: "Upto 10 years",
      interest: "5.0% per annum",
      processingFees: "1%",
      loanAmount: "Between 1 Lakh to 25 Lakhs"
    }
  },
  {
    id: 4,
    title: "Home Loans",
    description: "Fulfill your dream of owning a home with competitive interest rates.",
    icon: FaHome, // Changed icon to FaHome for home loan
    features: {
      tenure: "Upto 10 years",
      interest: "5.0% per annum",
      processingFees: "1%",
      loanAmount: "Between 1 Lakh to 25 Lakhs"
    }
  },
  {
    id: 5,
    title: "Business Loans",
    description: "Power your business growth with tailored financing solutions.",
    icon: FaHandshake, // Changed icon to FaHandshake for business loan
    features: {
      tenure: "Upto 10 years",
      interest: "5.0% per annum",
      processingFees: "1%",
      loanAmount: "Between 1 Lakh to 25 Lakhs"
    }
  }
];

