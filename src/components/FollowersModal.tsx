import { useState, useEffect } from "react";
import { Text } from "@tremor/react";
import Image from "next/image";
import Link from "next/link";
import { getFollowers } from "@/services/followService";

interface FollowerUser {
  username: string;
  imageUrl: string | null;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236E6E73'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export default function FollowersModal({
  isOpen,
  onClose,
  username,
}: FollowersModalProps) {
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFollowers() {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getFollowers(username);
        if (response.status === "success" && response.data) {
          setFollowers(response.data);
        } else {
          setError(response.message || "Failed to load followers");
        }
      } catch (err) {
        console.error("Error fetching followers:", err);
        setError("An unexpected error occurred while fetching followers");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFollowers();
  }, [isOpen, username]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-lg transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
              Followers
            </Text>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              // Loading state
              <div className="py-8 flex flex-col items-center">
                <div className="w-10 h-10 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                <Text className="text-[15px] leading-[20px] text-[#6E6E73] mt-4">
                  Loading followers...
                </Text>
              </div>
            ) : error ? (
              // Error state
              <div className="py-8 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <Text className="text-[17px] leading-[22px] text-[#1D1D1F] font-medium mb-2">
                  Error Loading Followers
                </Text>
                <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                  {error}
                </Text>
              </div>
            ) : followers.length === 0 ? (
              // Empty state
              <div className="py-8 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
                <Text className="text-[17px] leading-[22px] text-[#1D1D1F] font-medium mb-2">
                  No Followers Yet
                </Text>
                <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                  When people follow {username}, they'll appear here.
                </Text>
              </div>
            ) : (
              // Followers list
              <ul className="space-y-4">
                {followers.map((follower) => (
                  <li
                    key={follower.username}
                    className="flex items-center gap-3"
                  >
                    <Link
                      href={`/${follower.username}`}
                      className="flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded-xl transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-black/[0.08] bg-[#F5F5F7]">
                        <Image
                          src={follower.imageUrl || DEFAULT_AVATAR}
                          alt={follower.username}
                          fill
                          className="object-cover"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                          @{follower.username}
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
