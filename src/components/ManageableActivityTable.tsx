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

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  allocation: number;
  averagePrice: number;
  currentPrice: number;
  return: number;
  logo: string;
}

interface ManageableActivityTableProps {
  data: Holding[];
  onChange: (changes: any) => void;
  onShare: (action: any) => void;
  portfolioName: string;
  onPortfolioNameChange: (name: string) => void;
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
            <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-gray-900"
                >
                  Confirm Delete
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Tech Growth will record this as a{" "}
                    <span className="font-bold text-red-600">SELL</span> for the
                    entire position in ${stock.symbol}
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-full bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto"
                  onClick={onConfirm}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default function ManageableActivityTable({
  data,
  onChange,
  onShare,
}: ManageableActivityTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
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
    stock: { symbol: string; name: string } | null;
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
    type: "start" | "increase" | "decrease"
  ) => {
    const holding = holdings.find((h) => h.symbol === symbol);
    if (!holding) return;

    const action = {
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
      const updatedHoldings = updateHoldings(symbol, newValue, holding.shares);
      setHoldings(updatedHoldings);
      onChange(updatedHoldings);
    }
  };

  const handleDelete = (stock: { symbol: string; name: string }) => {
    setDeleteConfirmStock({ isOpen: true, stock });
  };

  const confirmDelete = () => {
    if (!deleteConfirmStock.stock) return;

    const holding = holdings.find(
      (h) => h.symbol === deleteConfirmStock.stock?.symbol
    );
    if (!holding) return;

    handleSharesChange(
      holding.symbol,
      0,
      holding.shares,
      holding.allocation,
      0,
      DEMO_USERNAME,
      "decrease"
    );

    const newHoldings = holdings.filter(
      (h) => h.symbol !== deleteConfirmStock.stock?.symbol
    );
    setHoldings(newHoldings);
    onChange(newHoldings);
    setDeleteConfirmStock({ isOpen: false, stock: null });
  };

  return (
    <TableRoot>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end gap-1">
                Shares
                <PencilIcon />
              </div>
            </TableHead>
            <TableHead className="text-right">Allocation %</TableHead>
            <TableHead className="text-right">Avg Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Return</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => (
            <TableRow key={holding.symbol}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-8">
                    <Image
                      src={holding.logo}
                      alt={holding.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {holding.symbol}
                    </div>
                    <div className="text-sm text-gray-500">{holding.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {editingCell === `${holding.symbol}-shares` ? (
                  <input
                    type="number"
                    value={holding.shares || ""}
                    onChange={(e) => {
                      const newValue =
                        e.target.value === "" ? 0 : parseFloat(e.target.value);
                      if (!isNaN(newValue)) {
                        setHoldings(
                          holdings.map((h) =>
                            h.symbol === holding.symbol
                              ? { ...h, shares: newValue }
                              : h
                          )
                        );
                      }
                    }}
                    onKeyDown={(e) =>
                      handleShareKeyDown(
                        e,
                        holding.symbol,
                        holding.shares,
                        data.find((h) => h.symbol === holding.symbol)?.shares ||
                          0
                      )
                    }
                    onBlur={() => {
                      setEditingCell(null);
                      setHoldings(data);
                    }}
                    className="w-20 text-right border rounded px-2 py-1"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setEditingCell(`${holding.symbol}-shares`)}
                    className="flex items-center justify-end gap-1 w-full hover:text-gray-700"
                  >
                    <span>{holding.shares}</span>
                    <PencilIcon />
                  </button>
                )}
              </TableCell>
              <TableCell className="text-right">
                {holding.allocation.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                ${holding.averagePrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${holding.currentPrice.toFixed(2)}
              </TableCell>
              <TableCell
                className={`text-right font-medium ${
                  holding.return >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {holding.return >= 0 ? "+" : ""}
                {holding.return.toFixed(2)}%
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmStock.stock && (
        <DeleteConfirmModal
          isOpen={deleteConfirmStock.isOpen}
          onClose={() => setDeleteConfirmStock({ isOpen: false, stock: null })}
          onConfirm={confirmDelete}
          stock={deleteConfirmStock.stock}
        />
      )}
    </TableRoot>
  );
}
