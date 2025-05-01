"use client";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState, useEffect } from "react";
import { Menu, Search } from "@/svg";
import { RootState } from "@/redux/store";
import default_user from "@assets/img/users/user-10.jpg";
import NotificationArea from "./component/notification-area";
import { userLoggedOut } from "@/redux/auth/authSlice";

// prop type
type IProps = {
  setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ setSideMenu }: IProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchOverlay, setSearchOverlay] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const pRef = useRef<HTMLDivElement>(null);
  const nRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  // handle logout
  const handleLogOut = () => {
    dispatch(userLoggedOut());
    router.push(`/login`);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!pRef?.current?.contains(e.target)) {
        setProfileOpen(false);
      }
      if (!nRef?.current?.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [pRef, nRef]);

  const handleNotificationOpen = () => {
    setNotificationOpen(!notificationOpen);
    setProfileOpen(false);
  };
  const handleProfileOpen = () => {
    setProfileOpen(!profileOpen);
    setNotificationOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSideMenu((prev) => !prev)}
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 text-gray-500 transition-colors hover:text-gray-900 lg:hidden focus:outline-none"
              >
                <Menu />
              </button>
              <div className="hidden md:block w-[280px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-10 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <button 
                className="md:hidden inline-flex items-center justify-center w-10 h-10 text-gray-500 transition-colors hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <Search />
              </button>

              <div ref={pRef} className="relative">
                <button
                  onClick={handleProfileOpen}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors rounded-lg hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="hidden sm:inline-block">Account</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 w-64 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-5">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Settings
                      </Link>
                      <button
                        onClick={handleLogOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors w-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v6a1 1 0 102 0V6zm-4 0a1 1 0 10-2 0v6a1 1 0 102 0V6zM7 5a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <div
          className={`fixed inset-0 bg-white/80 backdrop-blur-sm z-50 transition-transform duration-300 md:hidden ${
            searchOverlay ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-12 pl-12 pr-4 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Search />
              </span>
              <button
                onClick={() => setSearchOverlay(false)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
