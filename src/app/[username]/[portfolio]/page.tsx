"use client";

import { Card, Text } from "@tremor/react";
import Image from "next/image";
import { motion } from "framer-motion";
import PortfolioChart from "@/components/PortfolioChart";
import ActivityTable from "@/components/ActivityTable";
import OpinionsFeed from "@/components/OpinionsFeed";

// Keep the existing mock data
const userData = {
  name: "Mert Gunes",
  username: "skraatz416",
  location: "Ankara, TR",
  avatar:
    "https://pbs.twimg.com/profile_images/965317696639459328/pRPM9a9H_400x400.jpg",
  ranking: {
    position: 31,
    totalUsers: 763927,
  },
  returns: {
    lastTrade: 87.2,
    monthly: -2.3,
  },
  holdings: [
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      allocation: 22.5,
      averagePrice: 180.5,
      currentPrice: 202.64,
      return: 12.27,
      lastTransaction: {
        type: "sell" as const,
        date: "Mar 15, 2024",
      },
      logo: `https://assets.parqet.com/logos/symbol/TSLA?format=svg`,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      allocation: 18.3,
      averagePrice: 420.75,
      currentPrice: 878.35,
      return: 108.76,
      lastTransaction: {
        type: "increase" as const,
        date: "Mar 14, 2024",
      },
      logo: `https://assets.parqet.com/logos/symbol/NVDA?format=svg`,
    },
    {
      symbol: "PLTR",
      name: "Palantir Technologies",
      allocation: 15.2,
      averagePrice: 12.45,
      currentPrice: 24.89,
      return: 99.92,
      lastTransaction: {
        type: "start" as const,
        date: "Mar 10, 2024",
      },
      logo: `https://assets.parqet.com/logos/symbol/PLTR?format=svg`,
    },
    {
      symbol: "GOOG",
      name: "Alphabet Inc Class C",
      allocation: 12.8,
      averagePrice: 7.85,
      currentPrice: 7.52,
      return: -4.2,
      lastTransaction: {
        type: "decrease" as const,
        date: "Mar 8, 2024",
      },
      logo: `https://assets.parqet.com/logos/symbol/GOOG?format=svg`,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc",
      allocation: 11.4,
      averagePrice: 145.3,
      currentPrice: 179.84,
      return: 23.77,
      lastTransaction: {
        type: "increase" as const,
        date: "Mar 7, 2024",
      },
      logo: `https://assets.parqet.com/logos/symbol/AMZN?format=svg`,
    },
    {
      symbol: "CRWD",
      name: "CrowdStrike Holdings",
      allocation: 10.5,
      averagePrice: 280.45,
      currentPrice: 315.65,
      return: 12.55,
      lastTransaction: {
        type: "buy" as const,
        date: "Mar 5, 2024",
      },
      logo: `https://assets.parqet.com/logos/symbol/CRWD?format=svg`,
    },
    {
      symbol: "PATH",
      name: "UiPath Inc.",
      allocation: 9.3,
      averagePrice: 22.15,
      currentPrice: 23.45,
      return: 5.87,
      lastTransaction: {
        type: "start" as const,
        date: "Mar 1, 2024",
      },
      logo: `https://assets.parqet.com/logos/symbol/PATH?format=svg`,
    },
  ],
};

const portfolioReturns = {
  "1M": -2.3,
  "6M": 15.7,
  "1Y": -2.4,
  YTD: 22.1,
  Total: 67.8,
};

const bestTradeData = {
  symbol: "TSLA",
  return: 324.5,
  firstBuy: "Mar 23, 2020",
  lastSell: "Nov 15, 2021",
  holdPeriod: "1 year 8 months",
  logo: "https://assets.parqet.com/logos/symbol/TSLA?format=svg",
};

const worstTradeData = {
  symbol: "NFLX",
  return: -68.2,
  firstBuy: "Nov 15, 2021",
  lastSell: "May 12, 2022",
  holdPeriod: "6 months",
  logo: "https://assets.parqet.com/logos/symbol/NFLX?format=svg",
};

