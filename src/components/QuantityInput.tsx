"use client";

import { ChangeEvent, useState, useEffect } from "react";
import {
  isValidQuantityInput,
  parseQuantityInput,
  formatQuantity,
  incrementQuantity,
  decrementQuantity,
} from "@/utils/quantityUtils";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  onValidChange?: (isValid: boolean) => void;
  minValue?: number;
  step?: number;
  className?: string;
  showButtons?: boolean;
}

export default function QuantityInput({
  value,
  onChange,
  onValidChange,
  minValue = 0.01,
  step = 1,
  className = "",
  showButtons = true,
}: QuantityInputProps) {
  // We need to track the raw input separately from the parsed value
  const [inputValue, setInputValue] = useState<string>(formatQuantity(value));
  const [isValid, setIsValid] = useState<boolean>(true);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(formatQuantity(value));
    setIsValid(true);
    if (onValidChange) onValidChange(true);
  }, [value, onValidChange]);

  const validateAndUpdateInput = (newValue: string) => {
    // Always update the display value to give immediate feedback
    setInputValue(newValue);

    // Handle empty input as invalid
    if (!newValue.trim()) {
      setIsValid(false);
      if (onValidChange) onValidChange(false);
      return;
    }

    // If input starts with decimal, prepend 0
    let processedValue = newValue;
    if (newValue.startsWith(".") || newValue.startsWith(",")) {
      processedValue = "0" + newValue;
    }

    // Check if the input is valid according to our regex
    const valid = isValidQuantityInput(processedValue);
    setIsValid(valid);
    if (onValidChange) onValidChange(valid);

    // Only update the actual value if it's valid
    if (valid) {
      const parsedValue = parseQuantityInput(processedValue);
      if (parsedValue !== null && parsedValue >= minValue) {
        onChange(parsedValue);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndUpdateInput(e.target.value);
  };

  const handleBlur = () => {
    // On blur, reset the input to the current valid value if invalid
    if (!isValid) {
      setInputValue(formatQuantity(value));
      setIsValid(true);
      if (onValidChange) onValidChange(true);
    }
  };

  const handleDecrement = () => {
    const newValue = decrementQuantity(value, step, minValue);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = incrementQuantity(value, step);
    onChange(newValue);
  };

  // If no buttons are needed, just return the input
  if (!showButtons) {
    return (
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`h-[44px] px-4 text-center rounded-xl border ${
          !isValid ? "border-red-500" : "border-black/[0.08]"
        } bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all ${className}`}
      />
    );
  }

  // Return the full component with decrement/increment buttons
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDecrement}
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
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`flex-1 h-[44px] px-4 text-center rounded-xl border ${
          !isValid ? "border-red-500" : "border-black/[0.08]"
        } bg-white/90 backdrop-blur-xl shadow-sm text-[17px] leading-[22px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all ${className}`}
      />
      <button
        onClick={handleIncrement}
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
  );
}
