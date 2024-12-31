"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Switch } from "@headlessui/react";

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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewName(portfolioName);
    }
  }, [isOpen, portfolioName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewName(value);
    if (value.trim() !== portfolioName) {
      onRename(value.trim());
    }
  };

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
                    Portfolio Settings
                  </Dialog.Title>

                  <div className="mt-8 space-y-6">
                    {/* Portfolio Name */}
                    <div className="space-y-2">
                      <label className="block text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                        Portfolio Name
                      </label>
                      <input
                        type="text"
                        value={newName}
                        onChange={handleNameChange}
                        className="w-full h-[48px] px-4 rounded-xl bg-[#F5F5F7] text-[17px] leading-[22px] text-[#1D1D1F] border-none focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                      />
                    </div>

                    {/* Portfolio Visibility */}
                    <div className="space-y-2">
                      <h3 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                        Portfolio Visibility
                      </h3>
                      <div className="p-4 rounded-xl bg-[#F5F5F7]">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                              Public Portfolio
                            </h4>
                            <p className="text-[13px] leading-[18px] text-[#6E6E73] mt-0.5">
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
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/20`}
                          >
                            <span
                              className={`${
                                isPublic ? "translate-x-6" : "translate-x-1"
                              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                          </Switch>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="space-y-2">
                      <h3 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                        Danger Zone
                      </h3>
                      <div className="p-4 rounded-xl bg-red-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-[17px] leading-[22px] font-medium text-[#1D1D1F]">
                              Delete Portfolio
                            </h4>
                            <p className="text-[13px] leading-[18px] text-[#6E6E73] mt-0.5">
                              This action cannot be undone
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            className="h-[38px] px-5 rounded-full bg-red-600 text-[15px] leading-[20px] font-medium text-white hover:bg-red-700 transition-all"
                          >
                            Delete
                          </button>
                        </div>
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

        {/* Delete Confirmation Dialog */}
        <Transition.Root show={isDeleteConfirmOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-[60]"
            onClose={() => setIsDeleteConfirmOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-[#1D1D1F]/50 backdrop-blur-xl" />
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all max-w-sm w-full mx-auto text-center">
                    <Dialog.Title className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F]">
                      Delete Portfolio
                    </Dialog.Title>
                    <Dialog.Description className="mt-4 text-[15px] leading-[20px] text-[#6E6E73]">
                      Are you sure you want to delete{" "}
                      <strong>{portfolioName}</strong>? This action cannot be
                      undone.
                    </Dialog.Description>

                    <div className="mt-8 space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="h-[38px] px-5 rounded-full bg-[#F5F5F7] text-[15px] leading-[20px] font-medium text-[#1D1D1F] hover:bg-[#E5E5E5] transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete();
                          setIsDeleteConfirmOpen(false);
                          onClose();
                        }}
                        className="h-[38px] px-5 rounded-full bg-red-600 text-[15px] leading-[20px] font-medium text-white hover:bg-red-700 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </Dialog>
    </Transition.Root>
  );
}
