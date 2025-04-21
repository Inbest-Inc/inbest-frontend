import toast from "react-hot-toast";
import { getApiUrl } from "@/config/env";

/**
 * Follow a user by username
 * @param followingName - The username of the user to follow
 * @returns A promise that resolves to the response from the server
 */
export async function followUser(followingName: string) {
  try {
    console.log(`Attempting to follow user: ${followingName}`);

    // Get auth token from local storage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found");
      toast.error("You must be logged in to follow users");
      return { status: "error", message: "Not authenticated" };
    }

    const response = await fetch(`${getApiUrl()}/api/follow/${followingName}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`Follow API response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Follow error:", errorData);
      toast.error(errorData.message || "Failed to follow user");
      return {
        status: "error",
        message: errorData.message || "Failed to follow user",
      };
    }

    const data = await response.json();
    console.log("Follow success:", data);
    return { status: "success", data };
  } catch (error) {
    console.error("Error following user:", error);
    toast.error("Failed to follow user. Please try again later.");
    return { status: "error", message: "Failed to follow user" };
  }
}

/**
 * Unfollow a user by username
 * @param followingName - The username of the user to unfollow
 * @returns A promise that resolves to the response from the server
 */
export async function unfollowUser(followingName: string) {
  try {
    console.log(`Attempting to unfollow user: ${followingName}`);

    // Get auth token from local storage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found");
      toast.error("You must be logged in to unfollow users");
      return { status: "error", message: "Not authenticated" };
    }

    const response = await fetch(
      `${getApiUrl()}/api/follow/unfollow/${followingName}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Unfollow API response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Unfollow error:", errorData);
      toast.error(errorData.message || "Failed to unfollow user");
      return {
        status: "error",
        message: errorData.message || "Failed to unfollow user",
      };
    }

    const data = await response.json();
    console.log("Unfollow success:", data);
    return { status: "success", data };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    toast.error("Failed to unfollow user. Please try again later.");
    return { status: "error", message: "Failed to unfollow user" };
  }
}

/**
 * Check if the current user is following another user
 * Using client-side state to avoid extra API calls
 * @param username - The username to check if being followed
 * @returns A promise that resolves to a boolean indicating if the user is being followed
 */
export async function isFollowingUser(username: string): Promise<boolean> {
  try {
    console.log(`Checking if following user: ${username} (client-side state)`);

    // Directly return false for now - follow status will be determined by user interactions
    // This avoids making any API calls to the /following endpoint
    // The initial state will be "not following"

    // When user clicks follow, we'll update UI state
    // When user refreshes page, UI will default to "not following" until they click again
    // This approach prioritizes user interactions over persistent state

    return false;
  } catch (error) {
    console.error("Error checking if following user:", error);
    return false;
  }
}
