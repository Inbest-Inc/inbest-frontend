/**
 * Validates a password against common standards
 * @param password The password to validate
 * @returns An array of validation error messages, empty if password is valid
 */
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return errors;
};

/**
 * Handles password validation errors from backend and client
 * @param backendError The error message from the backend API, if any
 * @param clientErrors Array of client-side validation error messages
 * @returns A formatted error message, prioritizing backend error
 */
export const getPasswordErrorMessage = (
  backendError: string | null | undefined,
  clientErrors: string[]
): string => {
  // If we have a backend error, prioritize it
  if (backendError) {
    return backendError;
  }

  // Otherwise use client-side validation errors
  if (clientErrors.length > 0) {
    return clientErrors.join(". ");
  }

  // Fallback generic message
  return "Password validation failed";
};
