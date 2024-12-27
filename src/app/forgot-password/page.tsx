"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement password reset logic
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Password reset request for:", email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                Reset your password
              </Text>
              <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                Enter your email to receive reset instructions
              </Text>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  placeholder="you@example.com"
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
                    Sending instructions...
                  </div>
                ) : (
                  "Send instructions"
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
                Check your email
              </Text>
              <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                We've sent password reset instructions to {email}
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
