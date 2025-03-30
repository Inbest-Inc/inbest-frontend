import { toast } from "react-hot-toast";
import { getApiUrl } from "@/config/env";

const API_URL = getApiUrl();

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  toast.error(message);
  throw error;
};

// Helper function to show loading toast
const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    style: {
      background: "#1D1D1F",
      color: "#fff",
      borderRadius: "12px",
    },
  });
};

export interface FileUploadResponse {
  status: string;
  message: string;
  filePath: string;
  dateTime: string;
}

// Allowed file types for profile photos
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validates a file for upload
 * @param file - The file to validate
 * @returns Object with validation result and error message if invalid
 */
export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.map((type) => type.replace("image/", "")).join(", ")}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size should be less than ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`,
    };
  }

  return { isValid: true };
};

/**
 * Uploads a profile photo
 * @param file - The file to upload
 * @param maxRetries - Maximum number of upload retries (default: 2)
 * @returns Promise resolving to the file upload response
 */
export async function uploadProfilePhoto(
  file: File,
  maxRetries: number = 2
): Promise<FileUploadResponse> {
  const loadingToast = showLoadingToast("Uploading profile photo...");

  let retries = 0;

  // Validate the file first
  const validation = validateFile(file);
  if (!validation.isValid) {
    toast.error(validation.error || "Invalid file", { id: loadingToast });
    throw new Error(validation.error);
  }

  // Check if file is empty
  if (file.size === 0) {
    const errorMsg = "File is empty";
    toast.error(errorMsg, { id: loadingToast });
    throw new Error(errorMsg);
  }

  const uploadWithRetry = async (): Promise<FileUploadResponse> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/s3/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || result.status === "error") {
        const errorMessage = result.message || "Failed to upload profile photo";
        toast.error(errorMessage, { id: loadingToast });
        throw new Error(errorMessage);
      }

      toast.success(result.message || "Profile photo uploaded successfully", {
        id: loadingToast,
      });
      return result;
    } catch (error) {
      if (
        retries < maxRetries &&
        !(error instanceof Error && error.message === "File is empty")
      ) {
        retries++;
        toast.loading(`Retrying upload (${retries}/${maxRetries})...`, {
          id: loadingToast,
        });
        // Exponential backoff: 1s, 2s, 4s, etc.
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retries - 1) * 1000)
        );
        return uploadWithRetry();
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload profile photo",
        { id: loadingToast }
      );
      throw error;
    }
  };

  return uploadWithRetry();
}

/**
 * Gets a profile photo URL
 * @param username - The username
 * @param useCache - Whether to use cached results (default: false)
 * @returns Promise resolving to the photo URL
 */
export async function getProfilePhoto(
  username: string,
  useCache: boolean = false
): Promise<string> {
  try {
    // Add cache-busting if needed
    const url = useCache
      ? `${API_URL}/api/s3/get-image/${username}`
      : `${API_URL}/api/s3/get-image/${username}?t=${new Date().getTime()}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status === "error") {
      const errorMessage = data.message || "Failed to fetch profile photo";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (!data.filePath) {
      throw new Error("No profile photo available");
    }

    return data.filePath;
  } catch (error) {
    console.error("Error fetching profile photo:", error);
    throw error;
  }
}
