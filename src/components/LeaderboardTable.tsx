"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./Table";
import {
  getBestPortfoliosByTotalReturn,
  getBestPortfoliosByMonthlyReturn,
  getBestPortfoliosByDailyReturn,
  type BestPortfolioResponse,
} from "@/services/portfolioService";

// Trophy icons for top 3
const TrophyGold = () => (
  <div className="h-8 w-8 rounded-full bg-yellow-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04]">
    <svg
      className="w-5 h-5 text-yellow-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  </div>
);

const TrophySilver = () => (
  <div className="h-8 w-8 rounded-full bg-gray-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04]">
    <svg
      className="w-5 h-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  </div>
);

const TrophyBronze = () => (
  <div className="h-8 w-8 rounded-full bg-amber-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04]">
    <svg
      className="w-5 h-5 text-amber-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  </div>
);

interface Portfolio {
  portfolioMetric: {
    portfolioId: number;
    dailyReturn: number;
    monthlyReturn: number;
    totalReturn: number;
    beta: number;
    sharpeRatio: number;
    volatility: number;
    riskScore: number;
    riskCategory: string;
    holdings?: number;
  };
  user: {
    username: string;
    email: string;
    name: string;
    surname: string;
    image_url: string | null;
    followers?: number;
  };
  portfolioDTO: {
    portfolioName: string;
    visibility: string;
  };
  rank?: number;
}

interface LeaderboardTableProps {
  returnFilter: "total" | "monthly" | "daily";
  onError?: (error: Error) => void;
}

