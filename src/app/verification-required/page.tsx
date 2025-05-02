"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";
import { getApiUrl } from "@/config/env";

export default function VerificationRequiredPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!token || !storedUsername) {
      // If not logged in, redirect to login
      router.push("/login");
      return;
    }

    setUsername(storedUsername);

    // Check user verification status
    const checkVerification = async () => {
      try {
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

        // If already verified, redirect to profile
        if (data.isVerified === true) {
          router.push(`/${storedUsername}`);
          return;
        }

        // Get user email if available
        if (data.email) {
          setEmail(data.email);
        }
      } catch (error) {
        console.error("Verification check failed:", error);
        setError("Failed to check verification status");
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[400px] space-y-8 text-center"
        >
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
          <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] tracking-tight">
            Checking verification status
          </Text>
          <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
            Please wait a moment...
          </Text>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px] space-y-8 text-center"
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
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
        </div>
        <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] tracking-tight">
          Email verification required
        </Text>
        <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
          Please verify your email address to access all features.
          {email && ` Check ${email} for the verification link.`}
        </Text>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <Text className="text-[15px] leading-[20px] text-red-600">
              {error}
            </Text>
          </div>
        )}

        {/* <div className="pt-4">
          <Link
            href={`/${username}`}
            className="inline-block text-[15px] leading-[20px] text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to profile
          </Link>
        </div> */}
      </motion.div>
    </main>
  );
}
