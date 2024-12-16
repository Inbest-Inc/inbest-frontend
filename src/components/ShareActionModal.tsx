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
  switch (action.type) {
    case "start":
      return `@skraatz416 started a new position in $${action.symbol}`;
    case "increase":
      return `@skraatz416 increased $${action.symbol} position from ${action.oldAllocation.toFixed(1)}% to ${action.newAllocation.toFixed(1)}%`;
    case "decrease":
      return `@skraatz416 decreased $${action.symbol} position from ${action.oldAllocation.toFixed(1)}% to ${action.newAllocation.toFixed(1)}%`;
    default:
      return "";
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

                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Share Action
                    </Dialog.Title>

                    <div className="mt-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative h-8 w-8">
                          <Image
                            src={action.logo}
                            alt={action.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {action.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getActionText(action)}
                          </div>
                        </div>
                      </div>

                      <textarea
                        rows={4}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Add a note about your investment decision..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                    onClick={handleShare}
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Don't Share
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
