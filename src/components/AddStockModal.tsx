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

  const filteredStocks = popularStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    Add Stock
                  </Dialog.Title>

                  <div className="mt-8 space-y-6">
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search stocks..."
                        className="w-full h-[48px] pl-12 pr-4 rounded-xl bg-[#F5F5F7] text-[17px] leading-[22px] text-[#1D1D1F] border-none focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E73]"
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

                    {/* Stock List */}
                    <div className="space-y-2">
                      {searchTerm === "" && (
                        <h3 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F] mb-4">
                          Popular Stocks
                        </h3>
                      )}
                      <div className="space-y-2">
                        {filteredStocks.map((stock) => (
                          <button
                            key={stock.symbol}
                            onClick={() => handleStockClick(stock)}
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5E5] transition-all group"
                          >
                            <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-white">
                              <Image
                                src={stock.logo}
                                alt={stock.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                                {stock.symbol}
                              </h3>
                              <p className="text-[13px] leading-[18px] text-[#6E6E73]">
                                {stock.name}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
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

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-[38px] px-5 rounded-full bg-[#F5F5F7] text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:bg-[#E5E5E5] transition-all"
                    >
                      Cancel
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
