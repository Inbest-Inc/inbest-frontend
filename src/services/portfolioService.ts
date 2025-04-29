import { toast } from "react-hot-toast";
import { getApiUrl } from "@/config/env";
import { getUserInfo } from "@/services/userService";

const API_URL = getApiUrl();

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  toast.error(message);
  throw error;
};

// Helper function to show loading toast
const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    style: {
      background: "#1D1D1F",
      color: "#fff",
      borderRadius: "12px",
    },
  });
};

export interface PortfolioDTO {
  portfolioName: string;
  visibility: string;
}

export async function createPortfolio(portfolio: PortfolioDTO): Promise<any> {
  const loadingToast = showLoadingToast("Creating portfolio...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/portfolio/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(portfolio),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create portfolio");
    }

    const result = await response.json();
    console.log("API response for portfolio creation:", result);
    toast.success("Portfolio created successfully", { id: loadingToast });
    return result;
  } catch (error) {
    console.error("Error in createPortfolio service:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to create portfolio",
      { id: loadingToast }
    );
    throw error;
  }
}

interface UpdatePortfolioResponse {
  status: string;
  message: string;
  data: {
    portfolioId: number;
    portfolioName: string;
    visibility: "public" | "private";
    createdDate: string;
    lastUpdatedDate: string;
    userId: number;
  };
}

export async function updatePortfolio(
  id: number,
  portfolio: PortfolioDTO
): Promise<UpdatePortfolioResponse> {
  const loadingToast = showLoadingToast("Saving portfolio settings...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/portfolio/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(portfolio),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Couldn't save portfolio settings");
    }

    const data = await response.json();
    toast.success("Portfolio settings saved", { id: loadingToast });
    return data;
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Couldn't save portfolio settings",
      { id: loadingToast }
    );
    throw error;
  }
}

interface DeletePortfolioResponse {
  status: string;
  message: string;
}

export async function deletePortfolio(
  id: number
): Promise<DeletePortfolioResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/portfolio/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete portfolio");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    throw error;
  }
}

interface PortfolioResponse {
  status: string;
  message: string;
  data: {
    portfolioId: number;
    portfolioName: string;
    createdDate: string;
    lastUpdatedDate: string;
    visibility: "public" | "private";
    userId: number;
  };
}

export async function getPortfolio(id: number): Promise<PortfolioResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/portfolio/get?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Portfolio not found or access denied");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
  }
}

interface PortfolioListResponse {
  status: string;
  message: string;
  data: Array<{
    portfolioId: number;
    portfolioName: string;
    createdDate: string;
    lastUpdatedDate: string;
    visibility: "public" | "private";
    userId: number;
  }>;
}

