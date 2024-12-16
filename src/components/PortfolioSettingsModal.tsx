"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import Image from "next/image";

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
                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900 mb-6"
                  >
                    Portfolio Settings
                  </Dialog.Title>

                  <div className="space-y-6">
                    {/* Portfolio Name */}
                    <div>
                      <label
                        htmlFor="portfolio-name"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Portfolio Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="portfolio-name"
                          value={newName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          onBlur={handleSave}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Portfolio Visibility
                        </h4>
                        <p className="text-sm text-gray-500">
                          {isPublic
                            ? "Anyone can view this portfolio"
                            : "Only you can view this portfolio"}
                        </p>
                      </div>
                      <Switch
                        checked={isPublic}
                        onChange={onToggleVisibility}
                        className={`${
                          isPublic ? "bg-blue-600" : "bg-gray-200"
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
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Delete Portfolio
                        </h4>
                        <p className="text-sm text-gray-500">
                          This action cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                      >
                        Delete Portfolio
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  {hasChanges && (
                    <button
                      type="button"
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                  )}
                  <button
                    type="button"
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {isDeleteConfirmOpen && (
          <div className="relative z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Confirm Delete
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete {portfolioName}? This action
                  cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setIsDeleteConfirmOpen(false);
                      onClose();
                    }}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
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
