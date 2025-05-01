"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Posts from "@/components/posts/Posts";

export default function OpinionsPage() {
  const [activeTab, setActiveTab] = useState<"forYou" | "followed">("forYou");

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-b from-gray-50/80 to-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[800px]"
          >
            <h1 className="text-[40px] leading-[48px] font-semibold text-[#1D1D1F] tracking-tight">
              Opinions
            </h1>
            <p className="mt-4 text-[20px] leading-[28px] text-[#6E6E73]">
              Track investment decisions and insights from the Inbest community
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Tab Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-full w-fit">
              <button
                onClick={() => setActiveTab("forYou")}
                className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === "forYou"
                    ? "bg-white text-[#1D1D1F] shadow-sm"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                For You
              </button>
              <button
                onClick={() => setActiveTab("followed")}
                className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === "followed"
                    ? "bg-white text-[#1D1D1F] shadow-sm"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                Following
              </button>
            </div>
          </div>

          {/* Feed Content */}
          <div className="mt-4">
            <Posts view={activeTab} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
