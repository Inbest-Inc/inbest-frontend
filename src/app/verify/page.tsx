"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";
import { getApiUrl } from "@/config/env";

export default function VerifyEmailPage() {
  // Initialize with null to match server-side rendering
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState<string>("");

  // Only access window object inside useEffect to avoid hydration mismatch
  useEffect(() => {
    // Get token from URL after component mounts (client-side only)
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken);

    // Check for stored username
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Separate useEffect for verification to run when token is available
  useEffect(() => {
    // Only verify if we have a token
    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${getApiUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Email verification failed");
        }

        setIsVerified(true);

        // Redirect to profile page after 3 seconds
        setTimeout(() => {
          if (username) {
            window.location.href = `/${username}`;
          } else {
            window.location.href = "/login";
          }
        }, 3000);
      } catch (error) {
        console.error("Email verification failed:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while verifying your email. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, username]);

  // Initial loading state while checking for token
  if (token === null) {
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
            Loading verification
          </Text>
          <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
            Please wait while we check your verification link
          </Text>
        </motion.div>
      </main>
    );
  }

  // No token case
  if (token === "") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[400px] space-y-8 text-center"
        >
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] tracking-tight">
            Invalid or expired token
          </Text>
          <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
            Please request a new verification link
          </Text>
          <Link
            href="/login"
            className="inline-block text-[15px] leading-[20px] text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to login
          </Link>
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
        className="w-full max-w-[400px] space-y-8"
      >
        {isLoading ? (
          <div className="text-center space-y-4">
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
              Verifying your email
            </Text>
            <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
              Please wait while we verify your email address
            </Text>
          </div>
        ) : isVerified ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-[#00A852]/[0.08] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#00A852]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] tracking-tight">
              Email verified successfully
            </Text>
            <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
              Your email has been verified. Redirecting to your profile in 3
              seconds...
            </Text>
            <Link
              href={username ? `/${username}` : "/login"}
              className="inline-block mt-6 text-[15px] leading-[20px] text-blue-600 hover:text-blue-700 transition-colors"
            >
              {username ? "Go to profile" : "Back to sign in"}
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
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
              </div>
            </div>
            <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] tracking-tight">
              Verification failed
            </Text>
            <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
              {error || "Your verification link is invalid or has expired."}
            </Text>
            <Link
              href="/login"
              className="inline-block mt-6 text-[15px] leading-[20px] text-blue-600 hover:text-blue-700 transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </motion.div>
    </main>
  );
}
