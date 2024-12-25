"use client";

import Link from "next/link";
import Image from "next/image";
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
      { name: "AAPL", value: 47.3 },
      { name: "BAC", value: 23.8 },
      { name: "KO", value: 17.4 },
      { name: "AXP", value: 11.5 },
    ],
    monthlyReturn: "+12.4%",
    followers: "124K",
  },
  {
    user: "Ercan Uchar",
    avatar:
      "https://pbs.twimg.com/profile_images/1316982158578298880/BRoYwo1W_400x400.jpg",
    allocation: [
      { name: "TSLA", value: 38.5 },
      { name: "COIN", value: 28.7 },
      { name: "ROKU", value: 19.3 },
      { name: "PATH", value: 13.5 },
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

// Define a consistent color palette for the entire app
const CHART_COLORS = {
  primary: ["emerald-500", "emerald-400", "emerald-300", "emerald-200"],
  secondary: ["blue-500", "blue-400", "blue-300", "blue-200"],
  comparison: "emerald-600",
  success: "green-600",
  warning: "orange-600",
  danger: "red-600",
};

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight">
              Share your portfolio.
              <br />
              Learn from the best.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join a community of investors sharing their portfolios and
              strategies. Track, compare, and grow your investments.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                Get Started
              </Link>
              <Link
                href="/learn-more"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Investors Section */}
      <section className="bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-semibold text-gray-900">
              Learn from top investors
            </h2>
            <Link
              href="/investors"
              className="text-lg font-medium text-blue-600 hover:text-blue-700"
            >
              View all investors <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPortfolios.map((portfolio) => (
              <Card
                key={portfolio.user}
                className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <Link
                  href={`/portfolio/${portfolio.user.toLowerCase().replace(" ", "-")}`}
                >
                  <div className="space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="relative h-20 w-20 rounded-2xl overflow-hidden">
                        <Image
                          src={portfolio.avatar}
                          alt={portfolio.user}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-medium text-gray-900 mb-2">
                          {portfolio.user}
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-base font-medium text-gray-900">
                              {portfolio.monthlyReturn} this month
                            </span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-base text-gray-600">
                            {portfolio.followers} followers
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <Text className="text-base text-gray-500 mb-4">
                          Top Holdings
                        </Text>
                        <div className="space-y-3">
                          {portfolio.allocation.map((stock) => (
                            <div
                              key={stock.name}
                              className="flex items-center justify-between"
                            >
                              <Text className="font-medium">{stock.name}</Text>
                              <Text className="text-gray-600">
                                {stock.value}%
                              </Text>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Text className="text-base text-gray-500 mb-4">
                          Allocation
                        </Text>
                        <DonutChart
                          data={portfolio.allocation}
                          category="value"
                          index="name"
                          valueFormatter={(number) => `${number.toFixed(1)}%`}
                          colors={AvailableChartColors}
                          className="h-40"
                          showLabel={false}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Trades Section */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-semibold text-gray-900">
              Best trades this month
            </h2>
            <Link
              href="/trades"
              className="text-lg font-medium text-blue-600 hover:text-blue-700"
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
                  className="p-6 min-w-[380px] hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <Link
                    href={`/portfolio/${trade.user.toLowerCase().replace(" ", "-")}`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12">
                          <Image
                            src={trade.stockLogo}
                            alt={trade.stock}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {trade.stock}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {trade.stockName}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-medium text-emerald-600">
                          {trade.return} return
                        </h3>
                      </div>
                      <div className="h-20">
                        <AreaChart
                          data={trade.chartData}
                          index="date"
                          categories={["value"]}
                          colors={[CHART_COLORS.success]}
                          showXAxis={false}
                          showYAxis={false}
                          showLegend={false}
                          showGridLines={false}
                          showAnimation={true}
                          curveType="monotone"
                          startEndOnly={false}
                          className="h-full"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={trade.avatar}
                            alt={trade.user}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {trade.user}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
              {/* Duplicate set of cards for seamless loop */}
              {topTrades.map((trade) => (
                <Card
                  key={`${trade.id}-duplicate`}
                  className="p-6 min-w-[380px] hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <Link
                    href={`/portfolio/${trade.user.toLowerCase().replace(" ", "-")}`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12">
                          <Image
                            src={trade.stockLogo}
                            alt={trade.stock}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {trade.stock}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {trade.stockName}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-medium text-emerald-600">
                          {trade.return} return
                        </h3>
                      </div>
                      <div className="h-20">
                        <AreaChart
                          data={trade.chartData}
                          index="date"
                          categories={["value"]}
                          colors={[CHART_COLORS.success]}
                          showXAxis={false}
                          showYAxis={false}
                          showLegend={false}
                          showGridLines={false}
                          showAnimation={true}
                          curveType="monotone"
                          startEndOnly={false}
                          className="h-full"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={trade.avatar}
                            alt={trade.user}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {trade.user}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Performance Section - Enhanced */}
      <section className="bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex flex-col space-y-4 mb-12">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-semibold text-gray-900">
                Beat the market
              </h2>
              <Link
                href="/performance"
                className="text-lg font-medium text-blue-600 hover:text-blue-700"
              >
                View detailed stats <span className="ml-1">→</span>
              </Link>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl">
              Monitor your portfolio performance and compare with market
              benchmarks
            </p>
          </div>

          <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">
                    Portfolio Performance
                  </h3>
                  <p className="text-base text-gray-600">
                    +195% growth from $10,000 initial investment
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-600">
                      Your Portfolio
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">S&P 500</span>
                  </div>
                </div>
              </div>

              {/* Chart container with default height */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <AreaChart
                  data={performanceData}
                  index="date"
                  categories={["Portfolio", "S&P 500"]}
                  colors={AvailableChartColors}
                  valueFormatter={(number) => `$${number.toLocaleString()}`}
                  showAnimation={true}
                  showLegend={false}
                  showGridLines={false}
                  curveType="monotone"
                />
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="text-sm text-gray-600">Total Value</div>
                  <div className="text-3xl font-semibold text-gray-900 mt-1">
                    $29,500
                  </div>
                  <div className="text-sm text-emerald-600 mt-1">
                    +195% all time
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="text-sm text-gray-600">Monthly Return</div>
                  <div className="text-3xl font-semibold text-gray-900 mt-1">
                    +8.4%
                  </div>
                  <div className="text-sm text-emerald-600 mt-1">
                    +$2,300 this month
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="text-sm text-gray-600">vs S&P 500</div>
                  <div className="text-3xl font-semibold text-gray-900 mt-1">
                    +107.7%
                  </div>
                  <div className="text-sm text-emerald-600 mt-1">
                    Outperforming
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="text-sm text-gray-600">Annual Return</div>
                  <div className="text-3xl font-semibold text-gray-900 mt-1">
                    +92.5%
                  </div>
                  <div className="text-sm text-emerald-600 mt-1">
                    Last 12 months
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-4 p-6 bg-emerald-50 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-emerald-600 font-medium">
                      Best Performing Month
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mt-1">
                      +24.3%
                    </div>
                    <div className="text-sm text-emerald-600 mt-1">
                      March 2024
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-blue-600 font-medium">
                      Risk Score
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mt-1">
                      Moderate
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      Well balanced portfolio
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-semibold text-gray-900">
              Ready to start your investment journey?
            </h2>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                Create your account
              </Link>
              <Link
                href="/learn-more"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
              >
                Learn More →
              </Link>
            </div>
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
