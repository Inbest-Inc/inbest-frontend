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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    const result = await response.json();
    toast.success("Profile updated successfully", { id: loadingToast });
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change password");
    }

    const result = await response.json();
    toast.success("Password changed successfully", { id: loadingToast });
    return result;
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Failed to change password",
      { id: loadingToast }
    );
    throw error;
  }
}

export type UserInfoResponse = {
  status: "success" | "error";
  name?: string;
  followers?: number;
  following?: number;
  imageUrl?: string;
  photoVersion?: string;
  message?: string;
  socials?: Array<{ type: string; url: string }>;
  // Aliases for backward compatibility
  fullName?: string;
  followerCount?: number;
  followingCount?: number;
};

export interface Notification {
  id: string;
  type: string;
  createdAt: string;
  read: boolean;
  data: {
    username?: string;
    action?: string;
    portfolioId?: string;
    portfolioName?: string;
  };
}

// User cache keys
const USER_PHOTO_VERSION_PREFIX = "user_photo_version_";

export async function getUserInfo(
  username: string,
  forceFresh: boolean = false
): Promise<UserInfoResponse> {
  // Only keep track of photo version for cache busting
  const photoVersionKey = `${USER_PHOTO_VERSION_PREFIX}${username}`;

  // Get the current photo version from localStorage (if exists)
  const currentPhotoVersion = localStorage.getItem(photoVersionKey);

  // Always fetch fresh data
  try {
    // Add cache-busting timestamp if forcing fresh data
    const timestamp = forceFresh ? `?_t=${Date.now()}` : "";
    const response = await fetch(
      `${API_URL}/api/user/${username}${timestamp}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();

    // Add the photo version to the response
    if (currentPhotoVersion) {
      userInfo.photoVersion = currentPhotoVersion;
    } else if (userInfo.status === "success" && userInfo.imageUrl) {
      // If no version exists yet, create one
      const newVersion = new Date().getTime().toString();
      localStorage.setItem(photoVersionKey, newVersion);
      userInfo.photoVersion = newVersion;
    }

    return userInfo;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return {
      status: "error",
      message: "Failed to fetch user info",
    };
  }
}
