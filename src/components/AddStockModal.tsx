"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Text } from "@tremor/react";
import Image from "next/image";
import {
  addStockToPortfolio,
  getStockTickers,
} from "@/services/portfolioService";

interface Stock {
  symbol: string;
  name: string;
  logo: string;
}

// Keep popular stocks separate
const popularStocks: Stock[] = [
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

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (stock: Stock & { quantity: number }) => void;
  portfolioId: number;
}

interface StockQuantityScreenProps {
  stock: Stock;
  onBack: () => void;
  onConfirm: (quantity: number) => void;
  error: string | null;
}

const StockQuantityScreen = ({
  stock,
  onBack,
  onConfirm,
  error,
}: StockQuantityScreenProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
          Add Stock
        </Text>
        <div className="w-7" /> {/* Spacer for alignment */}
      </div>

      <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl ring-1 ring-black/[0.04]">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-black/[0.08] bg-white">
          <Image
            src={stock.logo}
            alt={stock.name}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <Text className="text-[17px] leading-[22px] font-semibold text-[#1D1D1F]">
            {stock.name}
          </Text>
          <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
            {stock.symbol}
          </Text>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[15px] leading-[20px] font-semibold text-[#1D1D1F]">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 text-[#6E6E73] hover:text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-xl ring-1 ring-black/[0.04] transition-colors"
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
                d="M20 12H4"
              />
            </svg>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="flex-1 h-[44px] px-4 text-center rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 text-[#6E6E73] hover:text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-xl ring-1 ring-black/[0.04] transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-xl">
          <Text className="text-[15px] leading-[20px] text-red-600">
            {error}
          </Text>
        </div>
      )}

      <button
        onClick={() => onConfirm(quantity)}
        className="w-full h-[44px] flex items-center justify-center gap-2 text-[15px] leading-[20px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200"
      >
        Continue
      </button>
    </div>
  );
};

export default function AddStockModal({
  isOpen,
  onClose,
  onAddStock,
  portfolioId,
}: AddStockModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stockData = await getStockTickers();
        if (Array.isArray(stockData)) {
          // Transform the API response to match our Stock interface
          const stocksWithLogos = stockData.map((stock) => ({
            symbol: stock.ticker_symbol,
            name: stock.stock_name,
            logo: `https://assets.parqet.com/logos/symbol/${stock.ticker_symbol}?format=svg`,
          }));
          setStocks(stocksWithLogos);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setError("Failed to load stocks");
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchStocks();
    }
  }, [isOpen]);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setError(null);
  };

  const handleQuantityConfirm = async (quantity: number) => {
    if (selectedStock) {
      onAddStock({ ...selectedStock, quantity });
      setSelectedStock(null);
      setError(null);
      onClose();
    }
  };

  const filteredStocks = useMemo(() => {
    if (searchTerm === "") {
      return popularStocks;
    }

    const searchTermLower = searchTerm.toLowerCase();
    return stocks
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTermLower) ||
          stock.name.toLowerCase().includes(searchTermLower)
      )
      .slice(0, 5); // Limit to 5 results
  }, [searchTerm, stocks]);

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
                <div className="p-6">
                  {selectedStock ? (
                    <StockQuantityScreen
                      stock={selectedStock}
                      onBack={() => {
                        setSelectedStock(null);
                        setError(null);
                      }}
                      onConfirm={handleQuantityConfirm}
                      error={error}
                    />
                  ) : (
                    <div>
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

                      <div className="space-y-2 mt-6">
                        {isLoading && searchTerm !== "" ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {searchTerm === "" && (
                              <h3 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F] mb-4">
                                Popular Stocks
                              </h3>
                            )}
                            {filteredStocks.length === 0 &&
                            searchTerm !== "" ? (
                              <div className="text-center py-8">
                                <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                                  No stocks found
                                </Text>
                              </div>
                            ) : (
                              filteredStocks.map((stock) => (
                                <button
                                  key={stock.symbol}
                                  onClick={() => handleStockSelect(stock)}
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
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
