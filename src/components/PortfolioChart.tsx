"use client";

import { Card, Text } from "@tremor/react";
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

const categories = ["Portfolio", "S&P 500", "Bill Gates", "Gold"];

interface PortfolioChartProps {
  title?: string;
  subtitle?: string;
  showSocials?: boolean;
  privacy?: "public" | "private";
  showCompare?: boolean;
}

export default function PortfolioChart({
  title = "Portfolio Performance",
  subtitle,
  showSocials = true,
  privacy,
  showCompare = false,
}: PortfolioChartProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
            {title}
            {subtitle ? ` • ${subtitle}` : ""}
          </Text>
          {privacy && (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[13px] leading-[18px] font-medium ${
                privacy === "private"
                  ? "bg-[#FF3B30]/[0.08] text-[#FF3B30]"
                  : "bg-[#00A852]/[0.08] text-[#00A852]"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {privacy === "private" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </>
                )}
              </svg>
              {privacy === "private" ? "Private" : "Public"}
            </span>
          )}
        </div>
        {showSocials && (
          <div className="flex items-center gap-3">
            <button className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </button>
            <button className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
            <button className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <LineChart
        className="h-80"
        data={chartData}
        index="date"
        categories={showCompare ? categories : ["Portfolio"]}
        valueFormatter={(value) => `${value.toFixed(1)}%`}
        xAxisLabel="Time"
        yAxisLabel="Return (%)"
      />
    </div>
  );
}
