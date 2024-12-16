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
    stockLogo: getStockLogo("NVDA"),
    return: "+127%",
  },
  {
    id: 2,
    user: "Cathie Wood",
    avatar:
      "https://cdn.britannica.com/93/204193-050-16E326DA/Nancy-Pelosi-2018.jpg",
    stock: "TSLA",
    stockLogo: getStockLogo("TSLA"),
    return: "+89%",
  },
  {
    id: 3,
    user: "Michael Burry",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/1/11/Michael_Burry_2010.jpg",
    stock: "AAPL",
    stockLogo: getStockLogo("AAPL"),
    return: "+45%",
  },
];

const featuredPortfolios = [
  {
    user: "Warren Buffett",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfPqLD2DHAh-b4RqasJvR4SOHB_JNAq-wuRA&s",
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
    user: "Cathie Wood",
    avatar:
      "https://cdn.britannica.com/93/204193-050-16E326DA/Nancy-Pelosi-2018.jpg",
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
  { date: "Jan", "Your Portfolio": 10000, "S&P 500": 10000 },
  { date: "Feb", "Your Portfolio": 11200, "S&P 500": 10400 },
  { date: "Mar", "Your Portfolio": 12800, "S&P 500": 10900 },
  { date: "Apr", "Your Portfolio": 14100, "S&P 500": 11200 },
  { date: "May", "Your Portfolio": 15800, "S&P 500": 11600 },
  { date: "Jun", "Your Portfolio": 17300, "S&P 500": 12100 },
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

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight">
            Share your portfolio.
            <br />
            Learn from the best.
          </h1>
          <p className="mt-12 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Join a community of investors sharing their portfolios and
            strategies. Track, compare, and grow your investments.
          </p>
          <div className="mt-12">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Investors Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-16">
            Learn from top investors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPortfolios.map((portfolio) => (
              <Card key={portfolio.user} className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={portfolio.avatar}
                      alt={portfolio.user}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Title>{portfolio.user}</Title>
                    <div className="flex items-center space-x-4 mt-1">
                      <Text className="text-green-600">
                        {portfolio.monthlyReturn} this month
                      </Text>
                      <Text className="text-gray-500">
                        {portfolio.followers} followers
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="mb-2">Portfolio Allocation</Text>
                    <DonutChart
                      data={portfolio.allocation}
                      category="value"
                      index="name"
                      valueFormatter={(number) => `${number.toFixed(1)}%`}
                      colors={["emerald", "blue", "violet", "amber"]}
                      className="h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    {portfolio.allocation.map((stock) => (
                      <div
                        key={stock.name}
                        className="flex justify-between items-center"
                      >
                        <Text>{stock.name}</Text>
                        <Text className="font-medium">{stock.value}%</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Trades Section */}
      <section className="py-32">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-16">
            Best trades this month
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topTrades.map((trade) => (
              <Card key={trade.id} className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative h-8 w-8">
                    <Image
                      src={trade.stockLogo}
                      alt={trade.stock}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <Text className="font-bold text-lg">{trade.stock}</Text>
                    <Text className="text-sm text-gray-500">{trade.user}</Text>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Metric className="text-green-600">{trade.return}</Metric>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Performance Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-16">
            Outperform S&P 500
          </h2>
          <div className="space-y-8">
            <Card className="p-6">
              <Title>Portfolio Performance vs S&P 500</Title>
              <Text>Starting from $10,000 investment</Text>
              <AreaChart
                className="h-72 mt-4"
                data={performanceData}
                index="date"
                categories={["Your Portfolio", "S&P 500"]}
                colors={["violet", "blue"]}
                valueFormatter={(number) => `$${number.toLocaleString()}`}
                showAnimation={true}
              />
            </Card>

            <Card className="p-6">
              <Title className="mb-6">Portfolio Activity</Title>
              <ActivityTable data={samplePortfolioData} />
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-semibold text-gray-900 mb-8">
            Ready to start your investment journey?
          </h2>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
          >
            Create your account
          </Link>
        </div>
      </section>
    </main>
  );
}
