"use client";

export const runtime = "edge";

import { Card, Text } from "@tremor/react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ManageableActivityTable from "@/components/ManageableActivityTable";
import AddStockModal from "@/components/AddStockModal";
import ShareActionModal from "@/components/ShareActionModal";
import PortfolioSettingsModal from "@/components/PortfolioSettingsModal";
import PortfolioChart from "@/components/PortfolioChart";
import {
  deletePortfolio,
  updatePortfolio,
  getPortfolio,
  getPortfolioHoldings,
  addStockToPortfolio,
  updateStockQuantity,
  deleteStockFromPortfolio,
  getPortfolioMetrics,
} from "@/services/portfolioService";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

// Keep existing mock data
const portfolioData = {
  description: "Portfolio",
  isPublic: true,
  overview: {
    dailyReturn: 2.5,
    monthlyReturn: -3.2,
    totalReturn: 45.8,
    rank: 30,
    totalUsers: 763927,
  },
  topMovers: {
    gainers: [
      { symbol: "NVDA", change: 5.2 },
      { symbol: "AMD", change: 3.8 },
    ],
    losers: [
      { symbol: "TSLA", change: -4.1 },
      { symbol: "AAPL", change: -2.3 },
    ],
  },
  riskMetrics: {
    beta: 1.2,
    sharpeRatio: 1.8,
    volatility: 25.4,
  },
  holdings: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 150,
      allocation: 25.5,
      averagePrice: 175.23,
      currentPrice: 182.52,
      return: 4.16,
      logo: "https://assets.parqet.com/logos/symbol/AAPL?format=svg",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      shares: 100,
      allocation: 20.3,
      averagePrice: 285.12,
      currentPrice: 312.45,
      return: 9.59,
      logo: "https://assets.parqet.com/logos/symbol/MSFT?format=svg",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      shares: 80,
      allocation: 18.2,
      averagePrice: 420.5,
      currentPrice: 485.75,
      return: 15.52,
      logo: "https://assets.parqet.com/logos/symbol/NVDA?format=svg",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 60,
      allocation: 15.8,
      averagePrice: 138.45,
      currentPrice: 125.3,
      return: -9.49,
      logo: "https://assets.parqet.com/logos/symbol/GOOGL?format=svg",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      shares: 45,
      allocation: 12.4,
      averagePrice: 280.15,
      currentPrice: 315.2,
      return: 12.51,
      logo: "https://assets.parqet.com/logos/symbol/META?format=svg",
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      shares: 30,
      allocation: 7.8,
      averagePrice: 265.25,
      currentPrice: 202.8,
      return: -23.54,
      logo: "https://assets.parqet.com/logos/symbol/TSLA?format=svg",
    },
  ],
};

