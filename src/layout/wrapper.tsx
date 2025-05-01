"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [sideMenu, setSideMenu] = useState<boolean>(false);
  
  useEffect(() => {
    const localAuth = Cookies.get("admin");
    if (!localAuth) {
      redirect("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar sideMenu={sideMenu} setSideMenu={setSideMenu} />
      <div 
        className={`transition-all duration-300 ease-in-out ${
          sideMenu ? "lg:ml-[250px] xl:ml-[300px]" : "ml-0 lg:ml-[250px] xl:ml-[300px]"
        }`}
      >
        {/* header start */}
        <Header setSideMenu={setSideMenu} />
        {/* header end */}

        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
          <div className="max-w-[1800px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
    </div>
  );
};

export default Wrapper;
