"use client";

import { Card } from "@tremor/react";
import { LineChart } from "./LineChart";

const chartData = [
  {
    date: "Jan 23",
    Portfolio: 12.5,
    "S&P 500": 4.2,
    Gold: -1.5,
    "Bill Gates": 8.3,
  },
  {
    date: "Feb 23",
    Portfolio: -5.8,
    "S&P 500": 2.1,
    Gold: 3.2,
    "Bill Gates": -2.1,
  },
  {
    date: "Mar 23",
    Portfolio: 18.3,
    "S&P 500": -1.5,
    Gold: 5.4,
    "Bill Gates": 4.2,
  },
  {
    date: "Apr 23",
    Portfolio: 25.7,
    "S&P 500": 3.8,
    Gold: 2.1,
    "Bill Gates": 7.8,
  },
  {
    date: "May 23",
    Portfolio: 15.2,
    "S&P 500": 5.2,
    Gold: -2.3,
    "Bill Gates": 9.1,
  },
  {
    date: "Jun 23",
    Portfolio: 28.4,
    "S&P 500": 6.7,
    Gold: 1.8,
    "Bill Gates": 11.5,
  },
  {
    date: "Jul 23",
    Portfolio: 35.2,
    "S&P 500": 8.1,
    Gold: 0.5,
    "Bill Gates": 13.2,
  },
  {
    date: "Aug 23",
    Portfolio: 22.1,
    "S&P 500": 4.5,
    Gold: 4.2,
    "Bill Gates": 8.9,
  },
  {
    date: "Sep 23",
    Portfolio: 42.3,
    "S&P 500": 3.2,
    Gold: 6.7,
    "Bill Gates": 15.4,
  },
  {
    date: "Oct 23",
    Portfolio: 38.7,
    "S&P 500": 2.8,
    Gold: 8.1,
    "Bill Gates": 12.8,
  },
  {
    date: "Nov 23",
    Portfolio: 45.9,
    "S&P 500": 5.4,
    Gold: 5.3,
    "Bill Gates": 18.2,
  },
  {
    date: "Dec 23",
    Portfolio: 52.4,
    "S&P 500": 7.2,
    Gold: 3.8,
    "Bill Gates": 21.5,
  },
];

const categories = ["Portfolio", "S&P 500", "Gold", "Bill Gates"];

interface PortfolioChartProps {
  title?: string;
}

export default function PortfolioChart({
  title = "Portfolio",
}: PortfolioChartProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Portfolio Performance
          </h2>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </button>
        </div>
      </div>

      <LineChart
        className="h-80"
        data={chartData}
        index="date"
        categories={categories}
        valueFormatter={(value) => `${value.toFixed(1)}%`}
        xAxisLabel="Time"
        yAxisLabel="Return (%)"
      />
    </div>
  );
}
