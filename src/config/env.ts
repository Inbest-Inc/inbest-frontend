export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper function to get the API URL based on environment
export function getApiUrl() {
  if (
    process.env.NEXT_PUBLIC_USE_PROD_API === "true" ||
    process.env.NODE_ENV === "production"
  ) {
    return "https://api.tryinbest.com";
  }
  return "http://localhost:8080";
}
