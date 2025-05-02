"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { sharePost } from "@/services/socialService";
import { getStockLogo } from "@/utils/stockUtils";

/**
 * Interface for investment activities with consistent field naming
 */
interface InvestmentAction {
  activityId: number;
  portfolioId: number;
  stockSymbol: string;
  stockName: string;
  actionType: "OPEN" | "BUY" | "SELL" | "CLOSE";
  stockQuantity: number;
  old_position_weight: number;
  new_position_weight: number;
  logo?: string;
}

interface ShareActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: any;
}

/**
 * Normalizes the action object to ensure consistent field naming
 * regardless of the source/format of the data
 */
const normalizeAction = (action: any): InvestmentAction | null => {
  if (!action) return null;

  // Add debug logging to see the exact structure of the action data
  console.log("Normalizing action data:", JSON.stringify(action, null, 2));

  // Extract data from the nested 'data' object if present (handling API response format)
  // For direct API responses, the data we need is in the 'data' property
  const actionData = action.data || action;

  // IMPROVED ACTIVITY ID EXTRACTION:
  // Look for activityId in all possible locations with detailed logging
  let originalActivityId: number | undefined;

  // Try direct activityId property
  if (typeof actionData.activityId === "number") {
    originalActivityId = actionData.activityId;
    console.log(
      `Found activityId directly in actionData: ${originalActivityId}`
    );
  }
  // Try nested data.activityId property
  else if (action.data && typeof action.data.activityId === "number") {
    originalActivityId = action.data.activityId;
    console.log(`Found activityId in nested data: ${originalActivityId}`);
  }
  // Try investmentActivityId property
  else if (typeof actionData.investmentActivityId === "number") {
    originalActivityId = actionData.investmentActivityId;
    console.log(
      `Found activityId as investmentActivityId: ${originalActivityId}`
    );
  }
  // For legacy API responses, check for id
  else if (typeof actionData.id === "number") {
    originalActivityId = actionData.id;
    console.log(`Found activityId as id: ${originalActivityId}`);
  }
  // Check for string versions that need conversion
  else if (
    typeof actionData.activityId === "string" &&
    !isNaN(parseInt(actionData.activityId, 10))
  ) {
    originalActivityId = parseInt(actionData.activityId, 10);
    console.log(`Converted string activityId to number: ${originalActivityId}`);
  }
  // Last resort - use 0 (not 123456 to avoid the temp ID issue)
  else {
    originalActivityId = 0;
    console.log(`No valid activityId found, using 0 as placeholder`);
  }

  // Special check for the problematic temporary ID
  if (originalActivityId === 123456) {
    console.warn(
      "WARNING: Using the temporary activity ID (123456) which will cause API failures"
    );
  }

  // Map legacy action types to standardized types
  const mapActionType = (type: string): "OPEN" | "BUY" | "SELL" | "CLOSE" => {
    const upperType = (type || "").toUpperCase();

    // First priority: explicit CLOSE type
    if (upperType === "CLOSE") {
      console.log("Mapped to CLOSE: explicit CLOSE type");
      return "CLOSE";
    }

    // Second priority: SELL with zero shares or zero weight = CLOSE
    if (
      upperType === "SELL" &&
      (actionData.stockQuantity === 0 ||
        actionData.newShares === 0 ||
        actionData.new_position_weight === 0)
    ) {
      console.log("Mapped to CLOSE: SELL with zero quantity/allocation");
      return "CLOSE";
    }

    // Handle other standard types
    if (upperType === "ADD" || upperType === "START" || upperType === "OPEN") {
      return "OPEN";
    } else if (upperType === "BUY" || upperType === "INCREASE") {
      return "BUY";
    } else if (upperType === "DECREASE" || upperType === "SELL") {
      return "SELL";
    }

    // Default to most likely action type based on available data
    // If shares are 0, it's probably a CLOSE
    if (
      actionData.stockQuantity === 0 ||
      actionData.newShares === 0 ||
      actionData.new_position_weight === 0
    ) {
      console.log("Mapped to CLOSE: detected zero quantity/allocation");
      return "CLOSE";
    }

    return "BUY";
  };

  // Extract action type from possible fields
  const rawActionType = actionData.actionType || actionData.type || "";
  const actionType = mapActionType(rawActionType);

  console.log("Mapped action type:", rawActionType, "→", actionType);

  // Extract stock symbol from possible fields
  const stockSymbol = actionData.stockSymbol || actionData.symbol || "";

  // Extract stock name from possible fields
  const stockName = actionData.stockName || actionData.name || stockSymbol;

  // Extract portfolio ID from possible fields
  const portfolioId = actionData.portfolioId || 0;

  // Extract stock quantity from possible fields
  const stockQuantity = actionData.stockQuantity || actionData.newShares || 0;

  // Extract position weights from possible fields
  const oldWeight =
    typeof actionData.old_position_weight === "number"
      ? actionData.old_position_weight
      : actionData.oldAllocation
        ? actionData.oldAllocation / 100
        : 0;

  const newWeight =
    typeof actionData.new_position_weight === "number"
      ? actionData.new_position_weight
      : actionData.newAllocation
        ? actionData.newAllocation / 100
        : 0;

  // Get logo URL
  const logo =
    actionData.logo ||
    (stockSymbol ? getStockLogo(stockSymbol) : "/placeholder-stock.png");

  // Create normalized object with consistent field naming
  const normalized = {
    activityId: originalActivityId || 0,
    portfolioId,
    stockSymbol,
    stockName,
    actionType,
    stockQuantity,
    old_position_weight: oldWeight,
    new_position_weight: newWeight,
    logo,
  };

  // Debug log the normalized result
  console.log("Normalized action:", JSON.stringify(normalized, null, 2));

  return normalized;
};

