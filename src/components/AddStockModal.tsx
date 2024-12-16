"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (stock: any) => void;
}

const popularStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    logo: "https://assets.parqet.com/logos/symbol/AAPL?format=svg",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    logo: "https://assets.parqet.com/logos/symbol/MSFT?format=svg",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    logo: "https://assets.parqet.com/logos/symbol/NVDA?format=svg",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    logo: "https://assets.parqet.com/logos/symbol/GOOGL?format=svg",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    logo: "https://assets.parqet.com/logos/symbol/AMZN?format=svg",
  },
];

export default function AddStockModal({
  isOpen,
  onClose,
  onAddStock,
}: AddStockModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleStockClick = (stock: any) => {
    onAddStock(stock);
    onClose();
  };

  return (
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
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Add Stock
                  </Dialog.Title>

                  {/* Search Input */}
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Search stocks..."
                      className="w-full rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Popular Stocks */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Popular Stocks
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {popularStocks.map((stock) => (
                        <button
                          key={stock.symbol}
                          onClick={() => handleStockClick(stock)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative h-8 w-8">
                            <Image
                              src={stock.logo}
                              alt={stock.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">
                              {stock.symbol}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stock.name}
                            </div>
                          </div>
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
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
