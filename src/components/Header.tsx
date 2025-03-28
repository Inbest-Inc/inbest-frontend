"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Text } from "@tremor/react";
import { useRouter } from "next/navigation";
import { getProfilePhoto } from "@/services/fileUploadService";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236E6E73'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [lastPhotoFetch, setLastPhotoFetch] = useState<number>(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!storedUsername);
    setUsername(storedUsername || "");
    setIsLoading(false);

    // Fetch profile photo if authenticated
    if (storedUsername) {
      fetchProfilePhoto();
    }

    // Setup event listener for storage changes
    window.addEventListener("storage", handleStorageChange);
    // Set up a custom event listener for profile photo updates
    window.addEventListener("profilePhotoUpdated", fetchProfilePhoto);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profilePhotoUpdated", fetchProfilePhoto);
    };
  }, []);

  // Refetch the profile photo every 5 minutes if the user stays on the page
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      () => {
        fetchProfilePhoto();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchProfilePhoto = () => {
    // For now, we'll use a hardcoded user ID of 1 as per requirements
    // Adding cache-busting timestamp to avoid browser caching
    const timestamp = new Date().getTime();
    if (timestamp - lastPhotoFetch < 2000) return; // Prevent multiple fetches within 2 seconds

    setLastPhotoFetch(timestamp);
    getProfilePhoto(1)
      .then((photoUrl) => {
        if (!photoUrl) {
          // If no photo URL is returned, use the default avatar
          setProfilePhoto(null);
          return;
        }

        // Add timestamp query parameter to force refresh
        const urlWithTimestamp = photoUrl.includes("?")
          ? `${photoUrl}&t=${timestamp}`
          : `${photoUrl}?t=${timestamp}`;
        setProfilePhoto(urlWithTimestamp);
      })
      .catch((error) => {
        // On error, use the default avatar and log the error
        console.error("Error fetching profile photo:", error);
        setProfilePhoto(null);
      });
  };

  const handleStorageChange = () => {
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!storedUsername);
    setUsername(storedUsername || "");

    if (storedUsername) {
      fetchProfilePhoto();
    } else {
      setProfilePhoto(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] shrink-0"
          >
            Inbest
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8 mx-auto">
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
          <div className="flex items-center shrink-0 min-w-[180px] justify-end">
            <div
              className={`transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              {isAuthenticated ? (
                <div className="relative group">
                  <div className="flex items-center gap-3">
                    <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                      {username}
                    </Text>
                    <div className="relative h-8 w-8 rounded-xl overflow-hidden ring-1 ring-black/[0.08] bg-[#F5F5F7]">
                      <Image
                        src={profilePhoto || DEFAULT_AVATAR}
                        alt="Profile"
                        fill
                        className="object-cover p-1"
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
                <div className="flex items-center gap-3">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