/**
 * Gets standardized action text based on the action type, stock name, and weights
 */
const getActionText = (action: InvestmentAction): string => {
  const {
    stockName,
    stockSymbol,
    actionType,
    old_position_weight,
    new_position_weight,
  } = action;

  const formatWeight = (weight: number) => {
    return `${(weight * 100).toFixed(1)}%`;
  };

  switch (actionType) {
    case "OPEN":
      return `Started investing in ${stockName} (${stockSymbol})`;
    case "BUY":
      return `Increased ${stockName} (${stockSymbol}) position from ${formatWeight(old_position_weight)} to ${formatWeight(new_position_weight)} of portfolio`;
    case "SELL":
      return `Reduced ${stockName} (${stockSymbol}) position from ${formatWeight(old_position_weight)} to ${formatWeight(new_position_weight)} of portfolio`;
    case "CLOSE":
      return `Closed position in ${stockName} (${stockSymbol})`;
    default:
      return `Updated ${stockName} (${stockSymbol}) position`;
  }
};

/**
 * Gets the action color based on action type
 */
const getActionColor = (actionType: string): string => {
  switch (actionType) {
    case "OPEN":
      return "blue";
    case "BUY":
      return "emerald";
    case "SELL":
    case "CLOSE":
      return "rose";
    default:
      return "blue";
  }
};

