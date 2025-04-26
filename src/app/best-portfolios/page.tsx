"use client";

import { Card, Title, Text } from "@tremor/react";
import LeaderboardTable from "@/components/LeaderboardTable";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BestPortfoliosPage() {
  const [returnFilter, setReturnFilter] = useState<
    "total" | "monthly" | "daily"
  >("total");

  // Function to handle API errors and show toast
  const handleApiError = (error: Error) => {
    console.error("API Error:", error);
    toast.error(error.message || "Failed to load portfolio data");
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full"
        >
          <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden max-w-full">
            <div className="space-y-8 overflow-hidden">
              {/* Filters Row */}
              <div className="flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-4 overflow-hidden">
                  <button
                    onClick={() => setReturnFilter("total")}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full min-w-[120px] text-center whitespace-nowrap ${
                      returnFilter === "total"
                        ? "text-[#1D1D1F] bg-gray-50/80 ring-1 ring-black/[0.04]"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Total Return
                  </button>
                  <button
                    onClick={() => setReturnFilter("monthly")}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full min-w-[120px] text-center whitespace-nowrap ${
                      returnFilter === "monthly"
                        ? "text-[#1D1D1F] bg-gray-50/80 ring-1 ring-black/[0.04]"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Monthly Return
                  </button>
                  <button
                    onClick={() => setReturnFilter("daily")}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full min-w-[120px] text-center whitespace-nowrap ${
                      returnFilter === "daily"
                        ? "text-[#1D1D1F] bg-gray-50/80 ring-1 ring-black/[0.04]"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Daily Return
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="min-h-[550px] w-full overflow-hidden">
                <LeaderboardTable
                  returnFilter={returnFilter}
                  onError={handleApiError}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
