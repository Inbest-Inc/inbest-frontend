"use client";

import React from "react";
import Tooltip from "./Tooltip";

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  className = "",
}) => {
  return (
    <Tooltip content={content} position="top" className={className}>
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
        style={{ display: "inline-flex", verticalAlign: "middle" }}
      >
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
    </Tooltip>
  );
};

// Predefined metric explanations
export const metricExplanations = {
  allocation: "Percentage of the total portfolio value allocated to this asset",
  return: "Percentage change in value since purchase",
  hourlyReturn: "Percentage change in portfolio value over the past hour",
  dailyReturn: "Percentage change in portfolio value over the past day",
  monthlyReturn: "Percentage change in portfolio value over the past month",
  totalReturn: "Total percentage change in portfolio value since creation",
  beta: "Measure of the portfolio's volatility compared to the market. A beta > 1 means more volatile than the market.",
  sharpeRatio:
    "Risk-adjusted return metric. Higher values indicate better returns relative to risk.",
  volatility:
    "Statistical measure of the dispersion of returns. Higher values indicate higher risk.",
  riskScore:
    "Overall risk assessment on a scale of 1-5, with higher values indicating higher risk",
  riskCategory:
    "Categorization of the portfolio's risk profile based on its composition and volatility",
  shares: "Number of shares held for this asset",
  averagePrice: "Average purchase price per share",
  currentPrice: "Current market price per share",
  asset: "The stock or asset held in the portfolio",
  lastTransaction: "Most recent buying or selling activity for this asset",
  ranking:
    "Portfolio's performance ranking compared to other investors on the platform",
  bestTrade:
    "The trade that generated the highest percentage return in this portfolio",
  worstTrade:
    "The trade that generated the lowest percentage return (or highest loss) in this portfolio",
  holdPeriod:
    "The length of time between the first purchase and final sale of this position",
};

export default InfoTooltip;
