"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement registration logic
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Registration attempt with:", { name, email, password });
    } catch (error) {
      console.error("Registration failed:", error);
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
        {/* Header */}
        <div className="text-center space-y-4">
          <Text className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight">
            Create your account
          </Text>
          <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
            Join thousands of investors today
          </Text>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F]"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              placeholder="John Doe"
            />
          </div>

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

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              placeholder="••••••••"
            />
            <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
              Must be at least 8 characters
            </Text>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-6">
            <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </Text>

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
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </Text>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
