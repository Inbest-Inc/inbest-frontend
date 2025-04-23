/**
 * Utilities for handling quantity inputs with decimal support
 */

/**
 * Maximum number of decimal places allowed for stock quantities
 */
export const MAX_DECIMAL_PLACES = 2;

/**
 * Validates if a string is a valid quantity input
 * Allows both dot and comma as decimal separators
 * @param value The string value to validate
 * @returns True if the input is valid, false otherwise
 */
export function isValidQuantityInput(value: string): boolean {
  // Allow both dot and comma as decimal separators
  // Regex explanation:
  // ^[0-9]+ - starts with one or more digits (no negative values allowed)
  // ([.,][0-9]{1,2})? - optionally followed by a dot or comma and 1 to 2 digits
  // $ - end of string
  return /^[0-9]+([.,][0-9]{1,2})?$/.test(value);
}

/**
 * Formats a quantity value for display
 * @param value The number value to format
 * @returns Formatted string with up to 2 decimal places
 */
export function formatQuantity(value: number): string {
  return value.toFixed(MAX_DECIMAL_PLACES).replace(/\.?0+$/, "");
}

/**
 * Parses a quantity input string to a number
 * Handles both dot and comma as decimal separators
 * @param value The string value to parse
 * @returns The parsed number or null if invalid
 */
export function parseQuantityInput(value: string): number | null {
  if (!value) return null;

  // If the input starts with a decimal separator, prepend '0'
  if (value.startsWith(".") || value.startsWith(",")) {
    value = "0" + value;
  }

  // Replace comma with dot for parsing
  const normalizedValue = value.replace(",", ".");

  // Parse to float
  const parsed = parseFloat(normalizedValue);

  // Check if it's a valid number and not negative
  if (isNaN(parsed) || parsed < 0) return null;

  // Round to 2 decimal places
  return Math.round(parsed * 100) / 100;
}

/**
 * Increments a quantity value by a given step
 * @param value Current quantity value
 * @param step Step size (default: 1)
 * @returns Incremented quantity
 */
export function incrementQuantity(value: number, step: number = 1): number {
  return Math.round((value + step) * 100) / 100;
}

/**
 * Decrements a quantity value by a given step
 * @param value Current quantity value
 * @param step Step size (default: 1)
 * @param minValue Minimum allowed value (default: 0.01)
 * @returns Decremented quantity
 */
export function decrementQuantity(
  value: number,
  step: number = 1,
  minValue: number = 0.01
): number {
  const result = Math.round((value - step) * 100) / 100;
  return Math.max(result, minValue);
}
