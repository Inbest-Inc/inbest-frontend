"use client";

import { useState, useEffect } from "react";
import { Text } from "@tremor/react";
import Link from "next/link";
import Image from "next/image";
import { getFollowing } from "@/services/followService";
import Avatar from "./Avatar";

interface FollowingUser {
  username: string;
  imageUrl: string | null;
}

interface FollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function FollowingModal({
  isOpen,
  onClose,
  username,
}: FollowingModalProps) {
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFollowing() {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getFollowing(username);
        if (response.status === "success" && response.data) {
          setFollowing(response.data);
        } else {
          setError(response.message || "Failed to load following");
        }
      } catch (err) {
        console.error("Error fetching following:", err);
        setError("An unexpected error occurred while fetching following");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFollowing();
  }, [isOpen, username]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        // Only close if clicking the overlay (not the modal content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md mx-auto">
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()} // Prevent clicks on modal from closing it
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
              Following
            </Text>
            <button
              onClick={onClose}
              className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <Text className="text-red-500">{error}</Text>
              </div>
            ) : following.length === 0 ? (
              <div className="py-8 text-center">
                <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                  Not following anyone yet
                </Text>
              </div>
            ) : (
              // Following list
              <ul className="space-y-4">
                {following.map((user) => (
                  <li key={user.username} className="flex items-center gap-3">
                    <Link
                      href={`/${user.username}`}
                      className="flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded-xl transition-colors"
                    >
                      <Avatar
                        src={user.imageUrl}
                        name={user.username}
                        size="md"
                      />
                      <div>
                        <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                          @{user.username}
                        </Text>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