export default function ShareActionModal({
  isOpen,
  onClose,
  action,
}: ShareActionModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [normalizedAction, setNormalizedAction] =
    useState<InvestmentAction | null>(null);

  // Normalize the action object when it changes
  useEffect(() => {
    if (action) {
      try {
        console.log(
          "Action received in ShareActionModal:",
          JSON.stringify(action, null, 2)
        );
        const normalized = normalizeAction(action);
        setNormalizedAction(normalized);

        if (!normalized) {
          console.error("Failed to normalize action:", action);
        }
      } catch (err) {
        console.error("Error normalizing action:", err, action);
      }
    }
  }, [action]);

  const handleShare = async () => {
    if (isSubmitting) return;

    // Reset error state
    setError(null);

    // Use normalized action if available, or try to normalize action again
    const actionToUse = normalizedAction || normalizeAction(action);

    if (!actionToUse) {
      setError("Cannot share post: Missing investment activity information");
      console.error("Cannot process action for sharing:", action);
      return;
    }

    // Extract the raw data from the action to ensure we have all possible sources of the activityId
    const rawData = action.data || action;

    // Try to get the activityId from multiple possible sources
    // Priority: 1. Normalized action, 2. Raw data activityId, 3. Raw data.data activityId
    const effectiveActivityId =
      actionToUse.activityId ||
      rawData.activityId ||
      (rawData.data && rawData.data.activityId);

    console.log(
      `Using activityId: ${effectiveActivityId} (${typeof effectiveActivityId}) for sharing post`
    );
    console.log("Action type:", actionToUse.actionType);

    // Special handling for different actions
    if (actionToUse.actionType === "CLOSE") {
      console.log("CLOSE action detected - using raw activity ID if available");
      console.log("Raw action data:", JSON.stringify(rawData, null, 2));

      // For CLOSE actions, ensure we're not using the temporary ID (123456)
      if (effectiveActivityId === 123456) {
        setError(
          "Cannot share CLOSE action with temporary ID. Please try again or contact support."
        );
        console.error(
          "Attempted to share CLOSE action with temporary ID 123456"
        );
        return;
      }
    }

    if (!effectiveActivityId) {
      setError("Cannot share post: Missing investment activity ID");
      console.error("Investment activity ID missing from all sources:", {
        normalizedId: actionToUse.activityId,
        rawId: rawData.activityId,
        nestedId: rawData.data && rawData.data.activityId,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure activity ID is a number for the API
      const numericActivityId =
        typeof effectiveActivityId === "string"
          ? parseInt(effectiveActivityId, 10)
          : effectiveActivityId;

      // Reject if still using temporary ID
      if (numericActivityId === 123456) {
        throw new Error(
          "Cannot share with temporary activity ID (123456). This may be caused by a system issue. Please try again or refresh the page."
        );
      }

      const postData = {
        investmentActivityId: numericActivityId,
        content: note,
      };

      console.log("Sending post data:", JSON.stringify(postData, null, 2));
      const response = await sharePost(postData);
      console.log("Share post response:", JSON.stringify(response, null, 2));

      if (response.status === "success") {
        // Reset the note and close the modal
        setNote("");
        onClose();
      } else if (response.message) {
        setError(response.message);
      } else {
        setError("Failed to share post. Please try again.");
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      setError(error instanceof Error ? error.message : "Failed to share post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early check for action data issues - render nothing if no action
  if (!action) {
    return null;
  }

  // Use normalized action if available, otherwise return early
  if (!normalizedAction) {
    return null;
  }

  const { actionType, stockSymbol, stockName, logo } = normalizedAction;
  const actionColor = getActionColor(actionType);

  // Ensure we have a valid URL for the logo to avoid type errors
  const logoUrl = logo || "/placeholder-stock.png";

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#1D1D1F]/50 backdrop-blur-xl transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all w-full max-w-lg mx-auto">
                <div className="px-8 py-6">
                  <Dialog.Title className="text-[28px] leading-[34px] font-semibold text-[#1D1D1F]">
                    Share Your Investment Insight
                  </Dialog.Title>

                  <div className="mt-8 space-y-6">
                    {/* Preview Card */}
                    <div className="p-6 rounded-xl bg-[#F5F5F7]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-white">
                          <Image
                            src={logoUrl}
                            alt={stockName || "Stock"}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                            {stockName || "Unknown Stock"}
                          </h3>
                          <p className="text-[13px] leading-[18px] text-[#6E6E73]">
                            {stockSymbol || "N/A"}
                          </p>
                        </div>
                        <div
                          className={`h-10 w-10 rounded-full bg-${actionColor}-50 flex items-center justify-center`}
                        >
                          <svg
                            className={`w-5 h-5 text-${actionColor}-600`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {actionType === "OPEN" && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 4v16m8-8H4"
                              />
                            )}
                            {actionType === "BUY" && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            )}
                            {(actionType === "SELL" ||
                              actionType === "CLOSE") && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            )}
                          </svg>
                        </div>
                      </div>
                      <p className="text-[15px] leading-[20px] text-[#6E6E73]">
                        {getActionText(normalizedAction)}
                      </p>
                    </div>

                    {/* Note Input */}
                    <div className="space-y-2">
                      <label className="block text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                        Why did you make this decision?
                      </label>
                      <textarea
                        rows={4}
                        className="w-full rounded-xl bg-[#F5F5F7] text-[17px] leading-[22px] text-[#1D1D1F] border-none focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all p-4"
                        placeholder="Share your reasoning, analysis, or what influenced your investment decision..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>

                    {/* Error message display */}
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-[15px] leading-[20px] text-red-600">
                          {error}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-[38px] px-5 rounded-full bg-[#F5F5F7] text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:bg-[#E5E5E5] transition-all"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="h-[38px] px-5 rounded-full bg-blue-600 text-[15px] leading-[20px] font-medium text-white hover:bg-blue-700 transition-all flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Sharing...
                        </>
                      ) : (
                        "Share"
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
