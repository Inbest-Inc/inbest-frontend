"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Text } from "@tremor/react";

interface ShareActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: any;
}

const getActionText = (action: any) => {
  switch (action.type) {
    case "start":
      return `started a new position in $${action.symbol}`;
    case "increase":
      return `increased $${action.symbol} position from ${action.oldAllocation.toFixed(1)}% to ${action.newAllocation.toFixed(1)}%`;
    case "decrease":
      return `decreased $${action.symbol} position from ${action.oldAllocation.toFixed(1)}% to ${action.newAllocation.toFixed(1)}%`;
    default:
      return "";
  }
};

const getActionColor = (type: string) => {
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

  const handleShare = () => {
    // Handle share action
    console.log({ action, note });
    onClose();
  };

  if (!action) return null;

  const actionColor = getActionColor(action.type);

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
                    Share Your Investment
                  </Dialog.Title>

                  {/* Preview Card */}
                  <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl ring-1 ring-black/[0.04] mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative h-12 w-12 rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-2.5">
                        <Image
                          src={action.logo}
                          alt={action.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <Text className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                          {action.name}
                        </Text>
                        <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
                          {action.symbol}
                        </Text>
                      </div>
                      <div
                        className={`h-10 w-10 rounded-full bg-${actionColor}-50/80 flex items-center justify-center`}
                      >
                        <svg
                          className={`w-5 h-5 text-${actionColor}-600`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {action.type === "start" && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 4v16m8-8H4"
                            />
                          )}
                          {action.type === "increase" && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          )}
                          {action.type === "decrease" && (
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
                    <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
                      {getActionText(action)}
                    </Text>
                  </div>

                  {/* Share Note */}
                  <div className="space-y-4">
                    <Text className="text-[15px] leading-[20px] font-medium text-[#1D1D1F] text-left">
                      Add Your Thoughts
                    </Text>
                    <div className="relative">
                      <textarea
                        rows={4}
                        className="w-full rounded-2xl bg-white/60 backdrop-blur-xl border-0 text-[15px] leading-[20px] text-[#1D1D1F] placeholder-[#86868B] shadow-sm ring-1 ring-black/[0.04] focus:ring-2 focus:ring-blue-500 transition-all p-4"
                        placeholder="Share your investment thesis, analysis, or what made you make this decision..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl text-[15px] leading-[20px] font-medium text-[#1D1D1F] shadow-sm ring-1 ring-black/[0.04] hover:bg-white/90 transition-all"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-blue-600 text-[15px] leading-[20px] font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
                      onClick={handleShare}
                    >
                      Share
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