export async function getPortfoliosByUsername(
  username: string
): Promise<PortfolioListResponse> {
  try {
    const response = await fetch(
      `${API_URL}/api/portfolio/list-by-username/${username}`,
      {
        headers: {
          // Only add Authorization header if token exists
          ...(localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch portfolios");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error;
  }
}

interface AddStockResponse {
  status: string;
  message: string;
  data?: {
    activityId?: number;
    holdings?: any[];
    [key: string]: any;
  };
}

// Add a new type for the refresh callback
type RefreshCallback = () => Promise<void>;

export async function addStockToPortfolio(
  portfolioId: number,
  tickerName: string,
  quantity: number,
  onSuccess?: RefreshCallback
): Promise<AddStockResponse> {
  const loadingToast = showLoadingToast(
    `Adding ${tickerName} to your portfolio...`
  );

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Ensure quantity is properly formatted with up to 2 decimal places for API
    const formattedQuantity = Math.round(quantity * 100) / 100;

    console.log(
      `Adding stock ${tickerName} with quantity ${formattedQuantity} to portfolio ${portfolioId}`
    );

    const response = await fetch(
      `${API_URL}/api/portfolio-stock/add?portfolioId=${portfolioId}&tickerName=${tickerName}&quantity=${formattedQuantity}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // Read response as text first
      const textResponse = await response.text();

      // Try to parse it as JSON, but handle the case where it's not valid JSON
      let errorMessage = "Couldn't add stock to portfolio";

      try {
        // Attempt to parse as JSON
        const jsonResponse = JSON.parse(textResponse);
        if (jsonResponse.message) {
          // For already added stocks, use our custom friendly message
          if (jsonResponse.message.includes("already added")) {
            errorMessage = `${tickerName} is already in your portfolio`;
          } else {
            // For other errors, use the API's message
            errorMessage = jsonResponse.message;
          }
        }
      } catch (parseError) {
        // If not JSON, use the text response if it's not empty
        if (textResponse && textResponse.trim()) {
          errorMessage = textResponse;
        }
      }

      // Display the error toast and then throw to exit the function
      toast.error(errorMessage, { id: loadingToast });
      return {
        status: "error",
        message: errorMessage,
      };
    }

    // Parse the response to get all data including activityId
    const data = await response.json();
    console.log("Add stock complete response:", JSON.stringify(data));

    // Directly log the important fields to look for activityId
    console.log("Response data fields:", Object.keys(data));
    if (data.data) {
      console.log("Response data.data fields:", Object.keys(data.data));
    }
    console.log(
      "Looking for activityId:",
      data.activityId,
      data.data?.activityId
    );

    // Call the refresh callback before showing success message
    if (onSuccess) {
      await onSuccess();
    }

    toast.success(
      `Added ${formattedQuantity} shares of ${tickerName} to portfolio`,
      {
        id: loadingToast,
      }
    );

    return {
      status: "success",
      message: "Stock added successfully",
      data: data, // Return the full response data, not just data.data
    };
  } catch (error) {
    // Only display error toast if it hasn't been displayed yet
    // This is to avoid duplicate toasts for the same error
    if (
      error instanceof Error &&
      !error.message.includes("already in your portfolio")
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't add stock to portfolio",
        { id: loadingToast }
      );
    }
    throw error;
  }
}

interface StockTickerResponse {
  stock_name: string;
  ticker_symbol: string;
}

export async function getStockTickers(): Promise<StockTickerResponse[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/stock/tickers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stock tickers");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stock tickers:", error);
    throw error;
  }
}

interface PortfolioHolding {
  shares: number;
  symbol: string;
  name: string;
  currentprice: number;
  allocation: number;
  return: number;
  stock_id: number;
  averageprice: number;
}

interface PortfolioHoldingsResponse {
  status: string;
  message: string;
  data: {
    holdings: PortfolioHolding[];
  };
}

export async function getPortfolioHoldings(
  portfolioId: number
): Promise<PortfolioHoldingsResponse> {
  try {
    const response = await fetch(
      `${API_URL}/api/portfolio/stock/metric/${portfolioId}`,
      {
        headers: {
          // Only add Authorization header if token exists
          ...(localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch portfolio holdings");
    }

    const data = await response.json();

    // Transform the data to ensure proper number formatting and property names
    if (data.holdings) {
      data.holdings = data.holdings.map((holding: PortfolioHolding) => ({
        ...holding,
        currentPrice: Number(holding.currentprice.toFixed(2)),
        averagePrice: Number(holding.averageprice.toFixed(2)),
        allocation: Number((holding.allocation * 100).toFixed(2)), // Convert to percentage
        return: Number((holding.return * 100).toFixed(2)), // Convert to percentage
        logo: `https://assets.parqet.com/logos/symbol/${holding.symbol}?format=svg`, // Add logo URL
        // Remove the lowercase properties
        currentprice: undefined,
        averageprice: undefined,
      }));
    }

    return {
      status: "success",
      message: "Holdings fetched successfully",
      data: {
        holdings: data.holdings || [],
      },
    };
  } catch (error) {
    console.error("Error fetching portfolio holdings:", error);
    throw error;
  }
}

export interface UpdateStockQuantityResponse {
  status: string;
  message: string;
  data?: {
    activityId?: number;
    portfolioId?: number;
    stockId?: number;
    stockSymbol?: string;
    stockName?: string;
    actionType?: string;
    stockQuantity?: number;
    date?: string;
    old_position_weight?: number;
    new_position_weight?: number;
    [key: string]: any;
  };
}

