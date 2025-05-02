"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  Title,
  Text,
  Metric,
  AreaChart,
  DonutChart,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";

import {
  AvailableChartColors,
  AvailableChartColorsKeys,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
  hasOnlyOneValueForKey,
} from "@/lib/chartUtils";

import Posts from "@/components/posts/Posts";
import { getStockLogo } from "../utils/stockUtils";

const topTrades = [
  {
    id: 1,
    user: "Warren Buffett",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfPqLD2DHAh-b4RqasJvR4SOHB_JNAq-wuRA&s",
    stock: "NVDA",
    stockName: "NVIDIA Corporation",
    stockLogo: getStockLogo("NVDA"),
    return: "+127%",
    currentPrice: 879.93,
    chartData: [
      { date: "Jan", value: 400 },
      { date: "Feb", value: 450 },
      { date: "Mar", value: 520 },
      { date: "Apr", value: 600 },
      { date: "May", value: 650 },
      { date: "Jun", value: 720 },
      { date: "Jul", value: 879 },
    ],
  },
  {
    id: 2,
    user: "Cathie Wood",
    avatar:
      "https://cdn.britannica.com/93/204193-050-16E326DA/Nancy-Pelosi-2018.jpg",
    stock: "TSLA",
    stockName: "Tesla, Inc.",
    stockLogo: getStockLogo("TSLA"),
    return: "+89%",
    currentPrice: 202.64,
    chartData: [
      { date: "Jan", value: 150 },
      { date: "Feb", value: 180 },
      { date: "Mar", value: 160 },
      { date: "Apr", value: 185 },
      { date: "May", value: 190 },
      { date: "Jun", value: 195 },
      { date: "Jul", value: 202 },
    ],
  },
  {
    id: 3,
    user: "Michael Burry",
    avatar:
      "https://fortune.com/img-assets/wp-content/uploads/2022/11/Burry-old-pic-e1669831918772.jpg",
    stock: "AAPL",
    stockName: "Apple Inc.",
    stockLogo: getStockLogo("AAPL"),
    return: "+45%",
    currentPrice: 179.26,
    chartData: [
      { date: "Jan", value: 140 },
      { date: "Feb", value: 145 },
      { date: "Mar", value: 150 },
      { date: "Apr", value: 160 },
      { date: "May", value: 165 },
      { date: "Jun", value: 170 },
      { date: "Jul", value: 179 },
    ],
  },
  {
    id: 4,
    user: "Bill Ackman",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/0/07/Valeant_Pharmaceuticals%27_Business_Model_%28headshot%29.jpg",
    stock: "META",
    stockName: "Meta Platforms Inc.",
    stockLogo: getStockLogo("META"),
    return: "+94%",
    currentPrice: 484.03,
    chartData: [
      { date: "Jan", value: 250 },
      { date: "Feb", value: 280 },
      { date: "Mar", value: 310 },
      { date: "Apr", value: 340 },
      { date: "May", value: 380 },
      { date: "Jun", value: 420 },
      { date: "Jul", value: 484 },
    ],
  },
  {
    id: 5,
    user: "Samet Sahin",
    avatar: "https://sametsahin.com/images/new-pp.jpeg",
    stock: "AMD",
    stockName: "Advanced Micro Devices",
    stockLogo: getStockLogo("AMD"),
    return: "+82%",
    currentPrice: 178.62,
    chartData: [
      { date: "Jan", value: 100 },
      { date: "Feb", value: 120 },
      { date: "Mar", value: 130 },
      { date: "Apr", value: 145 },
      { date: "May", value: 155 },
      { date: "Jun", value: 165 },
      { date: "Jul", value: 178 },
    ],
  },
  {
    id: 6,
    user: "Mehmet Timsek",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBgTAXz-EbpmyMVUcrO6ra6DolsQxJaF11uA&s",
    stock: "ASML",
    stockName: "ASML Holding N.V.",
    stockLogo: getStockLogo("ASML"),
    return: "+76%",
    currentPrice: 957.82,
    chartData: [
      { date: "Jan", value: 550 },
      { date: "Feb", value: 600 },
      { date: "Mar", value: 650 },
      { date: "Apr", value: 750 },
      { date: "May", value: 800 },
      { date: "Jun", value: 880 },
      { date: "Jul", value: 957 },
    ],
  },
];

