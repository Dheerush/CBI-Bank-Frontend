"use client"
import React from "react";
import { ToastContainer } from "react-toastify";
import { MainContextProvider } from "@/context/MainContext";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
const MainLayout = ({ children }) => {
  return (
    <>
      <Provider store={store}>
        <MainContextProvider>
          <ToastContainer />
          <Navbar />
          {children}
        </MainContextProvider>
      </Provider>
    </>
  );
};

export default MainLayout;
