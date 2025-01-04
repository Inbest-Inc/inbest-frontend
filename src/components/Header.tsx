"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Text } from "@tremor/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // For demo purposes: Check only username in localStorage
    // TODO: Implement proper token validation:
    // 1. Send a request to /api/auth/validate with the token in Authorization header
    // 2. If token is invalid/expired, clear localStorage and redirect to login
    // 3. If valid, keep the user logged in
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!storedUsername);
    setUsername(storedUsername || "");

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = () => {
      const currentUsername = localStorage.getItem("username");
      setIsAuthenticated(!!currentUsername);
      setUsername(currentUsername || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]"
          >
            Inbest
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              href="/best-portfolios"
              className="text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:text-blue-600 transition-colors"
            >
              Best Portfolios
            </Link>
            <Link
              href="/opinions"
              className="text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:text-blue-600 transition-colors"
            >
              Opinions
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative group">
                <div className="flex items-center gap-3">
                  <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                    {username}
                  </Text>
                  <div className="relative h-8 w-8 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                    <Image
                      src="https://pbs.twimg.com/profile_images/965317696639459328/pRPM9a9H_400x400.jpg"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-lg ring-1 ring-black/[0.04] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href={`/${username}`}
                    className="block px-4 py-2 text-[15px] leading-[20px] text-[#1D1D1F] hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[15px] leading-[20px] text-[#FF3B30] hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:text-blue-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 text-[15px] leading-[20px] font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
