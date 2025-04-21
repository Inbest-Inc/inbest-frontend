import { toast } from "react-hot-toast";
import { getApiUrl } from "@/config/env";

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
    toast.success("Portfolio created successfully", { id: loadingToast });
    return result;
  } catch (error) {
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
  data?: any;
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

    const response = await fetch(
      `${API_URL}/api/portfolio-stock/add?portfolioId=${portfolioId}&tickerName=${tickerName}&quantity=${quantity}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Couldn't add stock to portfolio");
    }

    // Call the refresh callback before showing success message
    if (onSuccess) {
      await onSuccess();
    }

    toast.success(`Added ${quantity} shares of ${tickerName} to portfolio`, {
      id: loadingToast,
    });
    return {
      status: "success",
      message: "Stock added successfully",
    };
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Couldn't add stock to portfolio",
      { id: loadingToast }
    );
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

    const response = await fetch(
      `${API_URL}/api/portfolio-stock/update/quantity?portfolioId=${portfolioId}&tickerName=${tickerName}&quantity=${quantity}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Couldn't update shares quantity");
    }

    const data = await response.json();

    if (onSuccess) {
      await onSuccess();
    }

    toast.success(`Updated ${tickerName} to ${quantity} shares`, {
      id: loadingToast,
    });
    return data;
  } catch (error) {
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
      throw new Error("Couldn't delete stock from portfolio");
    }

    const data = await response.json();

    // Call the refresh callback before showing success message
    if (onSuccess) {
      await onSuccess();
    }

    toast.success(`Deleted ${tickerName} from portfolio`, { id: loadingToast });
    return data;
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Couldn't delete stock from portfolio",
      { id: loadingToast }
    );
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
  name: string;
  surname: string;
}

export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface UserInfoResponse {
  name: string;
}

export async function getUserInfo(username: string): Promise<UserInfoResponse> {
  try {
    const response = await fetch(`${API_URL}/api/user/${username}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
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
