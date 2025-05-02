"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./Table";
import StockQuantityModal from "./StockQuantityModal";
import {
  updateStockQuantity,
  deleteStockFromPortfolio,
} from "@/services/portfolioService";
import { formatQuantity } from "@/utils/quantityUtils";
import Tooltip from "./Tooltip";
import InfoTooltip, { metricExplanations } from "./InfoTooltip";
import { toast } from "react-hot-toast";

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  allocation: number;
  averagePrice: number;
  currentPrice: number;
  return: number;
  logo: string;
  stock_id: number;
}

interface ManageableActivityTableProps {
  data: Holding[];
  onChange: (changes: any) => void;
  onShare: (action: any) => void;
  portfolioName: string;
  onPortfolioNameChange: (name: string) => void;
  portfolioId: number;
}

const PencilIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stock: {
    symbol: string;
    name: string;
    logo: string;
  };
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  stock,
}: DeleteConfirmModalProps) => (
  <Transition.Root show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50">
                    <Image
                      src={stock.logo}
                      alt={stock.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Delete ${stock.symbol}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete {stock.name} ($
                      {stock.symbol}) from your portfolio? This action cannot be
                      undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
                  onClick={onConfirm}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
);

const DEMO_USERNAME = "warrenbuffett";

// Add a debug utility to log the structure of an action object
const debugActionObject = (prefix: string, actionObj: any) => {
  console.log(`${prefix} action object:`, JSON.stringify(actionObj, null, 2));

  // Check for essential fields
  console.log(`${prefix} essential fields:`, {
    symbol: actionObj.stockSymbol || actionObj.symbol,
    name: actionObj.stockName || actionObj.name,
    type: actionObj.actionType || actionObj.type,
    activityId: actionObj.activityId || actionObj.investmentActivityId,
  });
};

export default function ManageableActivityTable({
  data,
  onChange,
  onShare,
  portfolioId,
}: ManageableActivityTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<Holding | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [holdings, setHoldings] = useState(() => {
    const totalValue = data.reduce(
      (sum, h) => sum + h.shares * h.currentPrice,
      0
    );

    return data.map((h) => ({
      ...h,
      allocation: ((h.shares * h.currentPrice) / totalValue) * 100,
      return: ((h.currentPrice - h.averagePrice) / h.averagePrice) * 100,
    }));
  });

  const [deleteConfirmStock, setDeleteConfirmStock] = useState<{
    isOpen: boolean;
    stock: { symbol: string; name: string; logo: string } | null;
  }>({
    isOpen: false,
    stock: null,
  });

  // Track original holdings for comparison
  const originalHoldings = new Set(data.map((h) => h.symbol));

  const calculateNewMetrics = (
    newShares: number,
    currentShares: number,
    currentAvgPrice: number,
    currentPrice: number
  ) => {
    if (newShares > currentShares) {
      const additionalShares = newShares - currentShares;
      const totalCost =
        currentShares * currentAvgPrice + additionalShares * currentPrice;
      const newAvgPrice = totalCost / newShares;
      return {
        averagePrice: newAvgPrice,
        return: ((currentPrice - newAvgPrice) / newAvgPrice) * 100,
      };
    }
    return {
      averagePrice: currentAvgPrice,
      return: ((currentPrice - currentAvgPrice) / currentAvgPrice) * 100,
    };
  };

  const updateHoldings = (
    symbol: string,
    newShares: number,
    oldShares: number
  ) => {
    const holding = holdings.find((h) => h.symbol === symbol);
    if (!holding) return holdings;

    const oldAllocation = holding.allocation;
    const metrics = calculateNewMetrics(
      newShares,
      oldShares,
      holding.averagePrice,
      holding.currentPrice
    );

    // First update the holding with new shares and metrics
    const updatedHoldings = holdings.map((h) =>
      h.symbol === symbol
        ? {
            ...h,
            shares: newShares,
            averagePrice: metrics.averagePrice,
            return: metrics.return,
          }
        : h
    );

    // Then calculate new total value and allocations
    const totalValue = updatedHoldings.reduce(
      (sum, h) => sum + h.shares * h.currentPrice,
      0
    );

    // Finally update allocations for all holdings
    const finalHoldings = updatedHoldings.map((h) => ({
      ...h,
      allocation: ((h.shares * h.currentPrice) / totalValue) * 100,
    }));

    // Trigger share action if needed
    const newHolding = finalHoldings.find((h) => h.symbol === symbol);
    if (newHolding && newShares !== oldShares) {
      const type = determineActionType(
        symbol,
        oldShares,
        newShares,
        oldAllocation,
        newHolding.allocation
      );
      handleSharesChange(
        symbol,
        newShares,
        oldShares,
        oldAllocation,
        newHolding.allocation,
        DEMO_USERNAME,
        type
      );
    }

    return finalHoldings;
  };

  const handleShareKeyDown = (
    e: React.KeyboardEvent,
    symbol: string,
    newShares: number,
    oldShares: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditingCell(null);

      const updatedHoldings = updateHoldings(symbol, newShares, oldShares);
      setHoldings(updatedHoldings);
      onChange(updatedHoldings);
    }
  };

  const handleSharesChange = (
    symbol: string,
    newShares: number,
    oldShares: number,
    oldAllocation: number,
    newAllocation: number,
    username: string,
    type: "start" | "increase" | "decrease",
    apiActivityId?: number
  ) => {
    const holding = holdings.find((h) => h.symbol === symbol);
    if (!holding) {
      console.error("Cannot find holding for symbol:", symbol);
      return;
    }

    // First, detect if this is a CLOSE action (reducing shares to 0)
    const isCloseAction = newShares === 0;

    // Determine the proper action type based on the backend's static types
    let actionType = "BUY";
    if (oldShares === 0) {
      actionType = "ADD"; // First time buying this stock
    } else if (newShares > oldShares) {
      actionType = "BUY"; // Adding more shares to existing position
    } else if (isCloseAction) {
      actionType = "CLOSE"; // Explicitly use CLOSE for positions reduced to 0
    } else {
      actionType = "SELL"; // Reduced position but not to 0
    }

    // Log the detected action type
    console.log(
      `Action detected: ${actionType} (shares: ${oldShares} → ${newShares})`
    );

    // If this is a CLOSE action and we don't have a valid API activity ID, show error
    if (isCloseAction && (!apiActivityId || apiActivityId === 123456)) {
      console.error(
        "Attempted to share a CLOSE action without a valid API-provided activityId"
      );
      toast.error(
        "Unable to share when closing a position without an activity ID. Please try again."
      );
      return;
    }

    // New structure based on the API response
    const action = {
      activityId: apiActivityId || 123456, // Use fixed ID instead of Date.now()
      portfolioId: portfolioId,
      stockId: holding.stock_id,
      stockSymbol: symbol,
      stockName: holding.name,
      actionType: actionType,
      stockQuantity: newShares,
      old_position_weight: oldAllocation / 100, // Convert from percentage to decimal
      new_position_weight: newAllocation / 100, // Convert from percentage to decimal
      // Add legacy fields for backward compatibility
      type,
      symbol,
      name: holding.name,
      oldShares,
      newShares,
      oldAllocation,
      newAllocation,
      logo: holding.logo,
      username,
    };

    console.log("Action constructed in handleSharesChange:");
    debugActionObject("Generated", action);

    console.log("Sharing action with activityId:", action.activityId);
    onShare(action);
  };

  const determineActionType = (
    symbol: string,
    oldShares: number,
    newShares: number,
    oldAllocation: number,
    newAllocation: number
  ) => {
    if (oldShares === 0 || oldAllocation === 0) return "start";
    if (newAllocation > oldAllocation) return "increase";
    return "decrease";
  };

  const handleChange = (symbol: string, field: string, value: string) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue)) return;

    const holding = holdings.find((h) => h.symbol === symbol);
    if (!holding) return;

    if (field === "shares") {
      const roundedValue = Math.round(newValue * 1000) / 1000;
      const updatedHoldings = updateHoldings(
        symbol,
        roundedValue,
        holding.shares
      );
      setHoldings(updatedHoldings);
      onChange(updatedHoldings);
    }
  };

  const handleDelete = (stock: Holding) => {
    setDeleteConfirmStock({ isOpen: true, stock });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmStock.stock) return;

    try {
      // Get the holding before deleting it
      const holding = holdings.find(
        (h) => h.symbol === deleteConfirmStock.stock?.symbol
      );
      if (!holding) return;

      console.log("Closing position for:", deleteConfirmStock.stock.symbol);

      // First, update quantity to 0 to get a proper activityId
      console.log("Setting quantity to 0 to get proper activityId for sharing");

      let hasSharedAction = false;

      try {
        const updateResponse = await updateStockQuantity(
          portfolioId,
          holding.symbol,
          0 // Set to zero quantity
        );

        console.log(
          "Update to zero response:",
          JSON.stringify(updateResponse, null, 2)
        );

        // Check if we have a valid activityId in the response
        if (updateResponse.status === "success" && updateResponse.data) {
          const activityId =
            updateResponse.data.activityId ||
            (updateResponse.data.data && updateResponse.data.data.activityId);

          if (activityId) {
            console.log("Got valid activityId for CLOSE action:", activityId);

            // Create a share action with proper CLOSE type
            const shareAction = {
              ...updateResponse.data,
              activityId: activityId,
              actionType: "CLOSE", // Force CLOSE type for clarity
              stockQuantity: 0,
              stockSymbol: holding.symbol,
              stockName: holding.name,
              old_position_weight: holding.allocation / 100,
              new_position_weight: 0,
            };

            // Trigger share modal
            console.log("Triggering share modal for CLOSE action:");
            debugActionObject("CLOSE via delete", shareAction);
            onShare(shareAction);
            hasSharedAction = true;
          }
        }
      } catch (updateError) {
        console.error("Error updating quantity to 0:", updateError);
        // Continue with deletion even if update fails
      }

      // Add a small delay to ensure the update operation is processed
      if (hasSharedAction) {
        console.log(
          "Adding small delay before deletion to ensure proper order of operations"
        );
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Now proceed with the actual deletion
      console.log("Proceeding with actual deletion");
      await deleteStockFromPortfolio(
        portfolioId,
        deleteConfirmStock.stock.symbol
      );

      // Update local state
      const newHoldings = holdings.filter(
        (h) => h.symbol !== deleteConfirmStock.stock?.symbol
      );
      setHoldings(newHoldings);
      onChange(newHoldings);
      setDeleteConfirmStock({ isOpen: false, stock: null });
    } catch (error) {
      console.error("Error closing position:", error);
      toast.error("Failed to close position. Please try again.");
    }
  };

  const handleQuantityUpdate = async (quantity: number) => {
    if (!selectedStock) return;

    try {
      // Get original shares for comparison
      const oldShares = selectedStock.shares;
      const oldAllocation = selectedStock.allocation;

      // Detect if this is a CLOSE action (setting shares to 0)
      const isCloseAction = quantity === 0;

      if (isCloseAction) {
        console.log("CLOSE action detected (reducing shares to 0)");
      }

      // Call API to update quantity
      const response = await updateStockQuantity(
        portfolioId,
        selectedStock.symbol,
        quantity
      );

      console.log(
        "Stock quantity update response:",
        JSON.stringify(response, null, 2)
      );

      if (response.status === "success") {
        // Update local state
        const updatedHoldings = updateHoldings(
          selectedStock.symbol,
          quantity,
          oldShares
        );
        setHoldings(updatedHoldings);
        onChange(updatedHoldings);

        // If we have activity data in the response, use it for sharing
        if (response.data) {
          console.log(
            "Stock quantity update response data:",
            JSON.stringify(response.data, null, 2)
          );

          // Try to extract activityId from various possible locations
          const activityId =
            response.data?.activityId ||
            (response as any).activityId ||
            (response.data?.data && response.data.data.activityId);

          if (activityId) {
            console.log("Found activityId in response:", activityId);

            // For CLOSE actions, make sure the actionType is set correctly
            if (isCloseAction) {
              console.log(
                "Setting actionType to CLOSE for shares reduced to 0"
              );

              // Create a share action with the activityId and correct CLOSE actionType
              const shareAction = {
                ...response.data,
                activityId: activityId,
                actionType: "CLOSE", // Force CLOSE type for positions reduced to 0
              };

              console.log(
                "About to trigger onShare with API response data (CLOSE action):"
              );
              debugActionObject("CLOSE API response", shareAction);
              onShare(shareAction);
            } else {
              // For non-CLOSE actions, use the API response as is
              const shareAction = {
                ...response.data,
                activityId: activityId, // Ensure activityId is at the top level
              };

              console.log("About to trigger onShare with API response data:");
              debugActionObject("API response-based", shareAction);
              onShare(shareAction);
            }
          } else {
            // Fallback to the old method
            console.log(
              "No activityId found in response, using generic method"
            );

            // If this is a CLOSE action without an activityId, show error and don't share
            if (isCloseAction) {
              console.error(
                "CLOSE action detected but no valid activityId found"
              );
              toast.error("Unable to share this activity. Please try again.");
              return;
            }

            const updatedHolding = updatedHoldings.find(
              (h) => h.symbol === selectedStock.symbol
            );
            if (updatedHolding) {
              const type = determineActionType(
                selectedStock.symbol,
                oldShares,
                quantity,
                oldAllocation,
                updatedHolding.allocation
              );

              // Create action with fixed ID instead of timestamp
              const tempActivityId = 123456;
              console.log("Using fixed activityId:", tempActivityId);

              // Check for CLOSE action (when reducing to zero shares)
              const isCloseAction =
                quantity === 0 || updatedHolding.allocation === 0;

              if (isCloseAction) {
                console.warn("CLOSE action detected without valid activityId");
                console.log(
                  "Cannot share CLOSE actions without proper API-provided activityId"
                );
                // We don't handle share for CLOSE actions here - they need a real activityId
                toast.error(
                  "Unable to share this activity. Try closing the position again."
                );
                return;
              }

              // Log the action before sending it
              console.log(
                "About to call handleSharesChange with fallback data"
              );

              handleSharesChange(
                selectedStock.symbol,
                quantity,
                oldShares,
                oldAllocation,
                updatedHolding.allocation,
                DEMO_USERNAME,
                type,
                tempActivityId // Use temporary ID
              );
            }
          }
        } else {
          console.log("No response data available for sharing");
        }
      } else {
        setUpdateError(response.message || "Failed to update quantity");
      }

      setSelectedStock(null);
      setUpdateError(null);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update quantity"
      );
    }
  };

  return (
    <>
      <TableRoot>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="flex items-center gap-1">
                  Asset
                  <InfoTooltip content={metricExplanations.asset} />
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="flex items-center justify-end gap-1">
                  Shares
                  <InfoTooltip content={metricExplanations.shares} />
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="flex items-center justify-end gap-1">
                  Allocation %
                  <InfoTooltip content={metricExplanations.allocation} />
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="flex items-center justify-end gap-1">
                  Avg Price
                  <InfoTooltip content={metricExplanations.averagePrice} />
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="flex items-center justify-end gap-1">
                  Current Price
                  <InfoTooltip content={metricExplanations.currentPrice} />
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="flex items-center justify-end gap-1">
                  Return
                  <InfoTooltip content={metricExplanations.return} />
                </span>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.symbol}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-xl  overflow-hidden bg-gray-50">
                      <Image
                        src={holding.logo}
                        alt={holding.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[#1D1D1F]">
                        {holding.symbol}
                      </div>
                      <div className="text-[13px] leading-[18px] text-[#6E6E73]">
                        {holding.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span>{formatQuantity(holding.shares)}</span>
                    <button
                      onClick={() => setSelectedStock(holding)}
                      className="p-1 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip content={`${holding.allocation}%`}>
                    <span>{holding.allocation.toFixed(1)}%</span>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip content={`$${holding.averagePrice}`}>
                    <span>${holding.averagePrice.toFixed(2)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip content={`$${holding.currentPrice}`}>
                    <span>${holding.currentPrice.toFixed(2)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    holding.return >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <Tooltip content={`${holding.return}%`}>
                    <span>
                      {holding.return >= 0 ? "+" : ""}
                      {holding.return.toFixed(2)}%
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(holding)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      {/* Stock Quantity Update Modal */}
      {selectedStock && (
        <StockQuantityModal
          isOpen={!!selectedStock}
          onClose={() => {
            setSelectedStock(null);
            setUpdateError(null);
          }}
          onConfirm={handleQuantityUpdate}
          stock={selectedStock}
          initialQuantity={selectedStock.shares}
          error={updateError}
          title="Update Quantity"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmStock.stock && (
        <DeleteConfirmModal
          isOpen={deleteConfirmStock.isOpen}
          onClose={() => setDeleteConfirmStock({ isOpen: false, stock: null })}
          onConfirm={confirmDelete}
          stock={deleteConfirmStock.stock}
        />
      )}
    </>
  );
}
