import Link from "next/link";
import React from "react";
import { SiCommerzbank } from "react-icons/si";
const BankLogo = () => {
  return (
    <Link href="/" className="flex flex-col items-center font-poppins leading-tight group select-none">
      <span className="text-3xl flex items-center gap-2 font-extrabold tracking-wide bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text">
        <SiCommerzbank className="text-blue-400 w-7" /> CBI
      </span>
      <span className="text-xs font-semibold text-blue-700 group-hover:text-blue-900 tracking-wide ">
        Coders Bank of India
      </span>
    </Link>
  );
};

export default BankLogo;