const featuredPortfolios = [
  {
    user: "Sude Akarcay",
    avatar: "https://i.ytimg.com/vi/m0XpDRhnTN8/maxresdefault.jpg",
    allocation: [
      { name: "AAPL", value: 44.3, logo: getStockLogo("AAPL") },
      { name: "PLTR", value: 26.8, logo: getStockLogo("PLTR") },
      { name: "KO", value: 17.4, logo: getStockLogo("KO") },
      { name: "AXP", value: 11.5, logo: getStockLogo("AXP") },
    ],
    monthlyReturn: "+12.4%",
    followers: "124K",
    yearlyReturn: "+42.8%",
    topStock: "AAPL",
    topStockReturn: "+31.2%",
  },
  {
    user: "Ercan Uchar",
    avatar:
      "https://pbs.twimg.com/profile_images/1316982158578298880/BRoYwo1W_400x400.jpg",
    allocation: [
      { name: "TSLA", value: 38.5, logo: getStockLogo("TSLA") },
      { name: "COIN", value: 28.7, logo: getStockLogo("COIN") },
      { name: "ROKU", value: 19.3, logo: getStockLogo("ROKU") },
      { name: "PATH", value: 13.5, logo: getStockLogo("PATH") },
    ],
    monthlyReturn: "+8.9%",
    followers: "89K",
    yearlyReturn: "+36.5%",
    topStock: "COIN",
    topStockReturn: "+47.3%",
  },
];

const performanceData = [
  { date: "Jan 23", Portfolio: 10000, "S&P 500": 10000 },
  { date: "Feb 23", Portfolio: 11200, "S&P 500": 10400 },
  { date: "Mar 23", Portfolio: 12800, "S&P 500": 10900 },
  { date: "Apr 23", Portfolio: 14100, "S&P 500": 11200 },
  { date: "May 23", Portfolio: 15800, "S&P 500": 11600 },
  { date: "Jun 23", Portfolio: 17300, "S&P 500": 12100 },
  { date: "Jul 23", Portfolio: 19200, "S&P 500": 12500 },
  { date: "Aug 23", Portfolio: 21500, "S&P 500": 12800 },
  { date: "Sep 23", Portfolio: 23800, "S&P 500": 13200 },
  { date: "Oct 23", Portfolio: 25900, "S&P 500": 13500 },
  { date: "Nov 23", Portfolio: 27200, "S&P 500": 13900 },
  { date: "Dec 23", Portfolio: 29500, "S&P 500": 14200 },
];

const samplePortfolioData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    allocation: 35.5,
    averagePrice: 165.32,
    currentPrice: 175.45,
    return: 6.13,
    logo: getStockLogo("AAPL"),
    lastTransaction: {
      type: "increase",
      date: "2024-01-15",
    },
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    allocation: 42.3,
    averagePrice: 420.15,
    currentPrice: 789.9,
    return: 88.0,
    logo: getStockLogo("NVDA"),
    lastTransaction: {
      type: "buy",
      date: "2024-01-10",
    },
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    allocation: 22.2,
    averagePrice: 310.45,
    currentPrice: 345.2,
    return: 11.19,
    logo: getStockLogo("MSFT"),
    lastTransaction: {
      type: "start",
      date: "2024-01-05",
    },
  },
];

