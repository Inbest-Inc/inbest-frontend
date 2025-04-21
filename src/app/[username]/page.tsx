"use client";

export const runtime = "edge";

import { useState, useEffect, useRef } from "react";
import { Card, Text } from "@tremor/react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PortfolioChart from "@/components/PortfolioChart";
import OpinionsFeed from "@/components/OpinionsFeed";
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

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236E6E73'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// Update mock data
const DEFAULT_NAME = "John Doe";
const DEFAULT_FOLLOWERS = 0;

const SocialButton = ({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "danger";
}) => {
  // Determine the button style based on the variant
  const buttonStyle =
    variant === "primary"
      ? "text-white bg-blue-600 hover:bg-blue-700"
      : variant === "danger"
        ? "text-white bg-red-600 hover:bg-red-700"
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
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState("User not found");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowActionLoading, setIsFollowActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: params.username as string,
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  // Check if current user is following the profile user
  useEffect(() => {
    // If the page is reloaded, the following state will be reset to false
    // The user will have to click follow again if they were following before
    setIsFollowing(false);
  }, [params.username]);

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
          toast.success(`Unfollowed @${params.username}`);
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
          toast.success(`Following @${params.username}`);
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
      const response = await createPortfolio(data);
      // After successful creation, redirect to manage portfolio page
      if (response.portfolioId) {
        router.push(`/${loggedInUsername}/${response.portfolioId}/manage`);
      }
    } catch (error) {
      console.error("Failed to create portfolio:", error);
      throw error;
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
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div
                  className="relative w-24 h-24 rounded-2xl overflow-hidden ring-1 ring-black/[0.08] bg-[#F5F5F7] cursor-pointer"
                  onClick={() =>
                    isOwnProfile &&
                    !isPhotoUploading &&
                    fileInputRef.current?.click()
                  }
                >
                  {!isUserInfoLoading && (
                    <>
                      <Image
                        src={profilePhoto || DEFAULT_AVATAR}
                        alt={userInfo.name}
                        fill
                        className={`object-cover ${isPhotoUploading ? "opacity-30" : "opacity-100"} transition-opacity`}
                        style={{ objectFit: "cover" }}
                      />
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
                </div>
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
                      onClick={() =>
                        !isPhotoUploading && fileInputRef.current?.click()
                      }
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
                    <Text className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] mb-2">
                      {userInfo.name}
                    </Text>
                    <div className="flex items-center gap-4">
                      <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                        @{params.username}
                      </Text>
                      <div className="flex items-center text-[17px] leading-[22px] text-[#6E6E73]">
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
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-10 w-48 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isOwnProfile ? (
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
                    variant={isFollowing ? "danger" : "primary"}
                    label={
                      isFollowActionLoading
                        ? "Loading..."
                        : isFollowing
                          ? "Following"
                          : "Follow"
                    }
                    onClick={handleFollowUser}
                  />
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
                          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                        />
                      </svg>
                    }
                    label="Share"
                  />
                </>
              )}
            </div>
          </div>
        </motion.div>

        {visiblePortfolios.length > 0 ? (
          visiblePortfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.portfolioId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              className="mb-8"
            >
              <Link
                href={`/${params.username}/${portfolio.portfolioId}${isOwnProfile ? "/manage" : ""}`}
                className="block group"
              >
                <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                  <PortfolioChart
                    title={portfolio.portfolioName}
                    subtitle={portfolio.visibility === "public" ? "" : ""}
                    showSocials={false}
                    privacy={portfolio.visibility}
                    showCompare={false}
                  />
                </Card>
              </Link>
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

        {/* Recent Activity */}

        {/* Portfolio Performance */}
        {isOwnProfile && (
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
                      Start tracking your investments and share your success
                      with others
                    </Text>
                  </div>
                </div>
              </Card>
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
            <div className="mb-6">
              <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                Recent Activity
              </Text>
            </div>
            <OpinionsFeed activeTab="for-you" />
          </Card>
        </motion.div>

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
      </div>
    </div>
  );
}
