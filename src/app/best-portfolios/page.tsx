"use client";

import { Card, Title, Text } from "@tremor/react";
import LeaderboardTable from "@/components/LeaderboardTable";
import { motion } from "framer-motion";
import { useState } from "react";

export default function BestPortfoliosPage() {
  const [timeFilter, setTimeFilter] = useState<"all" | "year">("all");
  const [sortBy, setSortBy] = useState<"return" | "followers">("return");

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
              Best Portfolios
            </Title>
            <Text className="mt-4 text-[22px] leading-[28px] text-[#6E6E73]">
              Discover and learn from top-performing investors. Follow their
              strategies and stay ahead of the market.
            </Text>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
            <div className="space-y-8">
              {/* Filters Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTimeFilter("all")}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                      timeFilter === "all"
                        ? "text-[#1D1D1F] bg-gray-50/80 ring-1 ring-black/[0.04]"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => setTimeFilter("year")}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                      timeFilter === "year"
                        ? "text-[#1D1D1F] bg-gray-50/80 ring-1 ring-black/[0.04]"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    This Year
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSortBy("return")}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                      sortBy === "return"
                        ? "text-[#1D1D1F] bg-gray-50/80 ring-1 ring-black/[0.04]"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Sort by Return
                  </button>
                  <button
                    onClick={() => setSortBy("followers")}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                      sortBy === "followers"
                        ? "text-[#1D1D1F] bg-gray-50/80 ring-1 ring-black/[0.04]"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Sort by Followers
                  </button>
                </div>
              </div>

              {/* Table */}
              <LeaderboardTable timeFilter={timeFilter} sortBy={sortBy} />
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
