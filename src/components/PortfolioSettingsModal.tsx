"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";

interface PortfolioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioName: string;
  isPublic: boolean;
  onToggleVisibility: (isPublic: boolean) => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}

export default function PortfolioSettingsModal({
  isOpen,
  onClose,
  portfolioName,
  isPublic,
  onToggleVisibility,
  onDelete,
  onRename,
}: PortfolioSettingsModalProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newName, setNewName] = useState(portfolioName);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNameChange = (value: string) => {
    setNewName(value);
    setHasChanges(value.trim() !== portfolioName);
  };

  const handleSave = () => {
    if (newName.trim() !== portfolioName) {
      onRename(newName.trim());
      setHasChanges(false);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewName(portfolioName);
      setHasChanges(false);
    }
  }, [isOpen, portfolioName]);

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
                    className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] mb-8"
                  >
                    Portfolio Settings
                  </Dialog.Title>

                  <div className="space-y-6">
                    {/* Portfolio Name */}
                    <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl ring-1 ring-black/[0.04]">
                      <label
                        htmlFor="portfolio-name"
                        className="block text-[15px] leading-[20px] font-medium text-[#1D1D1F] mb-2"
                      >
                        Portfolio Name
                      </label>
                      <input
                        type="text"
                        id="portfolio-name"
                        value={newName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={handleSave}
                        className="block w-full rounded-xl bg-white/60 backdrop-blur-xl border-0 text-[15px] leading-[20px] text-[#1D1D1F] shadow-sm ring-1 ring-black/[0.04] focus:ring-2 focus:ring-blue-500 transition-all p-3"
                      />
                    </div>

                    {/* Visibility Toggle */}
                    <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl ring-1 ring-black/[0.04] flex items-center justify-between">
                      <div>
                        <h4 className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                          Portfolio Visibility
                        </h4>
                        <p className="text-[13px] leading-[18px] text-[#6E6E73] mt-1">
                          {isPublic
                            ? "Anyone can view this portfolio"
                            : "Only you can view this portfolio"}
                        </p>
                      </div>
                      <Switch
                        checked={isPublic}
                        onChange={onToggleVisibility}
                        className={`${
                          isPublic ? "bg-blue-600" : "bg-[#1D1D1F]/10"
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            isPublic ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch>
                    </div>

                    {/* Delete Portfolio */}
                    <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl ring-1 ring-black/[0.04] flex items-center justify-between">
                      <div>
                        <h4 className="text-[15px] leading-[20px] font-medium text-[#1D1D1F]">
                          Delete Portfolio
                        </h4>
                        <p className="text-[13px] leading-[18px] text-[#6E6E73] mt-1">
                          This action cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-red-50 text-[15px] leading-[20px] font-medium text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Delete Portfolio
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    {hasChanges && (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-blue-600 text-[15px] leading-[20px] font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
                        onClick={handleSave}
                      >
                        Save Changes
                      </button>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl text-[15px] leading-[20px] font-medium text-[#1D1D1F] shadow-sm ring-1 ring-black/[0.04] hover:bg-white/90 transition-all"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {isDeleteConfirmOpen && (
          <div className="relative z-[60]">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 max-w-sm mx-4 shadow-xl ring-1 ring-black/[0.04]">
                <h4 className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] mb-4">
                  Confirm Delete
                </h4>
                <p className="text-[15px] leading-[20px] text-[#6E6E73]">
                  Are you sure you want to delete {portfolioName}? This action
                  cannot be undone.
                </p>
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl text-[15px] leading-[20px] font-medium text-[#1D1D1F] shadow-sm ring-1 ring-black/[0.04] hover:bg-white/90 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setIsDeleteConfirmOpen(false);
                      onClose();
                    }}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-red-600 text-[15px] leading-[20px] font-medium text-white shadow-sm hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </Transition.Root>
  );
}