const StatCard = ({ label, value, subtext, icon, trend = "neutral" }: any) => (
  <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center
        ${
          trend === "positive"
            ? "bg-[#00A852]/[0.08]"
            : trend === "negative"
              ? "bg-[#FF3B30]/[0.08]"
              : "bg-[#1D1D1F]/[0.04]"
        }`}
      >
        {icon}
      </div>
      <Text className="text-[15px] leading-[20px] text-[#6E6E73]">{label}</Text>
    </div>
    <Text
      className={`text-[34px] leading-[40px] font-semibold
      ${
        trend === "positive"
          ? "text-[#00A852]"
          : trend === "negative"
            ? "text-[#FF3B30]"
            : "text-[#1D1D1F]"
      }`}
    >
      {value}
    </Text>
    {subtext && (
      <Text className="text-[13px] leading-[18px] text-[#6E6E73] mt-2">
        {subtext}
      </Text>
    )}
  </div>
);

const SocialButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button className="inline-flex items-center gap-2 px-4 py-2 text-[15px] leading-[20px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-full ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-all duration-200">
    {icon}
    {label}
  </button>
);

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <Image
                  src={userData.avatar}
                  alt={userData.name}
                  fill
                  className="object-cover rounded-2xl ring-1 ring-black/[0.04]"
                />
              </div>
              <div>
                <Text className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] mb-2">
                  {userData.name}
                </Text>
                <div className="flex items-center gap-4">
                  <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                    @{userData.username}
                  </Text>
                  <div className="flex items-center text-[17px] leading-[22px] text-[#6E6E73]">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    {userData.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SocialButton
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                }
                label="Follow"
              />
              <SocialButton
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                }
                label="Share"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Ranking"
            value={`#${userData.ranking.position.toLocaleString()}`}
            subtext={`of ${userData.ranking.totalUsers.toLocaleString()} investors`}
            icon={
              <svg
                className="w-5 h-5 text-[#1D1D1F]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <StatCard
            label="Last Trade"
            value={`+${userData.returns.lastTrade}%`}
            trend="positive"
            icon={
              <svg
                className="w-5 h-5 text-[#00A852]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
          <StatCard
            label="Monthly Return"
            value={`${userData.returns.monthly}%`}
            trend="negative"
            icon={
              <svg
                className="w-5 h-5 text-[#FF3B30]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                />
              </svg>
            }
          />
          <StatCard
            label="Total Return"
            value={`+${portfolioReturns.Total}%`}
            trend="positive"
            icon={
              <svg
                className="w-5 h-5 text-[#00A852]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
        </div>

        {/* Portfolio Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
            <PortfolioChart showCompare={true} />
          </Card>
        </motion.div>

        {/* Best & Worst Trades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Trade */}
            <Card className="overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
              <div className="p-6 border-b border-black/[0.04]">
                <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                  Best Trade
                </Text>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/[0.04]">
                      <Image
                        src={bestTradeData.logo}
                        alt={bestTradeData.symbol}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                        {bestTradeData.symbol}
                      </Text>
                      <Text className="text-[22px] leading-[28px] font-semibold text-[#00A852]">
                        +{bestTradeData.return}%
                      </Text>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#00A852]/[0.08] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#00A852]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#00A852]/[0.04] ring-1 ring-[#00A852]/[0.1]">
                    <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                      Hold Period
                    </Text>
                    <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                      {bestTradeData.holdPeriod}
                    </Text>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                      <Text className="text-[13px] leading-[18px] text-[#6E6E73] mb-1">
                        Entry
                      </Text>
                      <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                        {bestTradeData.firstBuy}
                      </Text>
                    </div>
                    <div className="p-3 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                      <Text className="text-[13px] leading-[18px] text-[#6E6E73] mb-1">
                        Exit
                      </Text>
                      <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                        {bestTradeData.lastSell}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Worst Trade */}
            <Card className="overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
              <div className="p-6 border-b border-black/[0.04]">
                <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                  Worst Trade
                </Text>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/[0.04]">
                      <Image
                        src={worstTradeData.logo}
                        alt={worstTradeData.symbol}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                        {worstTradeData.symbol}
                      </Text>
                      <Text className="text-[22px] leading-[28px] font-semibold text-[#FF3B30]">
                        {worstTradeData.return}%
                      </Text>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#FF3B30]/[0.08] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#FF3B30]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-[#FF3B30]/[0.04] ring-1 ring-[#FF3B30]/[0.1]">
                    <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                      Hold Period
                    </Text>
                    <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                      {worstTradeData.holdPeriod}
                    </Text>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                      <Text className="text-[13px] leading-[18px] text-[#6E6E73] mb-1">
                        Entry
                      </Text>
                      <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                        {worstTradeData.firstBuy}
                      </Text>
                    </div>
                    <div className="p-3 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                      <Text className="text-[13px] leading-[18px] text-[#6E6E73] mb-1">
                        Exit
                      </Text>
                      <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                        {worstTradeData.lastSell}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Holdings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
            <div className="p-6 border-b border-black/[0.04]">
              <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                Holdings
              </Text>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.holdings.map((holding) => (
                  <div
                    key={holding.symbol}
                    className="p-4 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04] hover:bg-white/60 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-1 ring-black/[0.04]">
                        <Image
                          src={holding.logo}
                          alt={holding.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                          {holding.symbol}
                        </Text>
                        <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                          {holding.name}
                        </Text>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                          Allocation
                        </Text>
                        <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                          {holding.allocation}%
                        </Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                          Return
                        </Text>
                        <Text
                          className={`text-[15px] leading-[20px] font-medium ${
                            holding.return >= 0
                              ? "text-[#00A852]"
                              : "text-[#FF3B30]"
                          }`}
                        >
                          {holding.return >= 0 ? "+" : ""}
                          {holding.return}%
                        </Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                          Last Action
                        </Text>
                        <div className="flex items-center gap-1">
                          {holding.lastTransaction.type === "sell" && (
                            <svg
                              className="w-4 h-4 text-[#FF3B30]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                          )}
                          {holding.lastTransaction.type === "buy" && (
                            <svg
                              className="w-4 h-4 text-[#00A852]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                          )}
                          <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                            {holding.lastTransaction.date}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
            <div className="p-6 border-b border-black/[0.04]">
              <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                Recent Activity
              </Text>
            </div>
            <div className="p-6">
              <OpinionsFeed activeTab="following" />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
