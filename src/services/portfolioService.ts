const API_URL = "http://localhost:8080";

export interface PortfolioDTO {
  portfolioName: string;
  visibility: "public" | "private";
}

export async function createPortfolio(portfolio: PortfolioDTO): Promise<any> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
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

    return response.json();
  } catch (error) {
    console.error("Error creating portfolio:", error);
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${API_URL}/api/portfolio/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(portfolio),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update portfolio");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating portfolio:", error);
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(
      `${API_URL}/api/portfolio/list-by-username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

export async function addStockToPortfolio(
  portfolioId: number,
  tickerName: string,
  quantity: number
): Promise<AddStockResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
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
      throw new Error(text || "Failed to add stock to portfolio");
    }

    // If successful, return a default success response since the endpoint doesn't return data
    return {
      status: "success",
      message: "Stock added successfully",
    };
  } catch (error) {
    console.error("Error adding stock to portfolio:", error);
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(
      `${API_URL}/api/portfolio/stock/metric/${portfolioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
  quantity: number
): Promise<UpdateStockQuantityResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
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
      const text = await response.text();
      throw new Error(text || "Failed to update stock quantity");
    }

    return {
      status: "success",
      message: "Stock quantity updated successfully",
    };
  } catch (error) {
    console.error("Error updating stock quantity:", error);
    throw error;
  }
}

export interface DeleteStockResponse {
  status: string;
  message: string;
}

export async function deleteStockFromPortfolio(
  portfolioId: number,
  tickerName: string
): Promise<DeleteStockResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
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
      const text = await response.text();
      throw new Error(text || "Failed to delete stock from portfolio");
    }

    return {
      status: "success",
      message: "Stock deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting stock from portfolio:", error);
    throw error;
  }
}
