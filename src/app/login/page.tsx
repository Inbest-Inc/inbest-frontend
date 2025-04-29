"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/config/env";

const API_URL = getApiUrl();

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid username or password");
      }

      // Store the token and username
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      // Redirect to profile page with a full page refresh
      window.location.href = `/${username}`;
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to login. Please try again."
      );
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
            Sign in to Inbest
          </Text>
          <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
            Enter your details below to continue
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

          {/* Username Input */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F]"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              placeholder="your_username"
              minLength={3}
              maxLength={50}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-black/[0.08] text-blue-600 focus:ring-blue-600/20"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-[15px] leading-[20px] text-[#6E6E73]"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-[15px] leading-[20px] text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
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
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </Text>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
