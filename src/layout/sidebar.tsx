"use client";
import React, { useState } from "react";
import Image from "next/image";
import sidebar_menu from "@/data/sidebar-menus";
import { DownArrow } from "@/svg";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "@/redux/auth/authSlice";
import { useRouter } from "next/navigation";

// prop type
type IProps = {
  sideMenu: boolean;
  setSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ sideMenu, setSideMenu }: IProps) {
  const [isDropdown, setIsDropDown] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();

  // handle active menu
  const handleMenuActive = (title: string) => {
    if (title === isDropdown) {
      setIsDropDown("");
    } else {
      setIsDropDown(title);
    }
  };

  // handle logout
  const handleLogOut = () => {
    dispatch(userLoggedOut());
    router.push(`/login`);
  };
  return (
    <>
      <aside
        className={`w-[300px] lg:w-[250px] xl:w-[300px] fixed left-0 top-0 h-full bg-white z-50 transition-all duration-300 ease-in-out shadow-lg ${
          sideMenu
            ? "translate-x-[0px]"
            : " -translate-x-[300px] lg:translate-x-[0]"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="py-5 px-8 border-b border-gray-100">
              <Link href="#" onClick={() => window.location.reload()} className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Course Admin
                </h1>
              </Link>
            </div>
            <div className="px-4 py-6">
              <ul className="space-y-1.5">
                {sidebar_menu.map((menu) => (
                  <li key={menu.id}>
                    {!menu.subMenus && menu.title !== "Online store" && (
                      <Link
                        href={menu.link}
                        onClick={() => handleMenuActive(menu.title)}
                        className="group relative flex items-center gap-3 px-5 py-3 text-gray-700 font-medium rounded-lg hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-indigo-500/10 hover:text-indigo-600 transition-all duration-200"
                      >
                        <span className="flex items-center justify-center w-5 h-5 text-lg transition-transform duration-200 group-hover:scale-110">
                          <menu.icon />
                        </span>
                        <span className="text-sm font-semibold">{menu.title}</span>
                        {menu.subMenus && (
                          <span className={`absolute right-4 transition-transform duration-200 ${isDropdown === menu.title ? 'rotate-180' : ''}`}>
                            <DownArrow />
                          </span>
                        )}
                      </Link>
                    )}
                    {menu.subMenus && (
                      <>
                        <button
                          onClick={() => handleMenuActive(menu.title)}
                          className={`group w-full relative flex items-center gap-3 px-5 py-3 text-gray-700 font-medium rounded-lg hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-indigo-500/10 hover:text-indigo-600 transition-all duration-200 ${
                            isDropdown === menu.title
                              ? "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-indigo-600"
                              : ""
                          }`}
                        >
                          <span className="flex items-center justify-center w-5 h-5 text-lg transition-transform duration-200 group-hover:scale-110">
                            <menu.icon />
                          </span>
                          <span className="text-sm font-semibold">{menu.title}</span>
                          <span className={`absolute right-4 transition-transform duration-200 ${isDropdown === menu.title ? 'rotate-180' : ''}`}>
                            <DownArrow />
                          </span>
                        </button>
                        <ul
                          className={`mt-1 ml-4 pl-6 border-l border-gray-100 transition-all duration-300 ease-in-out ${
                            isDropdown === menu.title ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                          }`}
                        >
                          {menu.subMenus.map((sub, i) => (
                            <li key={i}>
                              <Link
                                href={sub.link}
                                className="group flex items-center gap-2 py-2 px-4 text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-indigo-600 transition-colors duration-200"></span>
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-6 border-t border-gray-100">
            <button 
              onClick={handleLogOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div
        onClick={() => setSideMenu(!sideMenu)}
        className={`fixed top-0 left-0 w-full h-full z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ${
          sideMenu ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />
    </>
  );
}
