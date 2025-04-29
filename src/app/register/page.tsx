"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@tremor/react";
import { getApiUrl } from "@/config/env";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const API_URL = getApiUrl();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Force username to lowercase
    if (name === "username") {
      setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Remove custom email validation - rely on browser's built-in validation

    // Validate password match if confirmPassword is being changed
    if (
      name === "confirmPassword" ||
      (name === "password" && formData.confirmPassword)
    ) {
      if (name === "password" && value !== formData.confirmPassword) {
        setValidationErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords don't match",
        }));
      } else if (name === "confirmPassword" && value !== formData.password) {
        setValidationErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords don't match",
        }));
      } else {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }

    // Validate username format
    if (name === "username" && value) {
      const lowercaseValue = value.toLowerCase();

      // Check if the username contains uppercase letters
      if (value !== lowercaseValue) {
        setValidationErrors((prev) => ({
          ...prev,
          username: "Username must be lowercase only",
        }));
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Remove custom email validation - rely on browser's built-in validation

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Validate username is lowercase
    if (formData.username !== formData.username.toLowerCase()) {
      errors.username = "Username must be lowercase only";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      // Successfully registered, but we're not logging in automatically
      // so we only store the username
      localStorage.setItem("username", formData.username);

      // Redirect to login page
      window.location.href = "/login?registered=true";
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get input class based on validation state
  const getInputClass = (fieldName: string) => {
    const baseClass =
      "w-full h-[44px] px-4 rounded-xl border bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:border-blue-600 transition-all";

    return validationErrors[fieldName]
      ? `${baseClass} border-red-500 focus:ring-red-600/20`
      : `${baseClass} border-black/[0.08] focus:ring-blue-600/20`;
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
            Enter your details below to get started
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
              value={formData.username}
              onChange={handleChange}
              className={getInputClass("username")}
              placeholder="your_username"
              minLength={3}
              maxLength={50}
            />
            {validationErrors.username && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.username}
              </p>
            )}
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
              value={formData.email}
              onChange={handleChange}
              className={getInputClass("email")}
              placeholder="you@example.com"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F]"
            >
              First Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="given-name"
              required
              value={formData.name}
              onChange={handleChange}
              className={getInputClass("name")}
              placeholder="John"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Surname Input */}
          <div className="space-y-2">
            <label
              htmlFor="surname"
              className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F]"
            >
              Last Name
            </label>
            <input
              id="surname"
              name="surname"
              type="text"
              autoComplete="family-name"
              required
              value={formData.surname}
              onChange={handleChange}
              className={getInputClass("surname")}
              placeholder="Doe"
            />
            {validationErrors.surname && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.surname}
              </p>
            )}
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
              value={formData.password}
              onChange={handleChange}
              className={getInputClass("password")}
              placeholder="••••••••"
              minLength={6}
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.password}
              </p>
            )}
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
              value={formData.confirmPassword}
              onChange={handleChange}
              className={getInputClass("confirmPassword")}
              placeholder="••••••••"
              minLength={6}
            />
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.confirmPassword}
              </p>
            )}
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
                Creating account...
              </div>
            ) : (
              "Create account"
            )}
          </button>

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
