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
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { getUserInfo } from "@/services/userService";
import Avatar from "@/components/Avatar";
import Tooltip from "@/components/Tooltip";
import InfoTooltip, { metricExplanations } from "@/components/InfoTooltip";
import { getStockLogo } from "@/utils/stockUtils";

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
      logo: getStockLogo("AAPL"),
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      shares: 100,
      allocation: 20.3,
      averagePrice: 285.12,
      currentPrice: 312.45,
      return: 9.59,
      logo: getStockLogo("MSFT"),
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      shares: 80,
      allocation: 18.2,
      averagePrice: 420.5,
      currentPrice: 485.75,
      return: 15.52,
      logo: getStockLogo("NVDA"),
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 60,
      allocation: 15.8,
      averagePrice: 138.45,
      currentPrice: 125.3,
      return: -9.49,
      logo: getStockLogo("GOOGL"),
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      shares: 45,
      allocation: 12.4,
      averagePrice: 280.15,
      currentPrice: 315.2,
      return: 12.51,
      logo: getStockLogo("META"),
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      shares: 30,
      allocation: 7.8,
      averagePrice: 265.25,
      currentPrice: 202.8,
      return: -23.54,
      logo: getStockLogo("TSLA"),
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
  const [userInfo, setUserInfo] = useState({ name: "User" });
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Keep track of the fetch function reference
  const fetchDataRef = useRef<(() => Promise<void>) | null>(null);

  // Add a refreshHoldings function
  const refreshHoldings = async () => {
    try {
      setIsLoadingHoldings(true);
      const holdingsResponse = await getPortfolioHoldings(portfolioId);
      if (holdingsResponse.status === "success") {
        setHoldings(holdingsResponse.data.holdings || []);
      }
    } catch (error: any) {
      // Silently handle "No stocks" case
      setHoldings([]);
      // Only log other errors
      if (
        !error.message?.includes("No stocks") &&
        !error.message?.includes("404")
      ) {
        console.error("Error fetching holdings:", error);
      }
    } finally {
      setIsLoadingHoldings(false);
    }
  };

  // Update the handleStockOperation function to directly refresh holdings
  const handleStockOperation = async (operation: StockOperation) => {
    if (!operation?.symbol || typeof operation?.shares !== "number") {
      return;
    }

    // Set operation in progress flag
    setIsOperationInProgress(true);

    try {
      let response;
      let refreshRequired = true; // By default, we'll refresh unless handled specially

      switch (operation.type) {
        case "add":
          response = await addStockToPortfolio(
            portfolioId,
            operation.symbol,
            operation.shares
          );
          console.log("Add stock operation complete response:", response);

          if (response?.status === "success") {
            setIsAddStockModalOpen(false);

            // CRITICAL - Inspect the full response structure
            console.log(
              "Add stock response structure:",
              JSON.stringify(response, null, 2)
            );

            // Try to find activityId at different levels of the response
            const activityId =
              response.data?.activityId ||
              (response as any).activityId ||
              (response.data?.data && response.data.data.activityId);

            if (activityId) {
              console.log("Found activityId:", activityId);

              // Check if we have full stock data in the response
              let stockName = operation.symbol;
              if (response.data && response.data.stockName) {
                stockName = response.data.stockName;
              }

              // Use the complete response data if available
              if (response.data && response.data.stockSymbol) {
                console.log("Using complete response data for share action");
                setSelectedAction(response.data);
              } else {
                // Fallback to constructing our own object
                const shareData = {
                  activityId: activityId,
                  portfolioId: portfolioId,
                  stockSymbol: operation.symbol,
                  stockName: stockName,
                  actionType: "OPEN", // Use standardized "OPEN" for new positions
                  stockQuantity: operation.shares,
                  old_position_weight: 0,
                  new_position_weight: 0,
                };

                console.log(
                  "Setting share action with constructed data:",
                  shareData
                );
                setSelectedAction(shareData);
              }
              setIsShareActionModalOpen(true);
            } else {
              console.log("No activityId found in response, creating one");
              // For the case when API didn't return an activityId

              // Check if we have full stock data in the response
              let stockName = operation.symbol;
              if (response.data && response.data.stockName) {
                stockName = response.data.stockName;
              }

              // Force the share dialog with a temporary ID if needed
              const tempAction = {
                activityId: 123456, // Fixed ID instead of Date.now()
                portfolioId: portfolioId,
                stockSymbol: operation.symbol,
                stockName: stockName,
                actionType: "OPEN", // Use standardized "OPEN" for new positions
                stockQuantity: operation.shares,
                old_position_weight: 0,
                new_position_weight: 0,
              };

              console.log("Using temp action with fallback data:", tempAction);
              setSelectedAction(tempAction);
              setIsShareActionModalOpen(true);
            }

            // After handling share action, refresh the holdings
            await refreshHoldings();
            refreshRequired = false; // We've already refreshed
          }
          break;
        case "update":
          response = await updateStockQuantity(
            portfolioId,
            operation.symbol,
            operation.shares
          );

          console.log(
            "Update stock response for sharing:",
            JSON.stringify(response, null, 2)
          );

          // If it's an update with activity data, show share modal
          if (response?.status === "success" && response.data) {
            // Direct access to activityId from the response
            if (response.data.activityId) {
              console.log(
                "Found activityId in update response:",
                response.data.activityId
              );

              // Special handling for CLOSE actions (when quantity is reduced to 0)
              if (
                response.data.actionType === "CLOSE" ||
                (response.data.actionType === "SELL" &&
                  (response.data.stockQuantity === 0 ||
                    response.data.new_position_weight === 0))
              ) {
                console.log(
                  "CLOSE/SELL-to-zero action detected, preserving original activity ID"
                );

                // Make sure we have the actual activityId for CLOSE operations
                if (!response.data.activityId) {
                  console.error(
                    "Missing activityId for CLOSE operation:",
                    response.data
                  );
                  toast.error(
                    "Unable to share this activity due to missing data. Please try again."
                  );

                  // Still refresh the holdings
                  await refreshHoldings();
                  refreshRequired = false; // We've already refreshed
                  return;
                }

                // Never use temporary IDs for CLOSE operations
                if (response.data.activityId === 123456) {
                  console.error("Cannot use temporary ID for CLOSE operation");
                  toast.error(
                    "Unable to share this activity. Please refresh and try again."
                  );

                  // Still refresh the holdings
                  await refreshHoldings();
                  refreshRequired = false; // We've already refreshed
                  return;
                }
              }

              // Always pass the complete response data to ensure all fields are available
              setSelectedAction(response.data);
              setIsShareActionModalOpen(true);

              // After handling share action, refresh the holdings
              await refreshHoldings();
              refreshRequired = false; // We've already refreshed
            }
          }
          break;
        case "delete":
          response = await deleteStockFromPortfolio(
            portfolioId,
            operation.symbol
          );

          // For CLOSE actions, we need to manually construct the data for sharing
          // since the delete API doesn't return activity details
          console.log(
            "Delete stock response for sharing:",
            JSON.stringify(response, null, 2)
          );

          // If the deletion was successful, construct a sharing object
          if (response?.status === "success") {
            console.log("Processing delete/CLOSE response for sharing");

            // Since the delete API doesn't provide an activityId, we need to
            // prompt the user to try using the update API with 0 shares instead
            toast.success(
              "To share that you closed this position, please reduce shares to 0 instead of deleting.",
              { duration: 5000 }
            );
          }
          break;
      }

      // After any operation, refresh the holdings if needed
      if (refreshRequired) {
        await refreshHoldings();
      }
    } catch (error) {
      console.error("Error during stock operation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update portfolio"
      );
    } finally {
      setIsOperationInProgress(false);
    }
  };

  // Update the useEffect to store the refreshHoldings function in the fetchDataRef
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

        const portfolioResponse = await getPortfolio(
          portfolioId,
          params.username as string
        );
        if (!isSubscribed) return;

        if (portfolioResponse.status !== "success") {
          console.error("Portfolio access error:", portfolioResponse.message);
          push(`/${params.username}`);
          return;
        }

        // Update portfolio data
        setPortfolioName(portfolioResponse.data.portfolioName);
        setIsPublic(portfolioResponse.data.visibility === "public");

        // Fetch user info
        try {
          setIsUserInfoLoading(true);
          const userResponse = await getUserInfo(params.username as string);
          if (!isSubscribed) return;

          if (userResponse.fullName) {
            setUserInfo({ name: userResponse.fullName });
          }

          // Check if profile photo URL is provided
          if (userResponse.imageUrl) {
            // Add timestamp to force cache refresh
            const timestamp = new Date().getTime();
            const imageUrl = userResponse.imageUrl;
            const cachedPhotoUrl = imageUrl.includes("?")
              ? `${imageUrl}&t=${timestamp}`
              : `${imageUrl}?t=${timestamp}`;

            setProfilePhoto(cachedPhotoUrl);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          if (isSubscribed) {
            setIsUserInfoLoading(false);
          }
        }

        // Fetch holdings data
        try {
          await refreshHoldings();
        } catch (error) {
          if (!isSubscribed) return;
          console.error("Error refreshing holdings:", error);
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
        // Redirect to user page on any portfolio access error
        push(`/${params.username}`);
        return;
      } finally {
        if (isSubscribed) {
          setIsLoadingHoldings(false);
        }
      }
    };

    // Store the fetch function reference
    fetchDataRef.current = refreshHoldings;
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
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                {!isUserInfoLoading && (
                  <Avatar src={profilePhoto} name={userInfo.name} size="lg" />
                )}
              </div>
              <div>
                {!isUserInfoLoading ? (
                  <>
                    <div>
                      <Text className="text-[34px] leading-[40px] font-semibold text-[#1D1D1F] mb-2">
                        {portfolioName || (
                          <div className="h-[40px] w-[180px] bg-gray-100 rounded-lg animate-pulse" />
                        )}
                      </Text>
                      <div className="flex items-center gap-2 mb-2">
                        <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                          {userInfo.name}
                        </Text>
                        <span className="text-[#6E6E73]">•</span>
                        <Link
                          href={`/${params.username}`}
                          className="text-[17px] leading-[22px] text-[#6E6E73] hover:text-blue-600 transition-colors"
                        >
                          @{params.username}
                        </Link>
                      </div>
                      <div className="text-[15px] leading-[20px] text-[#6E6E73]">
                        {isPublic !== undefined && (
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              {isPublic ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                              )}
                            </svg>
                            {isPublic
                              ? "Public portfolio"
                              : "Private portfolio"}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-10 w-48 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="h-5 w-40 bg-gray-200 rounded-lg"></div>
                  </div>
                )}
              </div>
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
              <Link
                href={`/${params.username}/${params.portfolio}`}
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Portfolio
              </Link>
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

        {/* Holdings Table - Moved to top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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
                  onChange={async (changes) => {
                    // Only process when quantity changes
                    if ("quantity" in changes) {
                      // For changes coming from the component itself, the share modal
                      // may have already been triggered via the API response in handleQuantityUpdate
                      console.log("Quantity change detected:", changes);

                      // Special case: If we have a deleteAfterUpdate flag, handle it specifically
                      if (changes.deleteAfterUpdate) {
                        console.log("Handling deletion after update to zero");

                        // Only delete if we aren't already processing the stock
                        if (!isOperationInProgress) {
                          try {
                            setIsOperationInProgress(true);

                            // Small delay to ensure update has been processed
                            await new Promise((resolve) =>
                              setTimeout(resolve, 300)
                            );

                            // Now delete the stock
                            await deleteStockFromPortfolio(
                              portfolioId,
                              changes.symbol,
                              undefined, // No callback
                              true // Silent mode - no toast
                            );

                            // Refresh the holdings
                            await refreshHoldings();
                          } catch (error) {
                            console.error(
                              "Error during post-update deletion:",
                              error
                            );
                          } finally {
                            setIsOperationInProgress(false);
                          }
                        }
                        return;
                      }

                      // If API call was already made in the component, just refresh data
                      if (changes.apiCallComplete) {
                        refreshHoldings();
                        return;
                      }

                      // Otherwise handle the stock operation normally
                      handleStockOperation({
                        type: changes.quantity === 0 ? "delete" : "update",
                        symbol: changes.symbol,
                        shares: changes.quantity,
                      });
                    }
                  }}
                  onShare={(action) => {
                    console.log("Share action triggered:", action);
                    setSelectedAction(action);
                    setIsShareActionModalOpen(true);
                  }}
                  portfolioName={portfolioName}
                  onPortfolioNameChange={handlePortfolioNameChange}
                  portfolioId={portfolioId}
                />
              )}
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          style={{ display: "none" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            label={
              <span className="flex items-center gap-1">
                <span>Hourly Return</span>
                <InfoTooltip content={metricExplanations.hourlyReturn} />
              </span>
            }
            value={
              isMetricsLoading ? (
                "-"
              ) : (
                <Tooltip
                  content={`${metrics?.hourlyReturn < 1 && metrics?.hourlyReturn > -1 ? metrics?.hourlyReturn * 100 : metrics?.hourlyReturn}%`}
                >
                  <span>
                    {metrics?.hourlyReturn >= 0 ? "+" : ""}
                    {(metrics?.hourlyReturn < 1 && metrics?.hourlyReturn > -1
                      ? metrics?.hourlyReturn * 100
                      : metrics?.hourlyReturn
                    ).toFixed(2)}
                    %
                  </span>
                </Tooltip>
              )
            }
            trend={
              isMetricsLoading
                ? "neutral"
                : metrics?.hourlyReturn >= 0
                  ? "positive"
                  : "negative"
            }
            icon={
              <svg
                className={`w-5 h-5 ${isMetricsLoading ? "text-[#1D1D1F]" : metrics?.hourlyReturn >= 0 ? "text-[#00A852]" : "text-[#FF3B30]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={
                    isMetricsLoading || metrics?.hourlyReturn >= 0
                      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
            }
          />
          <StatCard
            label={
              <span className="flex items-center gap-1">
                <span>Daily Return</span>
                <InfoTooltip content={metricExplanations.dailyReturn} />
              </span>
            }
            value={
              isMetricsLoading ? (
                "-"
              ) : (
                <Tooltip
                  content={`${metrics?.dailyReturn < 1 && metrics?.dailyReturn > -1 ? metrics?.dailyReturn * 100 : metrics?.dailyReturn}%`}
                >
                  <span>
                    {metrics?.dailyReturn >= 0 ? "+" : ""}
                    {(metrics?.dailyReturn < 1 && metrics?.dailyReturn > -1
                      ? metrics?.dailyReturn * 100
                      : metrics?.dailyReturn
                    ).toFixed(2)}
                    %
                  </span>
                </Tooltip>
              )
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
            label={
              <span className="flex items-center gap-1">
                <span>Monthly Return</span>
                <InfoTooltip content={metricExplanations.monthlyReturn} />
              </span>
            }
            value={
              isMetricsLoading ? (
                "-"
              ) : (
                <Tooltip
                  content={`${metrics?.monthlyReturn < 1 && metrics?.monthlyReturn > -1 ? metrics?.monthlyReturn * 100 : metrics?.monthlyReturn}%`}
                >
                  <span>
                    {metrics?.monthlyReturn >= 0 ? "+" : ""}
                    {(metrics?.monthlyReturn < 1 && metrics?.monthlyReturn > -1
                      ? metrics?.monthlyReturn * 100
                      : metrics?.monthlyReturn
                    ).toFixed(2)}
                    %
                  </span>
                </Tooltip>
              )
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
            label={
              <span className="flex items-center gap-1">
                <span>Total Return</span>
                <InfoTooltip content={metricExplanations.totalReturn} />
              </span>
            }
            value={
              isMetricsLoading ? (
                "-"
              ) : (
                <Tooltip
                  content={`${metrics?.totalReturn < 1 && metrics?.totalReturn > -1 ? metrics?.totalReturn * 100 : metrics?.totalReturn}%`}
                >
                  <span>
                    {metrics?.totalReturn >= 0 ? "+" : ""}
                    {(metrics?.totalReturn < 1 && metrics?.totalReturn > -1
                      ? metrics?.totalReturn * 100
                      : metrics?.totalReturn
                    ).toFixed(2)}
                    %
                  </span>
                </Tooltip>
              )
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

        {/* Risk Metrics */}
        <motion.div
          style={{ display: "none" }}
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
                  <Text className="text-[15px] leading-[20px] text-[#6E6E73] mb-2 flex items-center gap-1">
                    <span>Beta (vs S&P 500)</span>
                    <InfoTooltip content={metricExplanations.beta} />
                  </Text>
                  <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                    {isMetricsLoading ? (
                      "-"
                    ) : (
                      <Tooltip content={`${metrics?.beta}`}>
                        <span>{metrics?.beta.toFixed(2)}</span>
                      </Tooltip>
                    )}
                  </Text>
                </div>
                <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                  <Text className="text-[15px] leading-[20px] text-[#6E6E73] mb-2 flex items-center gap-1">
                    <span>Sharpe Ratio</span>
                    <InfoTooltip content={metricExplanations.sharpeRatio} />
                  </Text>
                  <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                    {isMetricsLoading ? (
                      "-"
                    ) : (
                      <Tooltip content={`${metrics?.sharpeRatio}`}>
                        <span>{metrics?.sharpeRatio.toFixed(2)}</span>
                      </Tooltip>
                    )}
                  </Text>
                </div>
                <div className="p-4 rounded-xl bg-white/40 backdrop-blur-sm ring-1 ring-black/[0.04]">
                  <Text className="text-[15px] leading-[20px] text-[#6E6E73] mb-2 flex items-center gap-1">
                    <span>Volatility</span>
                    <InfoTooltip content={metricExplanations.volatility} />
                  </Text>
                  <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                    {isMetricsLoading ? (
                      "-"
                    ) : (
                      <Tooltip
                        content={`${metrics?.volatility < 1 ? metrics?.volatility * 100 : metrics?.volatility}%`}
                      >
                        <span>
                          {(metrics?.volatility < 1
                            ? metrics?.volatility * 100
                            : metrics?.volatility
                          ).toFixed(2)}
                          %
                        </span>
                      </Tooltip>
                    )}
                  </Text>
                </div>
              </div>
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
