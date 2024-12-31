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

import TreemapChart from "@/components/TreemapChart";

import {
  AvailableChartColors,
  AvailableChartColorsKeys,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
  hasOnlyOneValueForKey,
} from "@/lib/chartUtils";

// Helper function to get stock logo URL
const getStockLogo = (symbol: string) => {
  return `https://assets.parqet.com/logos/symbol/${symbol}?format=svg`;
};

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
              Share your portfolio.
              <br />
              Learn from the best.
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
                Get Started
              </Link>
              <Link
                href="/learn-more"
                className="inline-flex items-center px-8 py-4 text-[17px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-full ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-all duration-200"
              >
                Learn More →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learn from Top Investors Section */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
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
                Follow successful investors and replicate their winning
                strategies
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPortfolios.map((portfolio, index) => (
              <motion.div
                key={portfolio.user}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={`/${portfolio.user.toLowerCase().replace(" ", "-")}`}
                >
                  <Card className="bg-white/60 backdrop-blur-sm p-6 hover:bg-white transition-all duration-300 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md rounded-2xl h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                          <Image
                            src={portfolio.avatar}
                            alt={portfolio.user}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                            {portfolio.user}
                          </Text>
                          <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                            {portfolio.followers} followers
                          </Text>
                        </div>
                        <div className="ml-auto">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00A852]/[0.08] backdrop-blur-sm rounded-full ring-1 ring-[#00A852]/[0.08]">
                            <span className="text-sm font-medium text-[#00A852]">
                              {portfolio.monthlyReturn}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <TreemapChart
                          data={portfolio.allocation.map((holding) => ({
                            ...holding,
                            logo: getStockLogo(holding.name),
                          }))}
                          width={600}
                          height={400}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Trades Section */}
      <section className="bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] tracking-tight"
              >
                Best trades this month
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-[22px] leading-[28px] text-[#6E6E73] max-w-2xl"
              >
                Discover the most successful trades and learn from their timing
              </motion.p>
            </div>
            <Link
              href="/trades"
              className="text-[17px] font-medium text-blue-600 hover:text-blue-700"
            >
              View all trades <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 animate-marquee hover:pause-animation"
              style={{
                width: "fit-content",
                animation: "marquee 30s linear infinite",
              }}
            >
              {/* First set of cards */}
              {topTrades.map((trade) => (
                <Card
                  key={trade.id}
                  className="p-6 min-w-[380px] bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-300 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md rounded-2xl"
                >
                  <Link href={`/${trade.user.toLowerCase().replace(" ", "-")}`}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                          <Image
                            src={trade.stockLogo}
                            alt={trade.stock}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                            {trade.stock}
                          </Text>
                          <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                            {trade.stockName}
                          </Text>
                        </div>
                        <div className="ml-auto">
                          <Text className="text-[28px] leading-[34px] font-semibold text-[#00A852]">
                            {trade.return}
                          </Text>
                        </div>
                      </div>

                      <div className="h-[160px]">
                        <AreaChart
                          data={trade.chartData}
                          index="date"
                          categories={["value"]}
                          colors={["emerald"]}
                          showXAxis={false}
                          showYAxis={false}
                          showLegend={false}
                          showGridLines={false}
                          showAnimation={true}
                          className="h-[160px]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <div className="relative h-8 w-8 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                          <Image
                            src={trade.avatar}
                            alt={trade.user}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                          by {trade.user}
                        </Text>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
              {/* Duplicate set for seamless loop */}
              {topTrades.map((trade) => (
                <Card
                  key={`${trade.id}-duplicate`}
                  className="p-6 min-w-[380px] bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-300 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md rounded-2xl"
                >
                  <Link href={`/${trade.user.toLowerCase().replace(" ", "-")}`}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                          <Image
                            src={trade.stockLogo}
                            alt={trade.stock}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                            {trade.stock}
                          </Text>
                          <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                            {trade.stockName}
                          </Text>
                        </div>
                        <div className="ml-auto">
                          <Text className="text-[28px] leading-[34px] font-semibold text-[#00A852]">
                            {trade.return}
                          </Text>
                        </div>
                      </div>

                      <div className="h-[160px]">
                        <AreaChart
                          data={trade.chartData}
                          index="date"
                          categories={["value"]}
                          colors={["emerald"]}
                          showXAxis={false}
                          showYAxis={false}
                          showLegend={false}
                          showGridLines={false}
                          showAnimation={true}
                          className="h-[160px]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <div className="relative h-8 w-8 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                          <Image
                            src={trade.avatar}
                            alt={trade.user}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                          by {trade.user}
                        </Text>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Performance Section */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex flex-col space-y-4 mb-12">
            <div className="flex justify-between items-center">
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
                  Monitor your portfolio performance and compare with market
                  benchmarks
                </motion.p>
              </div>
              <Link
                href="/performance"
                className="text-[17px] font-medium text-blue-600 hover:text-blue-700"
              >
                View detailed stats <span className="ml-1">→</span>
              </Link>
            </div>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm p-8 hover:bg-white transition-all duration-300 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md rounded-2xl">
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <Text className="text-[15px] leading-[20px] text-[#6E6E73] mb-2">
                    Portfolio Performance
                  </Text>
                  <Text className="text-[17px] leading-[22px] text-[#1D1D1F]">
                    +195% growth from $10,000 initial investment
                  </Text>
                </div>
              </div>

              <div className="h-[400px] mt-8">
                <div className="flex items-center justify-end gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00A852]"></div>
                    <span className="text-[15px] leading-[20px] text-[#6E6E73]">
                      Your Portfolio
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-[15px] leading-[20px] text-[#6E6E73]">
                      S&P 500
                    </span>
                  </div>
                </div>
                <AreaChart
                  data={performanceData}
                  index="date"
                  categories={["Portfolio", "S&P 500"]}
                  colors={["emerald", "blue"]}
                  valueFormatter={(number) =>
                    `$${number.toLocaleString("en-US")}`
                  }
                  showAnimation={true}
                  className="h-[400px]"
                  yAxisWidth={80}
                  showLegend={false}
                />
              </div>

              <div className="mt-12 border-t border-gray-100 pt-12">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-black/[0.08] shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-[#00A852]/[0.08] flex items-center justify-center">
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
                      </div>
                      <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                        Total Return
                      </Text>
                    </div>
                    <Text className="text-[34px] leading-[40px] font-semibold text-[#00A852]">
                      +195%
                    </Text>
                    <Text className="text-[13px] leading-[18px] text-[#6E6E73] mt-2">
                      Since inception
                    </Text>
                  </div>
                  <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-black/[0.08] shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-[#00A852]/[0.08] flex items-center justify-center">
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
                            d="M16 8v8m-4-5v5M8 8v8m-4-5v5"
                          />
                        </svg>
                      </div>
                      <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                        Annual Return
                      </Text>
                    </div>
                    <Text className="text-[34px] leading-[40px] font-semibold text-[#00A852]">
                      +45.3%
                    </Text>
                    <Text className="text-[13px] leading-[18px] text-[#6E6E73] mt-2">
                      Last 12 months
                    </Text>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-black/[0.08] shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-6 w-6 rounded-full bg-[#1D1D1F]/[0.04] flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#1D1D1F]"
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
                      </div>
                      <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                        Best Month
                      </Text>
                    </div>
                    <Text className="text-[22px] leading-[28px] text-[#1D1D1F]">
                      +24.3%
                    </Text>
                    <Text className="text-[13px] leading-[18px] text-[#6E6E73] mt-2">
                      March 2024
                    </Text>
                  </div>
                  <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-black/[0.08] shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-6 w-6 rounded-full bg-[#1D1D1F]/[0.04] flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#1D1D1F]"
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
                      </div>
                      <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                        Worst Month
                      </Text>
                    </div>
                    <Text className="text-[22px] leading-[28px] text-[#1D1D1F] mt-1">
                      -8.2%
                    </Text>
                    <Text className="text-[13px] leading-[18px] text-[#6E6E73] mt-1">
                      January 2024
                    </Text>
                  </div>
                  <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-black/[0.08] shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-6 w-6 rounded-full bg-[#1D1D1F]/[0.04] flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#1D1D1F]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                        Risk Score
                      </Text>
                    </div>
                    <Text className="text-[22px] leading-[28px] text-[#1D1D1F] mt-1">
                      Moderate
                    </Text>
                    <Text className="text-[13px] leading-[18px] text-[#6E6E73] mt-1">
                      Well balanced
                    </Text>
                  </div>
                  <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-black/[0.08] shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-6 w-6 rounded-full bg-[#1D1D1F]/[0.04] flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#1D1D1F]"
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
                      <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                        Beta
                      </Text>
                    </div>
                    <Text className="text-[22px] leading-[28px] text-[#1D1D1F] mt-1">
                      0.85
                    </Text>
                    <Text className="text-[13px] leading-[18px] text-[#6E6E73] mt-1">
                      vs S&P 500
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
            {[
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
                description:
                  "Get detailed market analysis and investment opportunities",
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
            ].map((feature, index) => (
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
                href="/learn-more"
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
