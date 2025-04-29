"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Text } from "@tremor/react";
import { useRouter } from "next/navigation";
import {
  getUserInfo,
  checkAuthStatus,
  searchUsers,
} from "@/services/userService";
import Avatar from "./Avatar";
import VerificationNotification from "./VerificationNotification";

// User search result type
type UserSearchResult = {
  imageUrl: string;
  fullName: string;
  username: string;
};

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

  // Search related states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isAuthenticated &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchTerm("");
        setSearchResults([]);
      }

      // Handle click outside mobile menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAuthenticated]);

  // Focus input when search is opened
  useEffect(() => {
    if (isAuthenticated && isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen, isAuthenticated]);

  // Search for users when search term changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const searchTimeout = setTimeout(async () => {
      if (searchTerm.length >= 3) {
        setIsSearching(true);
        setSearchResults([]);

        try {
          const response = await searchUsers(searchTerm);
          if (response.status === "success" && response.data) {
            setSearchResults(response.data);
          } else {
            setSearchResults([]);
            console.log("Search response:", response);
          }
        } catch (error) {
          console.error("Error searching users:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, isAuthenticated]);

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

    // Reset search state if user is logged out
    if (!storedUsername) {
      setIsSearchOpen(false);
      setSearchTerm("");
      setSearchResults([]);
      setProfilePhoto(null);
    } else {
      // Also check auth status with the server when localStorage changes
      checkAuthStatus().then((authStatus) => {
        if (authStatus.status === "error") {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          setIsAuthenticated(false);
          setUsername("");
          setProfilePhoto(null);

          // Reset search state on logout
          setIsSearchOpen(false);
          setSearchTerm("");
          setSearchResults([]);
        } else {
          fetchUserInfo();
        }
      });
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

    // Reset search state on logout
    setIsSearchOpen(false);
    setSearchTerm("");
    setSearchResults([]);

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

  const handleSearchClick = () => {
    if (!isAuthenticated) return;

    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen && searchInputRef.current) {
      // Focus the input after opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Render navigation links for both desktop and mobile
  const renderNavLinks = () => (
    <>
      <Link
        href="/best-portfolios"
        className="text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:text-blue-600 transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Best Portfolios
      </Link>
      <Link
        href="/opinions"
        className="text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:text-blue-600 transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Opinions
      </Link>

      {/* Search Component - Only show for authenticated users */}
      {isAuthenticated && (
        <div className="relative" ref={searchRef}>
          <button
            onClick={handleSearchClick}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-50/80 hover:bg-gray-100/80 text-[#1D1D1F] transition-all duration-200"
            aria-label="Search users"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {isSearchOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-lg ring-1 ring-black/[0.08] overflow-hidden z-10">
              <div className="p-2">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users (min 3 chars)"
                    className="w-full px-3 py-2 pl-9 text-[15px] leading-[20px] bg-gray-50/80 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <svg
                    className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E6E73]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Search Results */}
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {isSearching ? (
                    <div className="py-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                  ) : searchTerm.length >= 3 && searchResults.length === 0 ? (
                    <div className="py-4 text-center text-[13px] leading-[18px] text-[#6E6E73]">
                      No users found
                    </div>
                  ) : searchTerm.length < 3 ? (
                    <div className="py-4 text-center text-[13px] leading-[18px] text-[#6E6E73]">
                      Enter at least 3 characters to search
                    </div>
                  ) : (
                    searchResults.map((user) => (
                      <Link
                        key={user.username}
                        href={`/${user.username}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50/80 rounded-lg transition-colors"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchTerm("");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Avatar
                          src={user.imageUrl}
                          name={user.fullName}
                          size="sm"
                        />
                        <div>
                          <div className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                            {user.fullName}
                          </div>
                          <div className="text-[13px] leading-[18px] text-[#6E6E73]">
                            @{user.username}
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
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

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-full bg-gray-50/80 hover:bg-gray-100/80 text-[#1D1D1F] transition-all duration-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 mx-auto justify-center flex-1">
              {renderNavLinks()}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center shrink-0 min-w-[180px] justify-end">
              <div
                className={`transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}
              >
                {isAuthenticated ? (
                  <div className="relative group">
                    <div className="flex items-center gap-3">
                      <Text className="hidden sm:block text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
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

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden py-4 bg-white border-t border-black/[0.04] space-y-4 flex flex-col items-center"
            >
              {renderNavLinks()}

              {/* Mobile-only auth links if needed */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-gray-100 w-full flex flex-col items-center">
                  <Link
                    href={`/${username}`}
                    className="py-2 text-[15px] leading-[20px] text-[#1D1D1F]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-2 text-[15px] leading-[20px] text-[#FF3B30]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      {/* Verification notification will only show when needed */}
      <VerificationNotification />
    </>
  );
}
