"use client";

import { Card } from "@tremor/react";
import Image from "next/image";
import PortfolioChart from "@/components/PortfolioChart";
import ActivityTable from "@/components/ActivityTable";
import OpinionsFeed from "@/components/OpinionsFeed";

// Mock data - we can replace this later
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
        type: "sell",
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
        type: "increase",
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
        type: "start",
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
        type: "decrease",
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
        type: "increase",
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
        type: "buy",
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
        type: "start",
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

const TradeCard = ({
  title,
  data,
}: {
  title: string;
  data: typeof bestTradeData;
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8">
          <Image
            src={data.logo}
            alt={data.symbol}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.symbol}</div>
          <span
            className={`text-sm font-medium ${data.return >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.return >= 0 ? "+" : ""}
            {data.return}%
          </span>
        </div>
      </div>
    </div>
    <div className="space-y-3 mt-4">
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Opened at</span>
        <span className="text-gray-900">{data.firstBuy}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Closed at</span>
        <span className="text-gray-900">{data.lastSell}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600">Hold Period</span>
        <span className="text-gray-900">{data.holdPeriod}</span>
      </div>
    </div>
  </Card>
);

export default function PortfolioPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - 25% width */}
        <div className="lg:w-1/4 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={userData.avatar}
                  alt={userData.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-900">
                {userData.name}
              </h1>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-4">
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

              {/* Ranking */}
              <p className="text-sm text-gray-600 text-center mb-6">
                Ranked #{userData.ranking.position.toLocaleString()} out of{" "}
                {userData.ranking.totalUsers.toLocaleString()} Inbest Investors
              </p>

              {/* Returns Cards */}
              <div className="w-full space-y-3">
                {/* Last Trade Card */}
                <div className="rounded-lg border border-gray-100 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Last Trade
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-xl font-bold ${
                            userData.returns.lastTrade >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {userData.returns.lastTrade >= 0 ? "+" : ""}
                          {userData.returns.lastTrade}%
                        </span>
                        {userData.returns.lastTrade >= 0 ? (
                          <svg
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l5.159-2.512m-5.159 2.512l-2.512 5.159"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Returns Card */}
                <div className="rounded-lg border border-gray-100 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Monthly Return
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-xl font-bold ${
                            userData.returns.monthly >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {userData.returns.monthly >= 0 ? "+" : ""}
                          {userData.returns.monthly}%
                        </span>
                        {userData.returns.monthly >= 0 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trending-up text-green-600"
                          >
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trending-down text-red-600"
                          >
                            <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                            <polyline points="16 17 22 17 22 11" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Portfolio Returns Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Portfolio Returns
            </h2>
            <div className="space-y-3">
              {Object.entries(portfolioReturns).map(([period, value]) => (
                <div
                  key={period}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-600">{period}</span>
                  <span
                    className={`font-medium ${
                      value >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {value >= 0 ? "+" : ""}
                    {value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Best Trade Card */}
          <TradeCard title="Best Trade" data={bestTradeData} />
          <TradeCard title="Worst Trade" data={worstTradeData} />
        </div>

        {/* Right column - 75% width */}
        <div className="lg:w-3/4 space-y-6">
          {/* Portfolio Performance Chart */}
          <Card className="p-6">
            <PortfolioChart title="Yeni Portfolyo" />
          </Card>

          {/* Holdings Table */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Holdings</h2>
              <p className="text-sm text-gray-600">
                Current portfolio allocations
              </p>
            </div>
            <ActivityTable data={userData.holdings} />
          </Card>

          {/* User Opinions */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-600">
                Latest investment decisions and thoughts
              </p>
            </div>
            <div className="mt-6">
              <OpinionsFeed activeTab="following" />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
