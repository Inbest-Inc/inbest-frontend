"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Text } from "@tremor/react";
import Image from "next/image";
import { Fragment, useState } from "react";
import QuantityInput from "./QuantityInput";

interface Stock {
  symbol: string;
  name: string;
  logo: string;
}

interface StockQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  stock: Stock;
  initialQuantity?: number;
  error: string | null;
  title?: string;
}

export default function StockQuantityModal({
  isOpen,
  onClose,
  onConfirm,
  stock,
  initialQuantity = 1,
  error,
  title = "Add Stock",
}: StockQuantityModalProps) {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [isValidInput, setIsValidInput] = useState<boolean>(true);

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
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={onClose}
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                        {title}
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
                      <QuantityInput
                        value={quantity}
                        onChange={setQuantity}
                        onValidChange={setIsValidInput}
                        minValue={0.01}
                      />
                      <p className="text-[13px] text-[#6E6E73] mt-1">
                        Enter quantity with up to 2 decimal places (e.g., 10.12)
                      </p>
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
                      disabled={!isValidInput}
                      className={`w-full h-[44px] flex items-center justify-center gap-2 text-[15px] leading-[20px] font-medium text-white ${
                        isValidInput
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-300 cursor-not-allowed"
                      } rounded-xl transition-all duration-200`}
                    >
                      Continue
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
