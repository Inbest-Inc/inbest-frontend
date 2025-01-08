export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper function to get the API URL based on environment
export function getApiUrl() {
  if (process.env.NODE_ENV === "production") {
    return "http://63.176.12.43:8080";
  }
  return "http://localhost:8080";
}
