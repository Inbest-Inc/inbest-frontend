"use client";

export const runtime = "edge";

import { Card, Text } from "@tremor/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PortfolioChart from "@/components/PortfolioChart";
import ActivityTable from "@/components/ActivityTable";
import OpinionsFeed from "@/components/OpinionsFeed";
import { getPortfolioHoldings, getUserInfo } from "@/services/portfolioService";
import Link from "next/link";

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
  const params = useParams();
  const [holdings, setHoldings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "John Doe" });

  // Default user data
  const userData = {
    name: "John Doe",
    username: params.username as string,
    followers: "0",
    avatar:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236E6E73'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E",
    ranking: {
      position: 30,
      totalUsers: 763927,
    },
    returns: {
      lastTrade: 87.2,
      monthly: -2.3,
    },
  };

  useEffect(() => {
    const checkOwnership = () => {
      const currentUsername = localStorage.getItem("username");
      setIsOwnProfile(currentUsername === params.username);
    };

    checkOwnership();
  }, [params.username]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo(params.username as string);
        if (response.name) {
          setUserInfo({ name: response.name });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (params.username) {
      fetchUserInfo();
    }
  }, [params.username]);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await getPortfolioHoldings(Number(params.portfolio));
        if (response.status === "success") {
          setHoldings(response.data.holdings);
        }
      } catch (error) {
        console.error("Error fetching holdings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();
  }, [params.portfolio]);

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
                  alt={userInfo.name}
                  fill
                  className="object-cover rounded-2xl ring-1 ring-black/[0.04]"
                />
              </div>
              <div>
                <Text className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] mb-2">
                  {userInfo.name}
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {userData.followers} followers
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isOwnProfile ? (
                <Link
                  href={`/${params.username}/${params.portfolio}/manage`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[15px] leading-[20px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-200"
                >
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Manage
                </Link>
              ) : (
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
              )}
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
            <PortfolioChart showCompare={true} showSocials={false} />
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
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : holdings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                    No holdings found
                  </Text>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {holdings.map((holding) => (
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
                        {/* Last Action row commented out as requested */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
