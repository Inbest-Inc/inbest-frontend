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

export interface UserUpdateDTO {
  name: string;
  surname: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserUpdateResponse {
  status: string;
  message?: string;
  data?: any;
}

/**
 * Updates the user's name and surname
 * @param userData User data containing name and surname
 * @returns Response from the API
 */
export async function updateUserProfile(
  userData: UserUpdateDTO
): Promise<UserUpdateResponse> {
  const loadingToast = showLoadingToast("Updating profile...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Validate input
    if (!userData.name || !userData.surname) {
      throw new Error("Name and surname are required");
    }

    const response = await fetch(`${API_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(
        result.error || result.message || "Failed to update profile"
      );
    }

    toast.success(result.message || "Profile updated successfully", {
      id: loadingToast,
    });
    return result;
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Failed to update profile",
      { id: loadingToast }
    );
    throw error;
  }
}

/**
 * Changes the user's password
 * @param passwordData Password change data containing current, new, and confirm passwords
 * @returns Response from the API
 */
export async function changePassword(
  passwordData: ChangePasswordDTO
): Promise<UserUpdateResponse> {
  const loadingToast = showLoadingToast("Changing password...");

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Validate input
    if (!passwordData.currentPassword) {
      throw new Error("Current password is required");
    }

    if (!passwordData.newPassword) {
      throw new Error("New password is required");
    }

    if (passwordData.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new Error("New passwords do not match");
    }

    const response = await fetch(`${API_URL}/api/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || "Failed to change password");
    }

    toast.success(result.message || "Password changed successfully", {
      id: loadingToast,
    });
    return result;
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Failed to change password",
      { id: loadingToast }
    );
    throw error;
  }
}
