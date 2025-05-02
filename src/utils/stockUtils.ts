/**
 * Utility functions for stock-related operations
 */

/**
 * Get the URL for a stock logo with built-in fallback support
 *
 * @param symbol The stock ticker symbol
 * @returns The URL for the stock logo
 */
export const getStockLogo = (symbol: string): string => {
  if (!symbol) return "";

  // Use our centralized API endpoint that handles fallback logic
  return `/api/getLogo?ticker=${symbol}`;
};
