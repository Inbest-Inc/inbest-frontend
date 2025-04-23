import { useState } from "react";
import { Text } from "@tremor/react";

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    portfolioName: string;
    visibility: "public" | "private";
  }) => Promise<void>;
}

export default function CreatePortfolioModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePortfolioModalProps) {
  const [portfolioName, setPortfolioName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validatePortfolioName = (name: string): boolean => {
    if (name.trim().length === 0) {
      setError("Portfolio name is required");
      return false;
    }
    if (name.trim().length > 50) {
      setError("Portfolio name must be less than 50 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
      setError(
        "Portfolio name can only contain letters, numbers, spaces, and hyphens"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePortfolioName(portfolioName)) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting portfolio data...");
      await onSubmit({ portfolioName: portfolioName.trim(), visibility });
      console.log("Portfolio creation successful, closing modal");
      setPortfolioName("");
      setVisibility("public");
      onClose();
    } catch (err) {
      console.error("Error in CreatePortfolioModal:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create portfolio"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-lg transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
              Create Portfolio
            </Text>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                Portfolio Name
              </Text>
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => {
                  setPortfolioName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. Tech Growth Portfolio"
                className="w-full px-4 py-2 text-[17px] leading-[22px] text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-xl ring-1 ring-black/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all duration-200"
                required
                maxLength={50}
                disabled={isLoading}
              />
              {error && (
                <Text className="text-[13px] leading-[18px] text-red-600">
                  {error}
                </Text>
              )}
            </div>

            <div className="space-y-2">
              <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                Visibility
              </Text>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ring-1 transition-all duration-200 ${
                    visibility === "public"
                      ? "bg-blue-600 ring-blue-600 text-white"
                      : "bg-gray-50/80 ring-black/[0.08] text-[#1D1D1F] hover:bg-gray-100/80"
                  }`}
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
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility("private")}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ring-1 transition-all duration-200 ${
                    visibility === "private"
                      ? "bg-blue-600 ring-blue-600 text-white"
                      : "bg-gray-50/80 ring-black/[0.08] text-[#1D1D1F] hover:bg-gray-100/80"
                  }`}
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
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  Private
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 text-[15px] leading-[20px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-full ring-1 ring-black/[0.08] hover:bg-gray-100/80 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 text-[15px] leading-[20px] font-medium text-white bg-blue-600 rounded-full shadow-sm transition-all duration-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating..." : "Create Portfolio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
