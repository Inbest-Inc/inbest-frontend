"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { sharePost } from "@/services/socialService";

interface ShareActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: any;
}

// Debug function to log the action object structure
const logActionStructure = (action: any) => {
  if (!action) {
    console.log("Action is null or undefined");
    return;
  }

  const keys = Object.keys(action);
  console.log("Action keys:", keys);

  console.log("Action essential fields:");
  console.log(
    "- stockSymbol/symbol:",
    action.stockSymbol || action.symbol || "MISSING"
  );
  console.log(
    "- stockName/name:",
    action.stockName || action.name || "MISSING"
  );
  console.log(
    "- actionType/type:",
    action.actionType || action.type || "MISSING"
  );

  // Check for structure nesting issues
  if (action.data) {
    console.log("Action has nested data:");
    console.log(JSON.stringify(action.data, null, 2));
  }
};

// Normalize the action object to ensure all required fields are present
const normalizeAction = (action: any) => {
  if (!action) return null;

  // Create a new object with standard field names for consistency
  const normalized = {
    // Use consistent field names, preferring newer API field names but falling back to legacy ones
    stockSymbol: action.stockSymbol || action.symbol || "",
    stockName: action.stockName || action.name || "",
    actionType: action.actionType || action.type || "",
    stockQuantity: action.stockQuantity || action.newShares || 0,
    old_position_weight:
      action.old_position_weight ||
      (action.oldAllocation ? action.oldAllocation / 100 : 0),
    new_position_weight:
      action.new_position_weight ||
      (action.newAllocation ? action.newAllocation / 100 : 0),
    activityId: action.activityId || action.investmentActivityId || 0,
    logo: action.logo || "",

    // Preserve legacy fields too for compatibility
    symbol: action.stockSymbol || action.symbol || "",
    name: action.stockName || action.name || "",
    type: action.type || "",
    oldAllocation:
      action.oldAllocation ||
      (action.old_position_weight ? action.old_position_weight * 100 : 0),
    newAllocation:
      action.newAllocation ||
      (action.new_position_weight ? action.new_position_weight * 100 : 0),

    // Preserve any other fields that might be useful
    ...action,
  };

  // If we have nested data, merge it as well
  if (action.data) {
    // Only add properties we don't already have
    Object.keys(action.data).forEach((key) => {
      if (normalized[key] === undefined || normalized[key] === "") {
        normalized[key] = action.data[key];
      }
    });
  }

  // Log normalized result
  console.log("Normalized action:", JSON.stringify(normalized, null, 2));

  return normalized;
};

const getActionText = (action: any) => {
  // Debug log of full action object
  console.log("getActionText called with:", JSON.stringify(action, null, 2));

  // Normalize the action to ensure consistent field names
  const normalizedAction = normalizeAction(action);

  if (!normalizedAction) {
    console.error("Failed to normalize action in getActionText");
    return "Unknown action";
  }

  // Using normalized fields which will always be present
  const symbol = normalizedAction.stockSymbol;
  const name = normalizedAction.stockName;

  if (!symbol || !name) {
    console.error("Missing stock symbol or name in normalized action");
    return "Unknown investment action";
  }

  // Determine text based on action type
  switch (normalizedAction.actionType) {
    case "ADD":
      return `Started investing in ${name} (${symbol})`;
    case "BUY":
      return `Increased ${name} (${symbol}) position from ${(normalizedAction.old_position_weight * 100).toFixed(1)}% to ${(normalizedAction.new_position_weight * 100).toFixed(1)}%`;
    case "SELL":
      if (normalizedAction.stockQuantity === 0) {
        return `Closed position in ${name} (${symbol})`;
      }
      return `Reduced ${name} (${symbol}) position from ${(normalizedAction.old_position_weight * 100).toFixed(1)}% to ${(normalizedAction.new_position_weight * 100).toFixed(1)}%`;
    case "start":
      return `Started a new position in ${name} (${symbol})`;
    case "increase":
      return `Increased ${name} (${symbol}) position from ${normalizedAction.oldAllocation.toFixed(1)}% to ${normalizedAction.newAllocation.toFixed(1)}%`;
    case "decrease":
      return `Decreased ${name} (${symbol}) position from ${normalizedAction.oldAllocation.toFixed(1)}% to ${normalizedAction.newAllocation.toFixed(1)}%`;
    default:
      console.error("Unrecognized action type:", normalizedAction.actionType);
      return `Updated position in ${name} (${symbol})`;
  }
};

