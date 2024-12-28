"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Text } from "@tremor/react";

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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-full bg-white/80 backdrop-blur-xl text-[#1D1D1F] hover:text-[#1D1D1F]/70 transition-colors p-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
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

                <div className="p-8">
                  <Dialog.Title
                    as="h3"
                    className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] text-left mb-6"
                  >
                    Add Stock
                  </Dialog.Title>

                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search stocks..."
                      className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/60 backdrop-blur-xl border-0 text-[15px] leading-[20px] text-[#1D1D1F] placeholder-[#86868B] shadow-sm ring-1 ring-black/[0.04] focus:ring-2 focus:ring-blue-500 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {/* Popular Stocks */}
                  <div className="mt-8">
                    <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F] text-left mb-4">
                      Popular Stocks
                    </Text>
                    <div className="space-y-2">
                      {popularStocks.map((stock) => (
                        <button
                          key={stock.symbol}
                          onClick={() => handleStockClick(stock)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-xl ring-1 ring-black/[0.04] hover:bg-white/80 transition-all group"
                        >
                          <div className="relative h-12 w-12 rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-2.5">
                            <Image
                              src={stock.logo}
                              alt={stock.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                              {stock.symbol}
                            </Text>
                            <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                              {stock.name}
                            </Text>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
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