const StatCard = ({ label, value, subtext, icon, trend = "neutral" }: any) => (
  <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center
        ${
          trend === "positive"
            ? "bg-[#00A852]/[0.08]"
            : trend === "negative"
              ? "bg-[#FF3B30]/[0.08]"
              : "bg-[#1D1D1F]/[0.04]"
        }`}
      >
        {icon}
      </div>
      <Text className="text-[15px] leading-[20px] text-[#6E6E73]">{label}</Text>
    </div>
    <Text
      className={`text-[34px] leading-[40px] font-semibold
      ${
        trend === "positive"
          ? "text-[#00A852]"
          : trend === "negative"
            ? "text-[#FF3B30]"
            : "text-[#1D1D1F]"
      }`}
    >
      {value}
    </Text>
    {subtext && (
      <Text className="text-[13px] leading-[18px] text-[#6E6E73] mt-2">
        {subtext}
      </Text>
    )}
  </div>
);

interface StockOperation {
  type: "add" | "update" | "delete";
  symbol: string;
  shares: number;
}

export default function ManagePortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const portfolioId = parseInt(params.portfolio as string);

  // Create a stable push function
  const push = useRef(router.push).current;

  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isShareActionModalOpen, setIsShareActionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [isLoadingHoldings, setIsLoadingHoldings] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);

  // Keep track of the fetch function reference
  const fetchDataRef = useRef<(() => Promise<void>) | null>(null);

  /**
   * Handles all stock operations (add/update/delete)
   * @param operation Stock operation details
   */
  const handleStockOperation = async (operation: StockOperation) => {
    if (!operation?.symbol || typeof operation?.shares !== "number") {
      return;
    }

    // Get the callback function if available
    const refreshCallback = fetchDataRef.current || undefined;

    try {
      let response;
      switch (operation.type) {
        case "add":
          response = await addStockToPortfolio(
            portfolioId,
            operation.symbol,
            operation.shares,
            refreshCallback
          );
          if (response?.status === "success") {
            setIsAddStockModalOpen(false);
          }
          break;
        case "update":
          response = await updateStockQuantity(
            portfolioId,
            operation.symbol,
            operation.shares,
            refreshCallback
          );
          break;
        case "delete":
          response = await deleteStockFromPortfolio(
            portfolioId,
            operation.symbol,
            refreshCallback
          );
          break;
      }

      // We don't need to fetch data again since we passed the callback to the service
    } catch (error) {
      console.error("Error during stock operation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update portfolio"
      );
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      setIsLoadingHoldings(true);
      setIsMetricsLoading(true);
      try {
        // Check access first
        const token = localStorage.getItem("token");
        const currentUsername = localStorage.getItem("username");

        if (!token || currentUsername !== params.username) {
          push(`/${params.username}/${params.portfolio}`);
          return;
        }

        const portfolioResponse = await getPortfolio(portfolioId);
        if (!isSubscribed) return;

        if (portfolioResponse.status !== "success") {
          push(`/${params.username}/${params.portfolio}`);
          return;
        }

        // Update portfolio data
        setPortfolioName(portfolioResponse.data.portfolioName);
        setIsPublic(portfolioResponse.data.visibility === "public");

        // Fetch holdings data
        try {
          const holdingsResponse = await getPortfolioHoldings(portfolioId);
          if (!isSubscribed) return;

          if (holdingsResponse.status === "success") {
            setHoldings(holdingsResponse.data.holdings || []);
          }
        } catch (error: any) {
          if (!isSubscribed) return;
          // Silently handle "No stocks" case
          setHoldings([]);
          // Only log other errors
          if (
            !error.message?.includes("No stocks") &&
            !error.message?.includes("404")
          ) {
            console.error("Error fetching holdings:", error);
          }
        }

        // Fetch metrics data
        try {
          const metricsResponse = await getPortfolioMetrics(portfolioId);
          if (!isSubscribed) return;

          if (metricsResponse.status === "success") {
            setMetrics(metricsResponse.data);
          }
        } catch (error) {
          if (!isSubscribed) return;
          console.error("Error fetching metrics:", error);
        } finally {
          if (isSubscribed) {
            setIsMetricsLoading(false);
          }
        }
      } catch (error) {
        if (!isSubscribed) return;
        console.error("Error fetching portfolio:", error);
        push(`/${params.username}/${params.portfolio}`);
      } finally {
        if (isSubscribed) {
          setIsLoadingHoldings(false);
        }
      }
    };

    // Store the fetch function reference
    fetchDataRef.current = fetchData;
    fetchData();

    return () => {
      isSubscribed = false;
    };
  }, [portfolioId, params.username, params.portfolio, push]);

  const handlePortfolioUpdate = async (data: {
    portfolioName: string;
    visibility: "public" | "private";
  }) => {
    setIsUpdating(true);

    // Store previous state in case we need to revert
    const previousName = portfolioName;
    const previousVisibility = isPublic;

    // Optimistically update the UI
    setPortfolioName(data.portfolioName);
    setIsPublic(data.visibility === "public");
    setIsSettingsModalOpen(false);

    try {
      const response = await updatePortfolio(portfolioId, {
        portfolioName: data.portfolioName,
        visibility: data.visibility,
      });

      if (response.status !== "success") {
        // Revert to previous state if update failed
        setPortfolioName(previousName);
        setIsPublic(previousVisibility);
        toast.error("Failed to update portfolio settings");
      } else {
        // Refresh data after successful update
        await fetchDataRef.current?.();
      }
    } catch (error) {
      // Revert to previous state on error
      setPortfolioName(previousName);
      setIsPublic(previousVisibility);
      toast.error("Failed to update portfolio settings");
      console.error("Error updating portfolio:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePortfolio = async () => {
    try {
      await deletePortfolio(portfolioId);
      toast.success("Portfolio deleted successfully");
      router.push(`/${params.username}`);
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete portfolio"
      );
    }
  };

  const handlePortfolioNameChange = (name: string) => {
    setPortfolioName(name);
  };

  // Format metrics values properly
  const formatMetricValue = (
    value: number | undefined,
    isPercentage = true,
    decimalPlaces = 2
  ) => {
    if (value === undefined || value === null) return "-";
    const formattedValue = value.toFixed(decimalPlaces);
    return isPercentage
      ? `${value >= 0 ? "+" : ""}${formattedValue}%`
      : formattedValue;
  };

  // Determine trend (positive/negative) based on value
  const getTrend = (value: number | undefined) => {
    if (value === undefined || value === null) return "neutral";
    return value >= 0 ? "positive" : "negative";
  };

  // Only show error if it's a critical error that prevents the page from functioning
  if (error === "Portfolio not found or access denied") {
    router.push(`/${params.username}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#00A852",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF3B30",
              secondary: "#fff",
            },
          },
        }}
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] mb-2">
                {portfolioName || (
                  <div className="h-[40px] w-[180px] bg-gray-100 rounded-lg animate-pulse" />
                )}
              </div>
              <Text className="text-[17px] leading-[22px] text-[#6E6E73]">
                {portfolioData.description}
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddStockModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-[15px] leading-[20px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Stock
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-[15px] leading-[20px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-full ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            label="Ranking"
            value="-"
            subtext="of investors"
            icon={
              <svg
                className="w-5 h-5 text-[#1D1D1F]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <StatCard
            label="Daily Return"
            value={
              isMetricsLoading
                ? "-"
                : `${metrics?.dailyReturn >= 0 ? "+" : ""}${metrics?.dailyReturn.toFixed(2)}%`
            }
            trend={
              isMetricsLoading
                ? "neutral"
                : metrics?.dailyReturn >= 0
                  ? "positive"
                  : "negative"
            }
            icon={
              <svg
                className={`w-5 h-5 ${isMetricsLoading ? "text-[#1D1D1F]" : metrics?.dailyReturn >= 0 ? "text-[#00A852]" : "text-[#FF3B30]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={
                    isMetricsLoading || metrics?.dailyReturn >= 0
                      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
            }
          />
          <StatCard
            label="Monthly Return"
            value={
              isMetricsLoading
                ? "-"
                : `${metrics?.monthlyReturn >= 0 ? "+" : ""}${metrics?.monthlyReturn.toFixed(2)}%`
            }
            trend={
              isMetricsLoading
                ? "neutral"
                : metrics?.monthlyReturn >= 0
                  ? "positive"
                  : "negative"
            }
            icon={
              <svg
                className={`w-5 h-5 ${isMetricsLoading ? "text-[#1D1D1F]" : metrics?.monthlyReturn >= 0 ? "text-[#00A852]" : "text-[#FF3B30]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={
                    isMetricsLoading || metrics?.monthlyReturn >= 0
                      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
            }
          />
          <StatCard
            label="Total Return"
            value={
              isMetricsLoading
                ? "-"
                : `${metrics?.totalReturn >= 0 ? "+" : ""}${metrics?.totalReturn.toFixed(2)}%`
            }
            trend={
              isMetricsLoading
                ? "neutral"
                : metrics?.totalReturn >= 0
                  ? "positive"
                  : "negative"
            }
            icon={
              <svg
                className={`w-5 h-5 ${isMetricsLoading ? "text-[#1D1D1F]" : metrics?.totalReturn >= 0 ? "text-[#00A852]" : "text-[#FF3B30]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={
                    isMetricsLoading || metrics?.totalReturn >= 0
                      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
            }
          />
        </motion.div>

        {/* Portfolio Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-6 bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
            <PortfolioChart />
          </Card>
        </motion.div>

        {/* Risk Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mb-12"
        >
          <Card className="overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
            <div className="p-6 border-b border-black/[0.04]">
              <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                Risk Metrics
              </Text>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                  <Text className="text-[15px] leading-[20px] text-[#6E6E73] mb-2">
                    Beta (vs S&P 500)
                  </Text>
                  <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                    {isMetricsLoading ? "-" : metrics?.beta.toFixed(2)}
                  </Text>
                </div>
                <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                  <Text className="text-[15px] leading-[20px] text-[#6E6E73] mb-2">
                    Sharpe Ratio
                  </Text>
                  <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                    {isMetricsLoading ? "-" : metrics?.sharpeRatio.toFixed(2)}
                  </Text>
                </div>
                <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                  <Text className="text-[15px] leading-[20px] text-[#6E6E73] mb-2">
                    Volatility
                  </Text>
                  <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                    {isMetricsLoading
                      ? "-"
                      : `${metrics?.volatility.toFixed(1)}%`}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Holdings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm">
            <div className="p-6 border-b border-black/[0.04]">
              <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                Holdings
              </Text>
            </div>
            <div className="p-6">
              {isLoadingHoldings ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : holdings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#6E6E73]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F] mb-2">
                    No Stocks Yet
                  </Text>
                  <Text className="text-[15px] leading-[20px] text-[#6E6E73] mb-6">
                    Start building your portfolio by adding some stocks
                  </Text>
                  <button
                    onClick={() => setIsAddStockModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[15px] leading-[20px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Your First Stock
                  </button>
                </div>
              ) : (
                <ManageableActivityTable
                  data={holdings}
                  onChange={(changes) => {
                    if ("quantity" in changes) {
                      handleStockOperation({
                        type: changes.quantity === 0 ? "delete" : "update",
                        symbol: changes.symbol,
                        shares: changes.quantity,
                      });
                    }
                  }}
                  onShare={() => {}} // Empty handler to satisfy the interface
                  portfolioName={portfolioName}
                  onPortfolioNameChange={handlePortfolioNameChange}
                  portfolioId={portfolioId}
                />
              )}
            </div>
          </Card>
        </motion.div>

        {/* Modals */}
        <AddStockModal
          isOpen={isAddStockModalOpen}
          onClose={() => setIsAddStockModalOpen(false)}
          onAddStock={(stock) =>
            handleStockOperation({
              type: "add",
              symbol: stock.symbol,
              shares: stock.quantity,
            })
          }
          portfolioId={portfolioId}
        />
        <ShareActionModal
          isOpen={isShareActionModalOpen}
          onClose={() => setIsShareActionModalOpen(false)}
          action={selectedAction}
        />
        <PortfolioSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onDelete={handleDeletePortfolio}
          onSubmit={handlePortfolioUpdate}
          initialData={{
            portfolioName: portfolioName,
            visibility: isPublic ? "public" : "private",
          }}
        />
      </div>
    </div>
  );
}
