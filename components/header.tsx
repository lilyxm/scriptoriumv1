import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Menu, X } from 'lucide-react';
import ProfileDropDown from "./profileDropDown";
import DarkModeSwitcher from "./DarkModeSwitcher";

interface HeaderProps {
  isAuthenticated: boolean;
}

const fetchUserIDAndRole = async () => {
  try {
    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        return null;
      }
      const response = await axios.post(
        "/api/users/getIDandRole",
        { token: authToken },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 402) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            "/api/users/refresh",
            { refreshToken: refreshToken },
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          localStorage.setItem("authToken", refreshResponse.data.accessToken);
          return await fetchUserIDAndRole();
        } catch (refreshError) {
          alert(refreshError + "error here");
        }
      }
    }
  }
  return null;
};

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const [userID, setUserID] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAndResetUser = async () => {
      if (typeof window !== "undefined") {
        const data = await fetchUserIDAndRole();
        if (data) {
          console.log(data);
          setUserID(data.id);
          setUserRole(data.role);
          localStorage.setItem("userID", data.id);
          localStorage.setItem("userRole", data.role);
        }
      }
    };
    checkAndResetUser();
  }, []);

  return (
    <header className="relative bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-xl font-bold tracking-tight">
              Scriptorium
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeSwitcher />
            {isAuthenticated ? (
              <ProfileDropDown
                token={typeof window !== "undefined" ? localStorage.getItem("authToken") || "" : ""}
                userName={typeof window !== "undefined" ? localStorage.getItem("userName") || "" : ""}
                userPhoto={typeof window !== "undefined" ? localStorage.getItem("userPhoto") || "" : ""}
                id={userID || 0}
              />
            ) : (
              <div className="flex space-x-3">
                <Link
                  href="/signin"
                  className="
                    bg-blue-500 hover:bg-blue-600 
                    text-white px-4 py-2 
                    rounded-md transition-colors
                  "
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="
                    bg-green-500 hover:bg-green-600 
                    text-white px-4 py-2 
                    rounded-md transition-colors
                  "
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 z-50">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <DarkModeSwitcher />
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/signin"
                    className="
                      bg-blue-500 hover:bg-blue-600 
                      text-white px-4 py-2 
                      rounded-md text-center transition-colors
                    "
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="
                      bg-green-500 hover:bg-green-600 
                      text-white px-4 py-2 
                      rounded-md text-center transition-colors
                    "
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              {isAuthenticated && userID && (
                <ProfileDropDown
                  token={typeof window !== "undefined" ? localStorage.getItem("authToken") || "" : ""}
                  userName={typeof window !== "undefined" ? localStorage.getItem("userName") || "" : ""}
                  userPhoto={typeof window !== "undefined" ? localStorage.getItem("userPhoto") || "" : ""}
                  id={userID}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;