const getActionColor = (type: string) => {
  // Using the new actionType if available
  if (type === "ADD") return "blue";
  if (type === "BUY") return "emerald";
  if (type === "SELL") return "rose";

  // Fallback to original format
  switch (type) {
    case "start":
      return "blue";
    case "increase":
      return "emerald";
    case "decrease":
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
  const [normalizedAction, setNormalizedAction] = useState<any>(null);

  // Normalize the action object when it changes
  useEffect(() => {
    if (action) {
      const normalized = normalizeAction(action);
      setNormalizedAction(normalized);
    }
  }, [action]);

  // Log action object whenever it changes or modal opens
  useEffect(() => {
    if (isOpen && action) {
      console.log(
        "ShareActionModal opened with action:",
        JSON.stringify(action, null, 2)
      );
      logActionStructure(action);
    }
  }, [isOpen, action]);

  const handleShare = async () => {
    if (isSubmitting) return;

    // Reset error state
    setError(null);

    // Get the investment activity ID from the action
    console.log(
      "Action object for sharing:",
      JSON.stringify(normalizedAction || action, null, 2)
    );

    // Use normalized action if available
    const actionToUse = normalizedAction || action;

    // Try to extract investmentActivityId from various possible locations
    const investmentActivityId =
      actionToUse.investmentActivityId || actionToUse.activityId;

    // Validate that we have investment activity ID
    if (!investmentActivityId) {
      setError("Cannot share post: Missing investment activity information");
      console.error(
        "Investment activity ID missing from all possible locations:",
        actionToUse
      );
      return;
    }

    console.log("Found investmentActivityId to use:", investmentActivityId);

    setIsSubmitting(true);
    try {
      // Create request with investmentActivityId and content
      const postData = {
        investmentActivityId: investmentActivityId,
        content: note,
      };

      console.log("Sending share post request:", JSON.stringify(postData));

      // Call the share post service
      const response = await sharePost(postData);

      if (response.status === "success") {
        // Reset the note and close the modal
        setNote("");
        onClose();
      } else if (response.message) {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      setError(error instanceof Error ? error.message : "Failed to share post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early check for action data issues
  if (!action) {
    console.error("ShareActionModal rendered with null/undefined action");
    return null;
  }

  // Use normalized action if available, otherwise use original action
  const actionToUse = normalizedAction || action;

  // Log any potential issues with action structure
  if (!actionToUse.stockSymbol && !actionToUse.symbol) {
    console.error(
      "Action missing both stockSymbol and symbol fields:",
      actionToUse
    );
  }

  if (!actionToUse.stockName && !actionToUse.name) {
    console.error(
      "Action missing both stockName and name fields:",
      actionToUse
    );
  }

  if (!actionToUse.actionType && !actionToUse.type) {
    console.error(
      "Action missing both actionType and type fields:",
      actionToUse
    );
  }

  // Determine the appropriate type to use for color
  const actionType = actionToUse.actionType || actionToUse.type;
  const actionColor = getActionColor(actionType);

  // Get the appropriate symbol, name and logo values
  const symbol = actionToUse.stockSymbol || actionToUse.symbol;
  const name = actionToUse.stockName || actionToUse.name;
  const logo =
    actionToUse.logo ||
    `https://assets.parqet.com/logos/symbol/${symbol}?format=svg`;

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
                            src={logo}
                            alt={name || "Stock"}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                            {name || "Unknown Stock"}
                          </h3>
                          <p className="text-[13px] leading-[18px] text-[#6E6E73]">
                            {symbol || "N/A"}
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
                            {(actionType === "start" ||
                              actionType === "ADD") && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 4v16m8-8H4"
                              />
                            )}
                            {(actionType === "increase" ||
                              actionType === "BUY") && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            )}
                            {(actionType === "decrease" ||
                              actionType === "SELL") && (
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
                        {getActionText(actionToUse)}
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
