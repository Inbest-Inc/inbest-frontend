"use client";

import { Card, Title, Text } from "@tremor/react";
import { useState } from "react";
import OpinionsFeed from "@/components/OpinionsFeed";
import { motion } from "framer-motion";

export default function OpinionsPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[800px]"
          >
            <Title className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight">
              Opinions
            </Title>
            <Text className="mt-4 text-[22px] leading-[28px] text-[#6E6E73]">
              Track investment decisions and insights from the Inbest community
            </Text>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
            {/* Tab Selection */}
            <div className="flex items-center gap-8 border-b border-black/[0.06]">
              <button
                onClick={() => setActiveTab("for-you")}
                className={`pb-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === "for-you"
                    ? "text-[#1D1D1F]"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                For You
                {activeTab === "for-you" && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`pb-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === "following"
                    ? "text-[#1D1D1F]"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                Following
                {activeTab === "following" && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            </div>

            {/* Feed Content */}
            <div className="mt-6">
              <OpinionsFeed activeTab={activeTab} />
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
