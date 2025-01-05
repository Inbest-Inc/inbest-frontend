"use client";

import { useState, useEffect } from "react";
import { Card, Text } from "@tremor/react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import PortfolioChart from "@/components/PortfolioChart";
import OpinionsFeed from "@/components/OpinionsFeed";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236E6E73'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// Mock data - replace with real data later
const userData = {
  name: "Mert Gunes",
  username: "skraatz416",
  email: "mert@example.com",
  followers: 1243,
  portfolios: [
    {
      id: "tech-growth",
      name: "Tech Growth",
      subtitle: "Growth Portfolio",
      isPublic: true,
    },
    {
      id: "dividend-kings",
      name: "Dividend Kings",
      subtitle: "Income Portfolio",
      isPublic: false,
    },
  ],
};

const SocialButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-4 py-2 text-[15px] leading-[20px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-full ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-all duration-200"
  >
    {icon}
    {label}
  </button>
);

export default function UserProfilePage() {
  const params = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"profile" | "password">("profile");
  const [formData, setFormData] = useState({
    name: userData.name,
    username: userData.username,
    email: userData.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setIsAuthenticated(!!storedUsername);
    setLoggedInUsername(storedUsername || "");
  }, []);

  // Check if the profile being viewed belongs to the logged-in user
  const isOwnProfile = isAuthenticated && params.username === loggedInUsername;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic when API is ready
    setIsEditing(false);
    setEditMode("profile");
  };

  // Filter portfolios based on ownership and privacy
  const visiblePortfolios = userData.portfolios.filter(
    (p) => p.isPublic || isOwnProfile
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
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
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-1 ring-black/[0.08] bg-[#F5F5F7]">
                  <Image
                    src={DEFAULT_AVATAR}
                    alt={userData.name}
                    fill
                    className="object-cover p-2"
                  />
                </div>
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow-sm ring-1 ring-black/[0.08] hover:bg-gray-50 transition-colors">
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
                )}
              </div>
              <div>
                <Text className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] mb-2">
                  {userData.name}
                </Text>
                <div className="flex items-center gap-4">
                  <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                    @{userData.username}
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
                    {userData.followers.toLocaleString()} followers
                  </div>
                </div>
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
                    label="Follow"
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

        {/* Portfolio Performance */}
        {visiblePortfolios.map((portfolio, index) => (
          <motion.div
            key={portfolio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            className="mb-8"
          >
            <Link
              href={`/${userData.username}/${portfolio.id}`}
              className="block group"
            >
              <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                <PortfolioChart
                  title={portfolio.name}
                  subtitle={portfolio.subtitle}
                  showSocials={false}
                  privacy={portfolio.isPublic ? "public" : "private"}
                  showCompare={false}
                />
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Recent Activity */}
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
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
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
                      </div>
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
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-[15px] leading-[20px] font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