// Activity Table Component
const ActivityTable = ({ data }: { data: any[] }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Asset</TableHeaderCell>
          <TableHeaderCell className="text-right">Allocation %</TableHeaderCell>
          <TableHeaderCell className="text-right">Avg Price</TableHeaderCell>
          <TableHeaderCell className="text-right">
            Current Price
          </TableHeaderCell>
          <TableHeaderCell className="text-right">Return</TableHeaderCell>
          <TableHeaderCell>Last Transaction</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((holding) => (
          <TableRow key={holding.symbol}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8">
                  <Image
                    src={holding.logo}
                    alt={holding.name}
                    fill
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {holding.symbol}
                  </div>
                  <div className="text-sm text-gray-500">{holding.name}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">
              {holding.allocation.toFixed(1)}%
            </TableCell>
            <TableCell className="text-right">
              ${holding.averagePrice.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              ${holding.currentPrice.toFixed(2)}
            </TableCell>
            <TableCell
              className={`text-right font-medium ${
                holding.return >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {holding.return >= 0 ? "+" : ""}
              {holding.return.toFixed(2)}%
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-full ${
                    holding.lastTransaction.type === "increase" ||
                    holding.lastTransaction.type === "buy"
                      ? "bg-green-100"
                      : holding.lastTransaction.type === "decrease" ||
                          holding.lastTransaction.type === "sell"
                        ? "bg-red-100"
                        : "bg-blue-100"
                  } flex items-center justify-center`}
                >
                  <svg
                    className={`w-3 h-3 ${
                      holding.lastTransaction.type === "increase" ||
                      holding.lastTransaction.type === "buy"
                        ? "text-green-600"
                        : holding.lastTransaction.type === "decrease" ||
                            holding.lastTransaction.type === "sell"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {holding.lastTransaction.type === "increase" ||
                    holding.lastTransaction.type === "buy" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    ) : holding.lastTransaction.type === "decrease" ||
                      holding.lastTransaction.type === "sell" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    )}
                  </svg>
                </div>
                <span className="text-sm text-gray-600">
                  {holding.lastTransaction.date}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Define chart colors using Tailwind classes that work well with Tremor
const portfolioChartColors = [
  "blue-500",
  "violet-500",
  "orange-500",
  "emerald-500",
  "rose-500",
  "cyan-500",
  "amber-500",
  "indigo-500",
];

// For the trade cards area charts
const tradeChartColor = "emerald-500";

// Move features data outside component
const FEATURES_DATA = [
  {
    title: "Real-time Analytics",
    description:
      "Track your portfolio performance with advanced analytics and insights",
    icon: (
      <svg
        className="w-8 h-8 text-[#1D1D1F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Social Investing",
    description:
      "Learn from successful investors and share your own strategies",
    icon: (
      <svg
        className="w-8 h-8 text-[#1D1D1F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Market Insights",
    description: "Get detailed market analysis and investment opportunities",
    icon: (
      <svg
        className="w-8 h-8 text-[#1D1D1F]"
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
    ),
  },
];

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[56px] leading-[64px] font-semibold text-[#1D1D1F] tracking-tight"
            >
              Invest like the best.
              <br />
              Outperform the market.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-[22px] leading-[28px] text-[#6E6E73] max-w-3xl mx-auto"
            >
              Join a community of investors sharing their portfolios and
              strategies. Track, compare, and grow your investments.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex justify-center gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 text-[17px] font-medium text-white bg-blue-600 rounded-full shadow-sm transition-all duration-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
              >
                Create your portfolio
              </Link>
              <Link
                href="/best-portfolios"
                className="inline-flex items-center px-8 py-4 text-[17px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-full ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-all duration-200"
              >
                See best portfolios →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learn from Top Investors Section - Minimalist Design */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight"
              >
                Learn from top investors
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-[22px] leading-[28px] text-[#6E6E73] max-w-2xl"
              >
                Follow successful investors
              </motion.p>
            </div>
            {/* <Link
              href="/investors"
              className="text-[17px] font-medium text-[#1D1D1F] hover:text-[#0071E3] transition-colors duration-200 flex items-center gap-1 group"
            >
              <span>View all investors</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-hover:translate-x-1 transition-transform duration-200"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link> */}
          </div>

          {/* Minimalist Investor List */}
          <div className="space-y-8">
            {featuredPortfolios.map((portfolio, index) => (
              <motion.div
                key={portfolio.user}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/${portfolio.user.toLowerCase().replace(" ", "-")}`}
                  className="block group"
                >
                  <div className="flex flex-col md:flex-row md:items-center py-8 px-4 hover:bg-[#F5F5F7] rounded-xl transition-colors duration-300">
                    {/* Investor Info */}
                    <div className="flex items-center gap-5 mb-6 md:mb-0 md:w-64 md:flex-shrink-0">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-[#E5E5E5]">
                        <Image
                          src={portfolio.avatar}
                          alt={portfolio.user}
                          fill
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors duration-200">
                          {portfolio.user}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-[#6E6E73]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <span className="text-sm text-[#6E6E73]">
                            {portfolio.followers} followers
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="flex gap-8 mb-6 md:mb-0 md:ml-8 md:flex-shrink-0">
                      <div>
                        <div className="text-sm text-[#6E6E73]">Monthly</div>
                        <div className="text-lg font-semibold text-green-600">
                          {portfolio.monthlyReturn}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-[#6E6E73]">Yearly</div>
                        <div className="text-lg font-semibold text-green-600">
                          {portfolio.yearlyReturn}
                        </div>
                      </div>
                    </div>

                    {/* Top Holdings */}
                    <div className="flex-grow md:ml-12">
                      <div className="text-sm text-[#6E6E73] mb-3">
                        Top Holdings
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {portfolio.allocation.map((holding) => (
                          <div
                            key={holding.name}
                            className="flex items-center gap-2"
                          >
                            <div className="relative h-6 w-6 rounded-md overflow-hidden bg-white border border-[#E5E5E5]">
                              <Image
                                src={holding.logo}
                                alt={holding.name}
                                fill
                                loading="lazy"
                                className="object-contain p-0.5"
                              />
                            </div>
                            <div className="text-sm font-medium text-[#1D1D1F]">
                              {holding.name}
                            </div>
                            <div className="text-xs text-[#6E6E73]">
                              {holding.value}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex md:w-8 md:flex-shrink-0 md:justify-end md:items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#6E6E73] group-hover:text-[#0071E3] transform group-hover:translate-x-1 transition-all duration-200"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Add the "See More" button */}
          <div className="flex justify-center mt-16">
            <Link href="/investors" className="group relative overflow-hidden">
              <div className="relative px-8 py-4 bg-white border border-[#D2D2D7] rounded-full z-10 flex items-center gap-2 group-hover:border-[#0071E3] transition-colors duration-300">
                <span className="text-[17px] font-medium text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors duration-300">
                  Discover more investors
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform group-hover:translate-x-1 transition-transform duration-200"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0071E3]/0 via-[#0071E3]/10 to-[#0071E3]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Trades Section - Minimalist Horizontal Layout */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7] to-white -z-10"></div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight"
            >
              Best trades this month
            </motion.h2>
            <div className="flex justify-between items-end mt-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-[22px] leading-[28px] text-[#6E6E73] max-w-2xl"
              >
                Discover the most successful trades
              </motion.p>
              {/* <Link
                href="/trades"
                className="text-[17px] font-medium text-[#1D1D1F] hover:text-[#0071E3] transition-colors duration-200 flex items-center gap-1 group"
              >
                <span>View all trades</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform group-hover:translate-x-1 transition-transform duration-200"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link> */}
            </div>
          </div>

          {/* Minimalist Horizontal Trade List */}
          <div className="space-y-6">
            {topTrades.slice(0, 5).map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/${trade.user.toLowerCase().replace(" ", "-")}`}
                  className="block group"
                >
                  <div className="flex items-center py-6 px-4 hover:bg-white rounded-xl transition-colors duration-300 border border-transparent hover:border-[#E5E5E5]">
                    {/* Rank */}
                    <div className="w-12 flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-lg font-semibold text-[#0071E3]">
                        {index + 1}
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="flex items-center gap-4 w-64 flex-shrink-0">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-white border border-[#E5E5E5]">
                        <Image
                          src={trade.stockLogo}
                          alt={trade.stock}
                          fill
                          loading="lazy"
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors duration-200">
                          {trade.stock}
                        </div>
                        <div className="text-sm text-[#6E6E73]">
                          {trade.stockName.length > 20
                            ? `${trade.stockName.substring(0, 20)}...`
                            : trade.stockName}
                        </div>
                      </div>
                    </div>

                    {/* Return */}
                    <div className="w-32 flex-shrink-0">
                      <div className="text-xl font-semibold text-green-600">
                        {trade.return}
                      </div>
                    </div>

                    {/* Price Change */}
                    <div className="flex items-center gap-3 flex-grow">
                      <div className="text-base text-[#6E6E73]">
                        ${trade.chartData[0].value}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#6E6E73]"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                      <div className="text-base text-[#1D1D1F]">
                        ${trade.chartData[trade.chartData.length - 1].value}
                      </div>
                    </div>

                    {/* Investor */}
                    <div className="flex items-center gap-3 w-48 flex-shrink-0">
                      <div className="relative h-8 w-8 rounded-xl overflow-hidden">
                        <Image
                          src={trade.avatar}
                          alt={trade.user}
                          fill
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-sm font-medium text-[#1D1D1F]">
                        {trade.user}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="w-8 flex-shrink-0 flex justify-end">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#6E6E73] group-hover:text-[#0071E3] transform group-hover:translate-x-1 transition-all duration-200"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Add the "See More" button */}
          <div className="flex justify-center mt-16">
            <Link href="/trades" className="group relative overflow-hidden">
              <div className="relative px-8 py-4 bg-white border border-[#D2D2D7] rounded-full z-10 flex items-center gap-2 group-hover:border-[#0071E3] transition-colors duration-300">
                <span className="text-[17px] font-medium text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors duration-300">
                  Explore more trades
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform group-hover:translate-x-1 transition-transform duration-200"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0071E3]/0 via-[#0071E3]/10 to-[#0071E3]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Performance Section - Minimalist Design */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight"
              >
                Beat the market
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-[22px] leading-[28px] text-[#6E6E73] max-w-2xl"
              >
                Monitor your portfolio performance
              </motion.p>
            </div>
            {/* <Link
              href="/performance"
              className="text-[17px] font-medium text-[#1D1D1F] hover:text-[#0071E3] transition-colors duration-200 flex items-center gap-1 group"
            >
              <span>View detailed stats</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-hover:translate-x-1 transition-transform duration-200"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link> */}
          </div>

          {/* Performance Overview */}
          <div className="mb-16">
            <div className="flex flex-wrap gap-8 mb-8">
              <div className="flex-1 min-w-[240px]">
                <div className="text-sm text-[#6E6E73] mb-2">Total Return</div>
                <div className="text-4xl font-semibold text-green-600">
                  +195%
                </div>
                <div className="text-sm text-[#6E6E73] mt-1">
                  Since inception
                </div>
              </div>
              <div className="flex-1 min-w-[240px]">
                <div className="text-sm text-[#6E6E73] mb-2">Annual Return</div>
                <div className="text-4xl font-semibold text-green-600">
                  +45.3%
                </div>
                <div className="text-sm text-[#6E6E73] mt-1">
                  Last 12 months
                </div>
              </div>
              <div className="flex-1 min-w-[240px]">
                <div className="text-sm text-[#6E6E73] mb-2">Growth</div>
                <div className="text-4xl font-semibold text-[#1D1D1F]">
                  $29,500
                </div>
                <div className="text-sm text-[#6E6E73] mt-1">
                  From $10,000 initial investment
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl p-8 mb-16 border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-8">
              <div className="text-xl font-semibold text-[#1D1D1F]">
                Performance Comparison
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0071E3]"></div>
                  <span className="text-sm text-[#6E6E73]">Your Portfolio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#86868B]"></div>
                  <span className="text-sm text-[#6E6E73]">S&P 500</span>
                </div>
              </div>
            </div>
            <div className="h-[400px]">
              <AreaChart
                data={performanceData}
                index="date"
                categories={["Portfolio", "S&P 500"]}
                colors={["blue", "gray"]}
                valueFormatter={(number) =>
                  `$${number.toLocaleString("en-US")}`
                }
                showAnimation={true}
                className="h-[400px]"
                yAxisWidth={80}
                showLegend={false}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="py-6">
              <div className="text-sm text-[#6E6E73] mb-2">Best Month</div>
              <div className="text-2xl font-semibold text-green-600">
                +24.3%
              </div>
              <div className="text-sm text-[#6E6E73] mt-1">March 2024</div>
            </div>
            <div className="py-6">
              <div className="text-sm text-[#6E6E73] mb-2">Worst Month</div>
              <div className="text-2xl font-semibold text-red-600">-8.2%</div>
              <div className="text-sm text-[#6E6E73] mt-1">January 2024</div>
            </div>
            <div className="py-6">
              <div className="text-sm text-[#6E6E73] mb-2">Risk Score</div>
              <div className="text-2xl font-semibold text-[#1D1D1F]">
                Moderate
              </div>
              <div className="text-sm text-[#6E6E73] mt-1">Well balanced</div>
            </div>
            <div className="py-6">
              <div className="text-sm text-[#6E6E73] mb-2">Beta</div>
              <div className="text-2xl font-semibold text-[#1D1D1F]">0.85</div>
              <div className="text-sm text-[#6E6E73] mt-1">vs S&P 500</div>
            </div>
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center space-y-4 mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight"
            >
              Everything you need to succeed
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-[22px] leading-[28px] text-[#6E6E73] max-w-2xl mx-auto"
            >
              Powerful features to help you make better investment decisions
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES_DATA.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/60 backdrop-blur-xl p-8 hover:scale-[1.02] transition-all duration-300 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md rounded-3xl h-full">
                  <div className="space-y-6">
                    <div className="h-16 w-16 rounded-2xl bg-gray-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04] shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="space-y-2">
                      <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                        {feature.title}
                      </Text>
                      <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                        {feature.description}
                      </Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight"
            >
              Ready to start your investment journey?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex justify-center gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 text-[17px] font-medium text-white bg-blue-600 rounded-full shadow-sm transition-all duration-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
              >
                Create your account
              </Link>
              <Link
                href="/best-portfolios"
                className="inline-flex items-center px-8 py-4 text-[17px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-full ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-all duration-200"
              >
                Learn More →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Add this to your global CSS file */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </main>
  );
}
