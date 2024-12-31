"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";

interface ShareActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: any;
}

const getActionText = (action: any) => {
  const username = action.user?.username || "Anonymous";
  switch (action.type) {
    case "start":
      return `@${username} started a new position in $${action.symbol}`;
    case "increase":
      return `@${username} increased $${action.symbol} position from ${action.oldAllocation.toFixed(1)}% to ${action.newAllocation.toFixed(1)}%`;
    case "decrease":
      return `@${username} decreased $${action.symbol} position from ${action.oldAllocation.toFixed(1)}% to ${action.newAllocation.toFixed(1)}%`;
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
                    Share Your Investment
                  </Dialog.Title>

                  <div className="mt-8 space-y-6">
                    {/* Preview Card */}
                    <div className="p-6 rounded-xl bg-[#F5F5F7]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-white">
                          <Image
                            src={action.logo}
                            alt={action.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                            {action.name}
                          </h3>
                          <p className="text-[13px] leading-[18px] text-[#6E6E73]">
                            {action.symbol}
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
                      <p className="text-[15px] leading-[20px] text-[#6E6E73]">
                        {getActionText(action)}
                      </p>
                    </div>

                    {/* Note Input */}
                    <div className="space-y-2">
                      <label className="block text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                        Add Your Thoughts
                      </label>
                      <textarea
                        rows={4}
                        className="w-full rounded-xl bg-[#F5F5F7] text-[17px] leading-[22px] text-[#1D1D1F] border-none focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all p-4"
                        placeholder="Share your investment thesis, analysis, or what made you make this decision..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-[38px] px-5 rounded-full bg-[#F5F5F7] text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:bg-[#E5E5E5] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="h-[38px] px-5 rounded-full bg-blue-600 text-[15px] leading-[20px] font-medium text-white hover:bg-blue-700 transition-all"
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
