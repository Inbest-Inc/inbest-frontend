"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Text } from "@tremor/react";
import { useRouter } from "next/navigation";
import { getUserInfo, checkAuthStatus } from "@/services/userService";
import Avatar from "./Avatar";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [lastPhotoFetch, setLastPhotoFetch] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<{
    photoUrl?: string;
    photoVersion?: string;
    name?: string;
  }>({});

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!storedUsername);
    setUsername(storedUsername || "");
    setIsLoading(false);

    // Verify authentication status with the server
    const verifyAuth = async () => {
      const authStatus = await checkAuthStatus();

      if (authStatus.status === "error") {
        // If server says user is not authenticated, clear localStorage and update state
        if (!!storedUsername) {
          console.log("Auth verification failed, logging out");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          setIsAuthenticated(false);
          setUsername("");
          setProfilePhoto(null);
        }
      } else if (authStatus.status === "success") {
        // If authentication is valid, update user information
        setIsAuthenticated(true);
        setUsername(authStatus.username || storedUsername || "");

        if (authStatus.imageUrl) {
          const timestamp = Date.now();
          const imageUrlWithTimestamp = authStatus.imageUrl.includes("?")
            ? `${authStatus.imageUrl}&_t=${timestamp}`
            : `${authStatus.imageUrl}?_t=${timestamp}`;

          // Set photo directly without clearing first to avoid flickering
          setProfilePhoto(imageUrlWithTimestamp);
        }
      }
    };

    if (storedUsername) {
      verifyAuth();

      // Immediately try to get cached user info for a faster initial render
      try {
        const cacheKey = `user_info_${storedUsername}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          const userData = JSON.parse(cachedData);
          if (userData.status === "success" && userData.imageUrl) {
            // Add cache-busting parameter for initial render
            const timestamp = Date.now();
            const imageUrlWithTimestamp = userData.imageUrl.includes("?")
              ? `${userData.imageUrl}&_t=${timestamp}`
              : `${userData.imageUrl}?_t=${timestamp}`;

            setProfilePhoto(imageUrlWithTimestamp);
            console.log("Set profile photo from cache:", imageUrlWithTimestamp);
          }
        }
      } catch (e) {
        console.error("Error getting cached user data:", e);
      }

      // Force fetch from server as well
      fetchUserInfo(true);
    }

    // Setup event listener for storage changes
    window.addEventListener("storage", handleStorageChange);
    // Set up a custom event listener for profile photo updates
    window.addEventListener("profilePhotoUpdated", handleProfilePhotoUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "profilePhotoUpdated",
        handleProfilePhotoUpdated
      );
    };
  }, []);

  // Improved event handler for profile photo update with type safety
  const handleProfilePhotoUpdated = (event: Event) => {
    // Use CustomEvent with typed detail
    const customEvent = event as CustomEvent<{
      username: string;
      timestamp: number;
      photoUrl: string | null;
      photoVersion?: string;
    }>;

    // Check if the event is for the current user
    const storedUsername = localStorage.getItem("username");
    if (
      (storedUsername === customEvent.detail?.username ||
        username === customEvent.detail?.username) &&
      customEvent.detail?.photoUrl
    ) {
      console.log(
        "Force refreshing profile photo from event",
        customEvent.detail
      );

      // If we have a direct URL in the event, use it immediately
      if (customEvent.detail.photoUrl) {
        // Set the photo directly to avoid flickering
        setProfilePhoto(customEvent.detail.photoUrl);

        // Update last fetch time to prevent immediate re-fetching
        setLastPhotoFetch(Date.now());
        setUserInfo((prev) => ({
          ...prev,
          photoUrl: customEvent.detail.photoUrl || prev.photoUrl,
          photoVersion: customEvent.detail.photoVersion,
        }));
        return;
      }

      // If no direct URL, fetch the user info
      fetchUserInfo(true);
    }
  };

  // Refetch the profile photo every 5 minutes if the user stays on the page
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      () => {
        fetchUserInfo();
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Verify authentication status periodically
  useEffect(() => {
    // Skip if no username in localStorage
    if (!localStorage.getItem("username")) return;

    // Check auth status every minute
    const authCheckInterval = setInterval(async () => {
      const authStatus = await checkAuthStatus();

      if (authStatus.status === "error") {
        // If server says user is not authenticated, clear localStorage and update state
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsAuthenticated(false);
        setUsername("");
        setProfilePhoto(null);
      }
    }, 60 * 1000); // 1 minute

    return () => clearInterval(authCheckInterval);
  }, []);

  const fetchUserInfo = async (forceRefresh = false) => {
    if (!username) return; // Don't fetch if no username is available

    // Adding cache-busting timestamp to avoid browser caching
    const timestamp = new Date().getTime();

    // Skip if we've fetched too recently, unless force refresh is requested
    if (!forceRefresh && timestamp - lastPhotoFetch < 2000) return;

    setLastPhotoFetch(timestamp);

    try {
      // Get user info directly from the user endpoint
      const userInfo = await getUserInfo(username);

      if (userInfo.status === "success" && userInfo.imageUrl) {
        // Add timestamp query parameter to force refresh
        const imageUrl = userInfo.imageUrl;
        // Always add a unique timestamp to completely bust the cache
        const urlWithTimestamp = `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}_t=${timestamp}`;

        // Log the updated photo URL for debugging
        console.log("Updated profile photo URL:", urlWithTimestamp);

        // Set the photo directly without clearing first to avoid flickering
        setProfilePhoto(urlWithTimestamp);

        setUserInfo((prev) => ({
          ...prev,
          photoUrl: urlWithTimestamp,
          photoVersion: userInfo.photoVersion,
        }));
      } else {
        // If no photo URL is returned, use the default avatar
        setProfilePhoto(null);
      }
    } catch (error) {
      // On error, use the default avatar and log the error
      console.error("Error fetching user info:", error);
      setProfilePhoto(null);
    }
  };

  const handleStorageChange = () => {
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!storedUsername);
    setUsername(storedUsername || "");

    if (storedUsername) {
      // Also check auth status with the server when localStorage changes
      checkAuthStatus().then((authStatus) => {
        if (authStatus.status === "error") {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          setIsAuthenticated(false);
          setUsername("");
          setProfilePhoto(null);
        } else {
          fetchUserInfo();
        }
      });
    } else {
      setProfilePhoto(null);
    }
  };

  const handleLogout = () => {
    // First clear the localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Then update the UI immediately
    setIsAuthenticated(false);
    setUsername("");
    setProfilePhoto(null);

    // Navigate to login page
    router.push("/login");
  };

  const renderUserAvatar = () => {
    // First try to use profilePhoto, fallback to userInfo.photoUrl
    let imageUrl = profilePhoto || userInfo?.photoUrl || null;

    // Add version parameter for cache busting if available
    if (userInfo?.photoVersion && imageUrl) {
      imageUrl = imageUrl.includes("?")
        ? `${imageUrl}&_t=${userInfo.photoVersion}`
        : `${imageUrl}?_t=${userInfo.photoVersion}`;
    }

    // Use the actual name or username if available, otherwise username
    const displayName = userInfo?.name || username;

    return <Avatar src={imageUrl} name={displayName} size="sm" />;
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
                    {renderUserAvatar()}
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
