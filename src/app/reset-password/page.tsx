"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";
import { getApiUrl } from "@/config/env";

export default function ResetPasswordPage() {
  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token")
      : null;
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate token
    if (!token) {
      setError("Invalid or expired reset token");
      return;
    }

    // Validate passwords match
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(passwords.newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(". "));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${getApiUrl()}/api/auth/reset-password?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: passwords.newPassword }),
        }
      );

      const data = await response.text(); // Response is plain text

      if (!response.ok) {
        throw new Error(data || "Failed to reset password");
      }

      if (data === "Invalid or expired token") {
        throw new Error(data);
      }

      setIsSubmitted(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Password reset failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while resetting your password. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
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
            Please request a new password reset link
          </Text>
          <Link
            href="/forgot-password"
            className="inline-block text-[15px] leading-[20px] text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to forgot password
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
        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center space-y-4">
              <Text className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight">
                Create new password
              </Text>
              <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                Please enter your new password below
              </Text>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <Text className="text-[15px] leading-[20px] text-red-600">
                    {error}
                  </Text>
                </div>
              )}

              {/* New Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F]"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F]"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[44px] flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-[15px] leading-[20px] font-medium text-white transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Resetting password...
                  </div>
                ) : (
                  "Reset password"
                )}
              </button>

              {/* Back to Sign In */}
              <div className="text-center">
                <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </Text>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
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
                Password reset successful
              </Text>
              <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                Your password has been reset successfully
              </Text>
              <Link
                href="/login"
                className="inline-block mt-6 text-[15px] leading-[20px] text-blue-600 hover:text-blue-700 transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