export default function LeaderboardTable({
  returnFilter,
  onError,
}: LeaderboardTableProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response: BestPortfolioResponse;

        switch (returnFilter) {
          case "total":
            response = await getBestPortfoliosByTotalReturn();
            break;
          case "monthly":
            response = await getBestPortfoliosByMonthlyReturn();
            break;
          case "daily":
            response = await getBestPortfoliosByDailyReturn();
            break;
          default:
            response = await getBestPortfoliosByTotalReturn();
        }

        if (response.status !== "success") {
          throw new Error(response.message || "Failed to fetch portfolios");
        }

        // Add rank property to each portfolio
        const rankedPortfolios = response.data.map((portfolio, index) => ({
          ...portfolio,
          rank: index + 1,
        }));

        setPortfolios(rankedPortfolios);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching portfolios";
        setError(errorMessage);

        // Call the onError callback if provided
        if (onError && err instanceof Error) {
          onError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [returnFilter, onError]);

  const getReturnValue = (portfolio: Portfolio) => {
    switch (returnFilter) {
      case "total":
        return portfolio.portfolioMetric.totalReturn;
      case "monthly":
        return portfolio.portfolioMetric.monthlyReturn;
      case "daily":
        return portfolio.portfolioMetric.dailyReturn;
      default:
        return portfolio.portfolioMetric.totalReturn;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyGold />;
      case 2:
        return <TrophySilver />;
      case 3:
        return <TrophyBronze />;
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04]">
            <span className="text-sm font-medium text-[#1D1D1F]">{rank}</span>
          </div>
        );
    }
  };

  const formatReturn = (value: number) => {
    // Ensure we always have 2 decimal places
    const formattedValue =
      value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
    return `${formattedValue}%`;
  };

  const getReturnColorClass = (value: number) => {
    return value >= 0 ? "text-[#00A852]" : "text-[#FF3B30]";
  };

  // Add this function to format followers count
  const formatCount = (value: number | undefined) => {
    if (value === undefined) return "0";
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Error state
  if (error) {
    return (
      <div className="py-10 text-center overflow-hidden min-h-[500px] flex flex-col items-center justify-center w-full">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Unable to load portfolios
        </h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="py-10 text-center overflow-hidden min-h-[500px] flex flex-col items-center justify-center w-full">
        <div className="text-blue-500 animate-spin mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
          </svg>
        </div>
        <p className="text-gray-600">Loading portfolios...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden w-full max-w-full">
      <TableRoot className="min-h-[500px] w-full table-fixed overflow-hidden">
        <Table className="w-full max-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-sm font-medium text-[#6E6E73]">
                Rank
              </TableHead>
              <TableHead className="text-sm font-medium text-[#6E6E73] w-[350px]">
                Investor / Portfolio
              </TableHead>
              <TableHead className="text-right text-sm font-medium text-[#6E6E73] min-w-[120px] whitespace-nowrap w-[120px]">
                {returnFilter === "total"
                  ? "Total Return"
                  : returnFilter === "monthly"
                    ? "Monthly Return"
                    : "Daily Return"}
              </TableHead>
              <TableHead className="text-center text-sm font-medium text-[#6E6E73] whitespace-nowrap w-[120px]">
                Risk Category
              </TableHead>
              <TableHead className="text-center text-sm font-medium text-[#6E6E73] whitespace-nowrap w-[100px]">
                Holdings
              </TableHead>
              <TableHead className="text-right text-sm font-medium text-[#6E6E73] whitespace-nowrap w-[100px]">
                Followers
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-gray-500"
                >
                  No portfolios found
                </TableCell>
              </TableRow>
            ) : (
              portfolios.map((portfolio, index) => (
                <motion.tr
                  key={`${portfolio.user.username}-${portfolio.portfolioMetric.portfolioId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <TableCell className="py-4 w-[100px]">
                    <div className="flex items-center gap-2">
                      {getRankIcon(portfolio.rank || index + 1)}
                    </div>
                  </TableCell>
                  <TableCell className="w-[350px]">
                    <Link
                      href={`/${portfolio.user.username}/${portfolio.portfolioMetric.portfolioId}`}
                      className="flex items-center gap-4 group/link"
                    >
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/[0.08] flex-shrink-0">
                        {portfolio.user.image_url ? (
                          <Image
                            src={portfolio.user.image_url}
                            alt={portfolio.user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-500">
                              {portfolio.user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <div className="font-medium text-[#1D1D1F] group-hover/link:text-blue-600 transition-colors duration-200 truncate">
                          {portfolio.user.name} {portfolio.user.surname}
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm text-[#6E6E73] truncate">
                            @{portfolio.user.username}
                          </span>
                          <span className="text-[#6E6E73] flex-shrink-0">
                            •
                          </span>
                          <span className="text-sm text-[#6E6E73] truncate">
                            {portfolio.portfolioDTO.portfolioName}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${getReturnColorClass(getReturnValue(portfolio))} min-w-[120px] whitespace-nowrap w-[120px]`}
                  >
                    {formatReturn(getReturnValue(portfolio))}
                  </TableCell>
                  <TableCell className="text-center w-[120px]">
                    <span className="inline-flex items-center justify-center min-w-[100px] px-3 py-1 rounded-full bg-gray-50/80 backdrop-blur-sm text-sm font-medium text-[#1D1D1F] ring-1 ring-black/[0.04] whitespace-nowrap">
                      {portfolio.portfolioMetric.riskCategory}
                    </span>
                  </TableCell>
                  <TableCell className="text-center w-[100px]">
                    <span className="inline-flex items-center justify-center h-6 min-w-[48px] rounded-full bg-gray-50/80 backdrop-blur-sm text-sm font-medium text-[#1D1D1F] ring-1 ring-black/[0.04] whitespace-nowrap">
                      {portfolio.portfolioMetric.holdings ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap w-[100px]">
                    <span className="font-medium text-[#1D1D1F]">
                      {formatCount(portfolio.user.followers)}
                    </span>
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <Link
                      href={`/${portfolio.user.username}/${portfolio.portfolioMetric.portfolioId}`}
                    >
                      <button className="px-4 py-1.5 rounded-full bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                        View
                      </button>
                    </Link>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  );
}
