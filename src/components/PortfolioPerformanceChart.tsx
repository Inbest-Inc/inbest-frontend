"use client";

import { useState, useEffect } from "react";
import { Card, Text } from "@tremor/react";
import { LineChart } from "./LineChart";
import { getPortfolioYearlyReturns } from "@/services/portfolioService";

// Fallback data in case API fails
const fallbackChartData = [
  { date: "Jan 24", Portfolio: 100, "S&P 500": 100, Gold: 100 },
  { date: "Feb 24", Portfolio: 102, "S&P 500": 101, Gold: 101 },
  { date: "Mar 24", Portfolio: 105, "S&P 500": 103, Gold: 103 },
];

interface PortfolioPerformanceChartProps {
  portfolioId: number;
  title?: string;
  subtitle?: string;
  privacy?: "public" | "private";
  showCompare?: boolean;
}

export default function PortfolioPerformanceChart({
  portfolioId,
  title = "Portfolio Performance",
  subtitle,
  privacy,
  showCompare = false,
}: PortfolioPerformanceChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categories = showCompare
    ? ["Portfolio", "S&P 500", "Gold"]
    : ["Portfolio"];

  // Define custom colors for chart categories
  const chartColors = showCompare
    ? ["blue", "rose", "amber"] // Portfolio (blue), S&P 500 (rose), Gold (amber/yellow)
    : ["blue"];

  useEffect(() => {
    const fetchYearlyReturns = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Handle invalid portfolioId
        if (!portfolioId || isNaN(portfolioId) || portfolioId <= 0) {
          setChartData(fallbackChartData);
          setError("Invalid portfolio ID");
          setIsLoading(false);
          return;
        }

        const response = await getPortfolioYearlyReturns(portfolioId);

        if (
          response.status === "success" &&
          response.data &&
          response.data.length > 0
        ) {
          // Transform the data to display in the chart
          const transformedData = response.data.map((item) => {
            return {
              date: formatDate(item.date, false), // Simple date for X-axis
              tooltip: formatDate(item.date, true), // Detailed date+time for tooltip
              Portfolio: parseFloat(item.portfolioReturn.toFixed(2)),
              "S&P 500": parseFloat(item.spyReturn.toFixed(2)),
              Gold: parseFloat(item.goldReturn.toFixed(2)),
            };
          });

          // For single data point case, duplicate the point to create a straight line
          if (transformedData.length === 1) {
            const singlePoint = transformedData[0];
            const duplicatePoint = {
              ...singlePoint,
              date: "Future", // Add a second date point
              tooltip: "Future", // Also update tooltip label
            };
            transformedData.push(duplicatePoint);
          }

          // Only set the chart data if we have at least one data point
          if (transformedData.length > 0) {
            setChartData(transformedData);
          } else {
            setChartData(fallbackChartData);
            setError("Insufficient data to display chart");
          }
        } else if (
          response.status === "success" &&
          (!response.data || response.data.length === 0)
        ) {
          // Handle empty data case
          setChartData(fallbackChartData);
          setError("No performance data available yet");
        } else {
          // Handle error case
          setChartData(fallbackChartData);
          setError(
            response.message || "Failed to load portfolio performance data"
          );
        }
      } catch (err) {
        console.error("Error in PortfolioPerformanceChart:", err);
        setChartData(fallbackChartData);
        setError("Failed to load portfolio performance data");
      } finally {
        setIsLoading(false);
      }
    };

    if (portfolioId) {
      fetchYearlyReturns();
    } else {
      setChartData(fallbackChartData);
      setIsLoading(false);
    }
  }, [portfolioId]);

  const formatDate = (dateStr: string, includeTime = false) => {
    if (!dateStr) return "Unknown";

    try {
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateStr; // Return original string if invalid date
      }

      if (includeTime) {
        return `${date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })} ${date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}`;
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateStr;
    }
  };

  // Calculate min and max values for the chart
  const getChartRange = () => {
    if (chartData.length === 0) return { minValue: 85, maxValue: 115 };

    let minVal = Infinity;
    let maxVal = -Infinity;

    chartData.forEach((item) => {
      categories.forEach((category) => {
        if (item[category] < minVal) minVal = item[category];
        if (item[category] > maxVal) maxVal = item[category];
      });
    });

    // Calculate the range and add more padding below to center values better
    const range = maxVal - minVal;
    const topPadding = Math.max(range * 0.2, 5);
    const bottomPadding = Math.max(range * 0.3, 10); // More padding at the bottom

    // Make sure we don't go below 85 for min value and have at least 20 points range
    return {
      minValue: Math.max(80, Math.floor(minVal - bottomPadding)),
      maxValue: Math.ceil(maxVal + topPadding),
    };
  };

  const { minValue, maxValue } = getChartRange();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
            {title}
            {subtitle ? ` • ${subtitle}` : ""}
          </Text>
        </div>
      </div>

      {error && !isLoading && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-red-600 text-sm mb-4 flex items-start">
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>{error}</div>
        </div>
      )}

      {isLoading ? (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071E3] mb-3"></div>
            <div className="text-[#6E6E73] text-sm">
              Loading performance data...
            </div>
          </div>
        </div>
      ) : (
        <LineChart
          className="h-80"
          data={chartData}
          index="date"
          categories={categories}
          colors={chartColors}
          valueFormatter={(value) => `${value.toFixed(1)}%`}
          xAxisLabel="Time"
          yAxisLabel="Value"
          minValue={minValue}
          maxValue={maxValue}
          connectNulls={true}
          tooltipField="tooltip"
        />
      )}
    </div>
  );
}
