"use client";

export const runtime = "edge";

import { useState, useEffect, useRef } from "react";
import { Card, Text } from "@tremor/react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PortfolioChart from "@/components/PortfolioChart";
import UserPosts from "@/components/UserPosts";
import CreatePortfolioModal from "@/components/CreatePortfolioModal";
import {
  createPortfolio,
  getPortfoliosByUsername,
} from "@/services/portfolioService";
import { uploadProfilePhoto } from "@/services/fileUploadService";
import {
  updateUserProfile,
  changePassword,
  getUserInfo,
} from "@/services/userService";
import {
  followUser,
  unfollowUser,
  isFollowingUser,
} from "@/services/followService";
import { toast, Toaster } from "react-hot-toast";
import NotFoundPage from "@/components/NotFoundPage";
import FollowersModal from "@/components/FollowersModal";
import FollowingModal from "@/components/FollowingModal";
import Avatar from "@/components/Avatar";

// Update mock data
const DEFAULT_NAME = "John Doe";
const DEFAULT_FOLLOWERS = 0;
const DEFAULT_FOLLOWING = 0;

const SocialButton = ({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "danger" | "success";
}) => {
  // Determine the button style based on the variant
  const buttonStyle =
    variant === "primary"
      ? "text-white bg-blue-600 hover:bg-blue-700"
      : variant === "danger"
        ? "text-white bg-red-600 hover:bg-red-700"
        : variant === "success"
          ? "text-white bg-green-600 hover:bg-green-700"
          : "text-[#1D1D1F] bg-gray-50/80 hover:bg-gray-100/80";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-[15px] leading-[20px] font-medium ${buttonStyle} backdrop-blur-sm rounded-full ring-1 ring-black/[0.04] transition-all duration-200`}
    >
      {icon}
      {label}
    </button>
  );
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"profile" | "password">("profile");
  const [showCreatePortfolioModal, setShowCreatePortfolioModal] =
    useState(false);
  const [portfolios, setPortfolios] = useState<
    Array<{
      portfolioId: number;
      portfolioName: string;
      visibility: "public" | "private";
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ name: DEFAULT_NAME });
  const [followerCount, setFollowerCount] = useState(DEFAULT_FOLLOWERS);
  const [followingCount, setFollowingCount] = useState(DEFAULT_FOLLOWING);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState("User not found");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowActionLoading, setIsFollowActionLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // Add state for active tab with a default of "portfolios"
  const [activeTab, setActiveTab] = useState<"portfolios" | "posts">(
    "portfolios"
  );

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: params.username as string,
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Add effect to sync URL hash with active tab
  useEffect(() => {
    // Check for existing hash on initial load
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#posts") {
        setActiveTab("posts");
      } else if (hash === "#portfolios") {
        setActiveTab("portfolios");
      }

      // Listen for hash changes
      const handleHashChange = () => {
        const newHash = window.location.hash;
        if (newHash === "#posts") {
          setActiveTab("posts");
        } else if (newHash === "#portfolios") {
          setActiveTab("portfolios");
        }
      };

      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

  // Function to change tab and update URL hash
  const changeTab = (tab: "portfolios" | "posts") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.location.hash = tab;
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!storedUsername);
    setLoggedInUsername(storedUsername || "");
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsUserInfoLoading(true);

      try {
        const response = await getUserInfo(params.username as string);

        // Debug: log the user info response to inspect fields
        console.log("User info response:", response);

        if (response.status === "error") {
          console.error("Error fetching user info:", response.message);
          setUserNotFound(true);
          setNotFoundMessage(response.message || "User not found");
          setIsUserInfoLoading(false);
          return;
        }

        if (response.fullName) {
          // Split the name into name and surname if possible
          const nameParts = response.fullName.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setUserInfo({ name: response.fullName });
          setFormData((prev) => ({
            ...prev,
            name: firstName,
            surname: lastName,
          }));
        }

        // Check if profile photo URL is provided
        if (response.imageUrl) {
          // Add timestamp to force cache refresh
          const timestamp = new Date().getTime();
          const imageUrl = response.imageUrl;
          const cachedPhotoUrl = imageUrl.includes("?")
            ? `${imageUrl}&_t=${timestamp}`
            : `${imageUrl}?_t=${timestamp}`;

          setProfilePhoto(cachedPhotoUrl);
        }

        // Update follower count if provided
        if (response.followerCount !== undefined) {
          setFollowerCount(response.followerCount);
        }

        // Update following count if provided
        if (response.followingCount !== undefined) {
          setFollowingCount(response.followingCount);
        }

        // Set isFollowing status based on the API response
        // The backend sends "following" field as boolean
        if (
          response.following !== undefined &&
          typeof response.following === "boolean"
        ) {
          setIsFollowing(response.following);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserNotFound(true);
        setNotFoundMessage("Failed to fetch user information");
      } finally {
        setIsUserInfoLoading(false);
      }
    };

    if (params.username) {
      fetchUserInfo();
    }
  }, [params.username]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      const username = params.username;
      if (!username || Array.isArray(username)) return;

      try {
        const response = await getPortfoliosByUsername(username);
        if (response.status === "success" && response.data) {
          setPortfolios(response.data);
        } else {
          setError(response.message || "Failed to load portfolios");
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, [params.username]);

  // Check if the profile being viewed belongs to the logged-in user
  const isOwnProfile = isAuthenticated && params.username === loggedInUsername;

  // We no longer need to reset isFollowing state on profile change
  // as it is now set from the API response
  /* useEffect(() => {
    // If the page is reloaded, the following state will be reset to false
    // The user will have to click follow again if they were following before
    setIsFollowing(false);
  }, [params.username]); */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    if (editMode === "profile") {
      // Client-side validation for profile update
      if (!formData.name.trim()) {
        toast.error("First name is required");
        return;
      }

      if (!formData.surname.trim()) {
        toast.error("Last name is required");
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await updateUserProfile({
          name: formData.name.trim(),
          surname: formData.surname.trim(),
        });

        // Update the displayed name after successful update
        setUserInfo({ name: `${formData.name} ${formData.surname}` });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        // Error toast is already handled in the service
      } finally {
        setIsSubmitting(false);
      }
    } else if (editMode === "password") {
      // Client-side validation for password change
      if (!formData.currentPassword) {
        toast.error("Current password is required");
        return;
      }

      if (!formData.newPassword) {
        toast.error("New password is required");
        return;
      }

      if (formData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        });

        // Clear password fields after successful change
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        setIsEditing(false);
        setEditMode("profile");
      } catch (error) {
        console.error("Error changing password:", error);
        // Error handling is done in the service
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Filter portfolios based on ownership and privacy
  const visiblePortfolios = portfolios.filter(
    (p) => p.visibility === "public" || isOwnProfile
  );

  // Handle follow user action
  const handleFollowUser = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to follow users");
      router.push("/login");
      return;
    }

    // Don't allow following yourself
    if (params.username === loggedInUsername) {
      toast.error("You cannot follow yourself");
      return;
    }

    if (isFollowActionLoading) return;

    try {
      setIsFollowActionLoading(true);

      if (isFollowing) {
        // Unfollow user
        const response = await unfollowUser(params.username as string);
        if (response.status === "success") {
          setIsFollowing(false);
          // Update follower count
          setFollowerCount((prev) => Math.max(0, prev - 1));
          // Toast is handled in the service
        } else {
          // If there's an error, don't change the UI state
          console.error("Error unfollowing user:", response.message);
        }
      } else {
        // Follow user
        const response = await followUser(params.username as string);
        if (response.status === "success") {
          setIsFollowing(true);
          // Update follower count
          setFollowerCount((prev) => prev + 1);
          // Toast is handled in the service
        } else {
          // If there's an error, don't change the UI state
          console.error("Error following user:", response.message);
        }
      }
    } catch (error) {
      console.error("Error with follow action:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsFollowActionLoading(false);
    }
  };

  const handleCreatePortfolio = async (data: {
    portfolioName: string;
    visibility: "public" | "private";
  }) => {
    try {
      console.log("Creating portfolio with data:", data);
      const response = await createPortfolio(data);
      console.log("Portfolio creation response:", response);

      // The API returns the portfolio ID directly in the data property as a number
      if (response && response.status === "success" && response.data) {
        const portfolioId = response.data; // The data property IS the portfolio ID
        const redirectUrl = `/${loggedInUsername}/${portfolioId}/manage`;
        console.log("Redirecting to:", redirectUrl);

        // Force a hard navigation
        window.location.href = redirectUrl;
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      // Error toast is already handled in the service
      console.error("Failed to create portfolio:", error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsPhotoUploading(true);

    try {
      // Validate file size before uploading (client-side check)
      if (file.size === 0) {
        throw new Error("File is empty");
      }

      // Upload the photo
      const response = await uploadProfilePhoto(file);

      if (response.status === "error") {
        throw new Error(response.message || "Failed to upload profile photo");
      }

      // Generate a cache-busting timestamp
      const timestamp = new Date().getTime();

      // Update the photo version in localStorage to force refresh
      const currentUsername = params.username as string;
      const photoVersionKey = `user_photo_version_${currentUsername}`;
      localStorage.setItem(photoVersionKey, timestamp.toString());

      // Temporarily clear the photo to force a refresh
      setProfilePhoto(null);

      // Short delay to ensure we're getting the latest image
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get the user info with forced fresh data to get the new photo URL
      const userInfo = await getUserInfo(currentUsername, true);

      let newPhotoUrl = null;

      if (userInfo.status === "success" && userInfo.imageUrl) {
        // Add the photo version for cache busting
        const imageUrl = userInfo.imageUrl;
        const photoVersion = userInfo.photoVersion || timestamp;
        const cachedPhotoUrl = imageUrl.includes("?")
          ? `${imageUrl}&_t=${photoVersion}`
          : `${imageUrl}?_t=${photoVersion}`;

        // Set the photo with the cache-busting URL
        setProfilePhoto(cachedPhotoUrl);
        newPhotoUrl = cachedPhotoUrl;
      }

      // Dispatch a custom event to notify other components that the profile photo has been updated
      window.dispatchEvent(
        new CustomEvent("profilePhotoUpdated", {
          detail: {
            username: currentUsername,
            timestamp,
            photoUrl: newPhotoUrl,
            photoVersion: timestamp.toString(),
          },
        })
      );

      // For debugging
      console.log("Photo updated event dispatched:", {
        username: currentUsername,
        timestamp,
        photoUrl: newPhotoUrl,
        photoVersion: timestamp.toString(),
      });

      // Show success message
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      // Error is already shown via toast in the service
    } finally {
      setIsPhotoUploading(false);
    }
  };

  // If user not found, show 404 page
  if (userNotFound && !isUserInfoLoading) {
    return <NotFoundPage message={notFoundMessage} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      <Toaster position="top-center" />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div
                className="relative cursor-pointer"
                onClick={() =>
                  isOwnProfile &&
                  !isPhotoUploading &&
                  fileInputRef.current?.click()
                }
              >
                {!isUserInfoLoading && (
                  <>
                    <div
                      className={`${isPhotoUploading ? "opacity-30" : "opacity-100"} transition-opacity`}
                    >
                      <Avatar
                        src={profilePhoto}
                        name={userInfo.name}
                        size="lg"
                      />
                    </div>
                    {isPhotoUploading && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </>
                )}
                {isOwnProfile && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isPhotoUploading) fileInputRef.current?.click();
                      }}
                      className={`absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow-sm ring-1 ring-black/[0.08] hover:bg-gray-50 transition-colors ${isPhotoUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-label="Upload profile photo"
                      disabled={isPhotoUploading}
                    >
                      <svg
                        className="w-4 h-4 text-[#1D1D1F]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div>
                {!isUserInfoLoading ? (
                  <>
                    <div>
                      <Text className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] mb-2">
                        {userInfo.name}
                      </Text>
                      <div className="flex items-center gap-2 mb-2">
                        <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                          @{params.username}
                        </Text>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setShowFollowersModal(true)}
                          className="flex items-center text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          {followerCount.toLocaleString()} followers
                        </button>
                        <button
                          onClick={() => setShowFollowingModal(true)}
                          className="flex items-center text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          {followingCount.toLocaleString()} following
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-10 w-48 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-5 w-40 bg-gray-200 rounded-lg"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isOwnProfile ? (
                <>
                  <SocialButton
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    }
                    label="Edit Profile"
                    onClick={() => setIsEditing(true)}
                  />
                  {portfolios.length > 0 && (
                    <SocialButton
                      icon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      }
                      label="Create Portfolio"
                      variant="primary"
                      onClick={() => setShowCreatePortfolioModal(true)}
                    />
                  )}
                </>
              ) : (
                <>
                  <SocialButton
                    icon={
                      isFollowing ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      )
                    }
                    variant={isFollowing ? "success" : "primary"}
                    label={
                      isFollowActionLoading
                        ? "Loading..."
                        : isFollowing
                          ? "Following"
                          : "Follow"
                    }
                    onClick={handleFollowUser}
                  />
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex gap-1">
            <button
              onClick={() => changeTab("portfolios")}
              className={`px-6 py-3 text-[15px] leading-[20px] font-medium border-b-2 transition-all ${
                activeTab === "portfolios"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Portfolios
            </button>
            <button
              onClick={() => changeTab("posts")}
              className={`px-6 py-3 text-[15px] leading-[20px] font-medium border-b-2 transition-all ${
                activeTab === "posts"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Posts
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {/* Portfolios Tab */}
          {activeTab === "portfolios" && (
            <>
              {visiblePortfolios.length > 0 ? (
                visiblePortfolios.map((portfolio, index) => (
                  <motion.div
                    key={portfolio.portfolioId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                    className="mb-8"
                  >
                    <div className="relative">
                      <Link
                        href={`/${params.username}/${portfolio.portfolioId}`}
                        className="block group"
                      >
                        <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                          <PortfolioChart
                            title={portfolio.portfolioName}
                            subtitle={
                              portfolio.visibility === "public" ? "" : ""
                            }
                            showSocials={false}
                            privacy={portfolio.visibility}
                            showCompare={false}
                          />
                        </Card>
                      </Link>
                      {isOwnProfile && (
                        <Link
                          href={`/${params.username}/${portfolio.portfolioId}/manage`}
                          className="absolute top-4 right-4 p-2 bg-gray-50/80 backdrop-blur-sm rounded-full hover:bg-gray-100/80 transition-all duration-200 shadow-sm z-10"
                          title="Manage Portfolio"
                        >
                          <svg
                            className="w-5 h-5 text-[#1D1D1F]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : !isOwnProfile && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <Card className="bg-white/60 backdrop-blur-md p-12 ring-1 ring-black/[0.04] shadow-sm rounded-2xl">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="h-16 w-16 rounded-2xl bg-gray-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04] shadow-sm">
                        <svg
                          className="w-8 h-8 text-[#6E6E73]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                          No public portfolios
                        </Text>
                        <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                          {params.username} hasn't shared any portfolios yet
                        </Text>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                    Loading portfolios...
                  </Text>
                </motion.div>
              ) : null}

              {/* Create Portfolio Button for users with no portfolios */}
              {isOwnProfile && portfolios.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <button
                    onClick={() => setShowCreatePortfolioModal(true)}
                    className="w-full"
                  >
                    <Card className="bg-white/60 backdrop-blur-md p-12 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl group">
                      <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-gray-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04] shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="w-8 h-8 text-[#1D1D1F]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                            Create new portfolio
                          </Text>
                          <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                            Start tracking your investments and share your
                            success with others
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </button>
                </motion.div>
              )}
            </>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UserPosts
                username={params.username as string}
                isOwnProfile={isOwnProfile}
              />
            </motion.div>
          )}
        </div>

        {/* Modals */}
        {/* Edit Modal */}
        {isOwnProfile && isEditing && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={() => {
                  setIsEditing(false);
                  setEditMode("profile");
                }}
              >
                <div className="absolute inset-0 bg-[#1D1D1F] opacity-25"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="p-6 border-b border-black/[0.04]">
                  <div className="flex items-center justify-between">
                    <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                      {editMode === "profile"
                        ? "Edit Profile"
                        : "Change Password"}
                    </Text>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditMode("profile")}
                        className={`px-3 py-1 text-[13px] leading-[18px] font-medium rounded-full transition-all ${
                          editMode === "profile"
                            ? "bg-blue-600 text-white"
                            : "text-[#6E6E73] hover:text-[#1D1D1F]"
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode("password")}
                        className={`px-3 py-1 text-[13px] leading-[18px] font-medium rounded-full transition-all ${
                          editMode === "password"
                            ? "bg-blue-600 text-white"
                            : "text-[#6E6E73] hover:text-[#1D1D1F]"
                        }`}
                      >
                        Password
                      </button>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {editMode === "profile" ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-[15px] leading-[20px] font-semibold text-[#1D1D1F]">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          placeholder="First Name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[15px] leading-[20px] font-semibold text-[#1D1D1F]">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.surname}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              surname: e.target.value,
                            })
                          }
                          className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          placeholder="Last Name"
                          required
                        />
                      </div>

                      {/* Commented out username and email inputs */}
                      {/* <div className="space-y-2">
                        <label className="block text-[15px] leading-[20px] font-semibold text-[#1D1D1F]">
                          Username
                        </label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                          className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[15px] leading-[20px] font-semibold text-[#1D1D1F]">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                        />
                      </div> */}
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="block text-[15px] leading-[20px] font-semibold text-[#1D1D1F]">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[15px] leading-[20px] font-semibold text-[#1D1D1F]">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          minLength={6}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[15px] leading-[20px] font-semibold text-[#1D1D1F]">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                          minLength={6}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditMode("profile");
                      }}
                      className="px-4 py-2 text-[15px] leading-[20px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-xl ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 text-[15px] leading-[20px] font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Create Portfolio Modal */}
        <CreatePortfolioModal
          isOpen={showCreatePortfolioModal}
          onClose={() => setShowCreatePortfolioModal(false)}
          onSubmit={handleCreatePortfolio}
        />

        {/* Followers Modal */}
        <FollowersModal
          isOpen={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
          username={params.username as string}
        />

        {/* Following Modal */}
        <FollowingModal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          username={params.username as string}
        />
      </div>
    </div>
  );
}