export async function updateStockQuantity(
  portfolioId: number,
  tickerName: string,
  quantity: number,
  onSuccess?: RefreshCallback
): Promise<UpdateStockQuantityResponse> {
  const loadingToast = showLoadingToast(`Updating ${tickerName} shares...`);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Ensure quantity is properly formatted with up to 2 decimal places for API
    const formattedQuantity = Math.round(quantity * 100) / 100;

    console.log(
      `Updating stock ${tickerName} with quantity ${formattedQuantity} in portfolio ${portfolioId}`
    );

    const response = await fetch(
      `${API_URL}/api/portfolio-stock/update/quantity?portfolioId=${portfolioId}&tickerName=${tickerName}&quantity=${formattedQuantity}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // Read response as text first
      const textResponse = await response.text();

      // Try to parse it as JSON, but handle the case where it's not valid JSON
      let errorMessage = "Couldn't update shares quantity";

      try {
        // Attempt to parse as JSON
        const jsonResponse = JSON.parse(textResponse);
        if (jsonResponse.message) {
          errorMessage = jsonResponse.message;
        }
      } catch (parseError) {
        // If not JSON, use the text response if it's not empty
        if (textResponse && textResponse.trim()) {
          errorMessage = textResponse;
        }
      }

      // Display the error toast and return an error response
      toast.error(errorMessage, { id: loadingToast });
      return {
        status: "error",
        message: errorMessage,
      };
    }

    // Parse the complete response
    const data = await response.json();
    console.log("Update stock complete response:", JSON.stringify(data));

    // Directly log the important fields to look for activityId
    console.log("Response data fields:", Object.keys(data));
    if (data.data) {
      console.log("Response data.data fields:", Object.keys(data.data));
    }
    console.log(
      "Looking for activityId:",
      data.activityId,
      data.data?.activityId
    );

    if (onSuccess) {
      await onSuccess();
    }

    toast.success(`Updated ${tickerName} to ${formattedQuantity} shares`, {
      id: loadingToast,
    });

    return {
      status: "success",
      message: "Stock quantity updated successfully",
      data: data, // Return the full response data, not just data.data
    };
  } catch (error) {
    // Only display error toast if it hasn't been displayed yet by the code above
    toast.error(
      error instanceof Error
        ? error.message
        : "Couldn't update shares quantity",
      { id: loadingToast }
    );
    throw error;
  }
}

export interface DeleteStockResponse {
  status: string;
  message: string;
}

export async function deleteStockFromPortfolio(
  portfolioId: number,
  tickerName: string,
  onSuccess?: RefreshCallback
): Promise<DeleteStockResponse> {
  const loadingToast = showLoadingToast(
    `Deleting ${tickerName} from portfolio...`
  );

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/api/portfolio-stock/delete?portfolioId=${portfolioId}&tickerName=${tickerName}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // Read response as text first
      const textResponse = await response.text();

      // Try to parse it as JSON, but handle the case where it's not valid JSON
      let errorMessage = "Couldn't delete stock from portfolio";

      try {
        // Attempt to parse as JSON
        const jsonResponse = JSON.parse(textResponse);
        if (jsonResponse.message) {
          // For "not found" errors, use custom friendly message
          if (jsonResponse.message.includes("not found")) {
            errorMessage = `${tickerName} is not in your portfolio`;
          } else {
            // For other errors, use the API's message
            errorMessage = jsonResponse.message;
          }
        }
      } catch (parseError) {
        // If not JSON, use the text response if it's not empty
        if (textResponse && textResponse.trim()) {
          errorMessage = textResponse;
        }
      }

      // Display the error toast and return an error response
      toast.error(errorMessage, { id: loadingToast });
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();

    // Call the refresh callback before showing success message
    if (onSuccess) {
      await onSuccess();
    }

    toast.success(`Deleted ${tickerName} from portfolio`, { id: loadingToast });
    return data;
  } catch (error) {
    // Only display error toast if it hasn't been displayed yet by the code above
    if (
      error instanceof Error &&
      !error.message.includes("not in your portfolio")
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't delete stock from portfolio",
        { id: loadingToast }
      );
    }
    throw error;
  }
}

export interface AuthenticationResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  surname: string;
}

export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface PortfolioMetricsResponse {
  status: string;
  message: string;
  data: {
    portfolioId: number;
    hourlyReturn: number;
    dailyReturn: number;
    monthlyReturn: number;
    totalReturn: number;
    beta: number;
    sharpeRatio: number;
    volatility: number;
    riskScore: number;
    riskCategory: string;
  };
}

export async function getPortfolioMetrics(
  portfolioId: number
): Promise<PortfolioMetricsResponse> {
  try {
    const response = await fetch(
      `${API_URL}/api/portfolio-metrics/get?portfolioId=${portfolioId}`,
      {
        headers: {
          // Only add Authorization header if token exists
          ...(localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch portfolio metrics");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio metrics:", error);
    throw error;
  }
}

export interface BestPortfolioResponse {
  status: string;
  message: string;
  data: Array<{
    portfolioMetric: {
      portfolioId: number;
      hourlyReturn: number;
      dailyReturn: number;
      monthlyReturn: number;
      totalReturn: number;
      beta: number;
      sharpeRatio: number;
      volatility: number;
      riskScore: number;
      riskCategory: string;
    };
    user: {
      username: string;
      email: string;
      name: string;
      surname: string;
      image_url: string | null;
      followerCount: number;
    };
    bestPortfolioResponseDTO: {
      portfolioName: string;
      visibility: string;
      holdingCount: number;
    };
  }>;
}

export async function getBestPortfoliosByTotalReturn(): Promise<BestPortfolioResponse> {
  try {
    const response = await fetch(`${API_URL}/api/portfolios/best/total-return`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch best portfolios by total return"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching best portfolios by total return:", error);
    throw error;
  }
}

export async function getBestPortfoliosByMonthlyReturn(): Promise<BestPortfolioResponse> {
  try {
    const response = await fetch(
      `${API_URL}/api/portfolios/best/monthly-return`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch best portfolios by monthly return"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching best portfolios by monthly return:", error);
    throw error;
  }
}

export async function getBestPortfoliosByDailyReturn(): Promise<BestPortfolioResponse> {
  try {
    const response = await fetch(`${API_URL}/api/portfolios/best/daily-return`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch best portfolios by daily return"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching best portfolios by daily return:", error);
    throw error;
  }
}
