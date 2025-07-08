"use client";
import React, { useState } from "react";
import BankLogo from "./reusable/BankLogo";
import Link from "next/link";
import { IoMdHome, IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineLogin, MdMiscellaneousServices } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useMainContext } from "@/context/MainContext";
import { FiMenu } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setIsToggle } from "@/redux/slice/sidebarSlice";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, setUser, LogoutHandler } = useMainContext();
  const dispatch = useDispatch();

  const navItems = [
    { label: "Home", href: "/", icon: <IoMdHome /> },
    { label: "Services", href: "/service", icon: <MdMiscellaneousServices /> },
    { label: "Contact", href: "/contact", icon: <FaPhoneVolume /> },
    { label: "About", href: "/about", icon: <IoMdInformationCircleOutline /> },
  ];

  return (
    <header className="w-full border-b-[#180b23] border-b-gray-[#fff] shadow-xl bg-[#f3eded] fixed top-0 left-0 right-0 z-50">
      <nav className="w-[98%] lg:w-[95%] mx-auto flex items-center justify-between py-4 relative px-1">
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => dispatch(setIsToggle())}
            className="text-black-600 flex gap-1 items-center bg-black text-white rounded-md p-2 transition-all duration-200 ease-in-out hover:text-blue-700 hover:scale-105 lg:hidden" // <--- CHANGE THIS LINE
          >
            <FiMenu className="size-6" />{" "}
            <span className="font-semibold">Menu</span>
          </button>
          <BankLogo />
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl text-black"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>

        <ul className="hidden lg:flex items-center gap-x-6">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors font-semibold text-black hover:text-blue-600"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          <li>
            {user ? (
              <button
                onClick={LogoutHandler}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white border border-red-700 hover:bg-red-700 transition-colors font-semibold"
              >
                <MdOutlineLogin />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white border border-red-700 hover:bg-red-700 transition-colors font-semibold"
              >
                <MdOutlineLogin />
                <span>Login</span>
              </Link>
            )}
          </li>
        </ul>

        {mobileMenuOpen && (
          <ul className="lg:hidden absolute top-full left-0 w-full font-semibold bg-white border-t z-10 flex flex-col items-start p-4 gap-4 shadow-md">
            {navItems.map((item, index) => (
              <li key={index} className="w-full">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md w-full text-gray-700 hover:text-blue-600"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}

            <li className="w-full">
              {user ? (
                <button
                  onClick={() => {
                    LogoutHandler();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white border border-red-700 hover:bg-red-700 w-full"
                >
                  <MdOutlineLogin />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white border border-red-700 hover:bg-red-700 w-full"
                >
                  <MdOutlineLogin />
                  <span>Login</span>
                </Link>
              )}
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
