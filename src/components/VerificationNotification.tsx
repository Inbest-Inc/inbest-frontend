"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";
import { getApiUrl } from "@/config/env";

export default function VerificationNotification() {
  const [username, setUsername] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if notification has been dismissed in this session
    const dismissedVerificationBanner = sessionStorage.getItem(
      "dismissedVerificationBanner"
    );
    if (dismissedVerificationBanner === "true") {
      setIsDismissed(true);
    }

    // Get username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);

      // Check verification status
      checkVerificationStatus(storedUsername);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkVerificationStatus = async (username: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/user/check`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check verification status");
      }

      const data = await response.json();
      setIsVerified(data.isVerified === true);
    } catch (error) {
      console.error("Verification check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("dismissedVerificationBanner", "true");
  };

  // Don't show anything if component is still loading, user is verified, or notification is dismissed
  if (isLoading || isVerified === true || isVerified === null || isDismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-blue-50 border-b border-blue-100"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <Text className="text-[15px] leading-[20px] text-blue-800">
            Please verify your email address to unlock all features
          </Text>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/verification-required"
            className="text-blue-600 hover:text-blue-800 text-[14px] leading-[18px] transition-colors"
          >
            Verify now
          </Link>
          <button
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Dismiss"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
