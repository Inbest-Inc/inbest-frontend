import toast from "react-hot-toast";
import { getApiUrl } from "@/config/env";

const API_URL = getApiUrl();

interface PostShareRequest {
  investmentActivityId: number;
  content: string;
}

interface PostShareResponse {
  status: string;
  message?: string;
  data?: {
    postId: number;
  };
}

// Post response interface matching the API response format
export interface Post {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  stockSymbol: string;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  userDTO: {
    username: string;
    email: string;
    name: string;
    surname: string;
    image_url: string;
    followerCount: number | null;
  };
  investmentActivityResponseDTO: {
    activityId: number;
    portfolioId: number;
    stockId: number;
    stockSymbol: string;
    stockName: string;
    actionType: string;
    stockQuantity: number;
    date: string;
    old_position_weight: number;
    new_position_weight: number;
  };
  trending: boolean;
}

export interface PostsResponse {
  status: string;
  message: string;
  data?: Post[];
}

export interface PaginatedPostsResponse {
  status: string;
  page: number;
  totalPages: number;
  totalPosts: number;
  nextPage: number | null;
  message: string;
  data?: Post[];
}

/**
 * Share an investment post with the user's rationale
 * @param data - The post data including investmentActivityId and content
 * @returns A promise that resolves to the response from the server
 */
export async function sharePost(
  data: PostShareRequest
): Promise<PostShareResponse> {
  const loadingToast = toast.loading("Sharing your investment insight...");

  try {
    // Log the input data received by the function
    console.log(
      "sharePost function called with data:",
      JSON.stringify(data, null, 2)
    );

    // ADDITIONAL DEBUGGING: Check if this looks like a hardcoded temporary ID
    if (data.investmentActivityId === 123456) {
      console.warn(
        "WARNING: Using temporary ID (123456) instead of actual activity ID! This will cause 'Investment activity not found' errors."
      );
    }

    // Validate that the required fields are present
    if (!data.investmentActivityId) {
      console.error("Missing required field: investmentActivityId");
      toast.error("Missing investment activity information", {
        id: loadingToast,
      });
      return {
        status: "error",
        message: "Missing investment activity information",
      };
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found in localStorage");
      toast.error("You must be logged in to share posts", { id: loadingToast });
      return { status: "error", message: "Not authenticated" };
    }

    // For debugging - log the exact request with investmentActivityId
    console.log(
      "Post sharing request:",
      JSON.stringify({
        investmentActivityId: data.investmentActivityId,
        content: data.content,
      })
    );
    console.log("API URL:", `${API_URL}/api/posts`);

    // Check data type of investmentActivityId to ensure it's a number
    const activityIdType = typeof data.investmentActivityId;
    console.log("investmentActivityId type:", activityIdType);
    console.log("Raw investmentActivityId value:", data.investmentActivityId);

    // If it's not a number, try to convert it
    let parsedActivityId = data.investmentActivityId;
    if (activityIdType !== "number") {
      try {
        parsedActivityId = parseInt(String(data.investmentActivityId), 10);
        console.log(
          "Converted investmentActivityId to number:",
          parsedActivityId
        );
      } catch (e) {
        console.error("Failed to convert investmentActivityId to number:", e);
      }
    }

    // Extra check for NaN
    if (isNaN(parsedActivityId)) {
      console.error(
        "Activity ID is not a valid number:",
        data.investmentActivityId
      );
      toast.error("Invalid activity ID format", { id: loadingToast });
      return {
        status: "error",
        message: "Invalid activity ID format",
      };
    }

    // ADDITIONAL CHECK: Detect and handle the hardcoded temporary ID
    if (parsedActivityId === 123456) {
      console.error(
        "Detected temporary ID (123456) in share request. This is likely caused by not preserving the actual activityId from the API response."
      );
      toast.error("Cannot share using a temporary activity ID", {
        id: loadingToast,
      });
      return {
        status: "error",
        message:
          "Cannot share using a temporary activity ID. Please try again.",
      };
    }

    // Ensure we're sending a number to the API
    const requestBody = {
      investmentActivityId: Number(parsedActivityId),
      content: data.content,
    };

    console.log("Final request body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    // For debugging - log the status
    console.log("Post sharing response status:", response.status);

    // Log response headers safely
    const headerObj: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    console.log("Response headers:", headerObj);

    // Handle different status codes
    if (!response.ok) {
      let errorMessage = "Failed to share post";

      try {
        // Try to parse as JSON first
        const errorData = await response.json();
        console.error("Error response data:", errorData);

        // Special handling for investment activity not found error
        if (errorMessage.includes("Investment activity not found")) {
          console.error("Activity ID not found on server:", parsedActivityId);
          errorMessage = `Investment activity ID ${parsedActivityId} not found. Please try again or contact support.`;
        } else {
          errorMessage =
            errorData.message || errorData.error || "Failed to share post";
        }
      } catch (parseError) {
        // If not JSON, try to get the text
        try {
          const textData = await response.text();
          console.error("Error response text:", textData);

          // If text contains meaningful information, use it
          if (textData && textData.length > 0) {
            errorMessage = textData;

            // Special handling for investment activity not found error
            if (errorMessage.includes("Investment activity not found")) {
              console.error(
                "Activity ID not found on server:",
                parsedActivityId
              );
              errorMessage = `Investment activity ID ${parsedActivityId} not found. Please try again or contact support.`;
            }
          }
        } catch (textError) {
          // If we can't even get the text, use status code information
          if (response.status === 404) {
            errorMessage = "API endpoint not found. Please try again later.";
          } else if (response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage = `Error ${response.status}: Failed to share post`;
          }
        }
      }

      toast.error(errorMessage, { id: loadingToast });
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const responseData = await response.json();
    console.log("Post sharing success - response data:", responseData);
    toast.success("Post shared successfully!", { id: loadingToast });
    return {
      status: "success",
      data: responseData,
    };
  } catch (error) {
    console.error("Error sharing post:", error);
    toast.error("Failed to share post. Please try again later.", {
      id: loadingToast,
    });
    return { status: "error", message: "Failed to share post" };
  }
}

/**
 * Fetch posts for the currently logged-in user
 * @returns A promise that resolves to the response from the server
 */
export async function getUserPosts(): Promise<PostsResponse> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Cannot fetch user's own posts without authentication");
      return {
        status: "error",
        message: "Authentication required for personal posts",
      };
    }

    const response = await fetch(`${API_URL}/api/posts/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch posts";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || "Failed to fetch posts";
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Posts not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      status: data.status,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return {
      status: "error",
      message: "Failed to fetch posts. Please try again later.",
    };
  }
}

/**
 * Fetch posts for a specific user by username
 * @param username - The username of the user to fetch posts for
 * @returns A promise that resolves to the response from the server
 */
export async function getUserPostsByUsername(
  username: string
): Promise<PostsResponse> {
  try {
    const token = localStorage.getItem("token");

    // Create headers object conditionally to include token if available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/posts/user/${username}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch posts";
      try {
        const errorData = await response.json();

        // If the error message contains "No posts found for user: [username]", replace with a more professional message
        if (
          errorData.message &&
          errorData.message.includes("No posts found for user:")
        ) {
          errorMessage = "No content available";
        } else {
          errorMessage = errorData.message || "Failed to fetch posts";
        }
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Profile not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      status: data.status,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return {
      status: "error",
      message: "Failed to fetch posts. Please try again later.",
    };
  }
}

/**
 * LIKES API
 */

export interface LikeStatusResponse {
  status: string;
  message?: string;
  data?: {
    liked: boolean;
  };
}

export interface LikeCountResponse {
  status: string;
  message?: string;
  data?: {
    count: number;
  };
}

/**
 * Like a post
 * @param postId - The ID of the post to like
 * @returns A promise that resolves to the response from the server
 */
export async function likePost(postId: number): Promise<LikeStatusResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found in localStorage");
      return { status: "error", message: "Not authenticated" };
    }

    console.log(`Attempting to like post with ID: ${postId}`);

    const response = await fetch(`${API_URL}/api/likes/posts/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Like post response status: ${response.status}`);

    // Log response headers for debugging
    const headerObj: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    console.log("Response headers:", headerObj);

    if (!response.ok) {
      let errorMessage = "Failed to like post";
      try {
        const errorData = await response.json();
        console.error("Like error response data:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error("Couldn't parse error response:", e);
        if (response.status === 401) {
          errorMessage = "Authentication error. Please log in again.";
        } else if (response.status === 404) {
          errorMessage = "Post not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    // Parse the response
    const data = await response.json();
    console.log("Like post success - response data:", data);

    return {
      status: "success",
      data: { liked: true },
      message: data.message || "Post liked successfully!",
    };
  } catch (error) {
    console.error("Error liking post:", error);
    return {
      status: "error",
      message: "Failed to like post. Please try again later.",
    };
  }
}

/**
 * Unlike a post
 * @param postId - The ID of the post to unlike
 * @returns A promise that resolves to the response from the server
 */
export async function unlikePost(postId: number): Promise<LikeStatusResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found in localStorage");
      return { status: "error", message: "Not authenticated" };
    }

    console.log(`Attempting to unlike post with ID: ${postId}`);

    const response = await fetch(`${API_URL}/api/likes/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Unlike post response status: ${response.status}`);

    // Log response headers for debugging
    const headerObj: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    console.log("Response headers:", headerObj);

    if (!response.ok) {
      let errorMessage = "Failed to unlike post";
      try {
        const errorData = await response.json();
        console.error("Unlike error response data:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error("Couldn't parse error response:", e);
        if (response.status === 401) {
          errorMessage = "Authentication error. Please log in again.";
        } else if (response.status === 404) {
          errorMessage = "Post not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    // Parse the response
    const data = await response.json();
    console.log("Unlike post success - response data:", data);

    return {
      status: "success",
      data: { liked: false },
      message: data.message || "Post unliked successfully!",
    };
  } catch (error) {
    console.error("Error unliking post:", error);
    return {
      status: "error",
      message: "Failed to unlike post. Please try again later.",
    };
  }
}

/**
 * Check if a post is liked by the current user
 * @param postId - The ID of the post to check
 * @returns A promise that resolves to the response from the server
 */
export async function checkPostLikeStatus(
  postId: number
): Promise<LikeStatusResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found in localStorage");
      return { status: "error", message: "Not authenticated" };
    }

    const response = await fetch(
      `${API_URL}/api/likes/posts/${postId}/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to check like status";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Post not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      status: "success",
      data: {
        liked: data.data?.liked || false,
      },
    };
  } catch (error) {
    console.error("Error checking like status:", error);
    return {
      status: "error",
      message: "Failed to check like status. Please try again later.",
    };
  }
}

/**
 * Get the like count for a post
 * @param postId - The ID of the post to get the like count for
 * @returns A promise that resolves to the response from the server
 */
export async function getPostLikeCount(
  postId: number
): Promise<LikeCountResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No auth token found in localStorage when fetching like count"
      );
      return { status: "error", message: "Not authenticated" };
    }

    console.log(`Fetching like count for post ID: ${postId}`);

    const response = await fetch(`${API_URL}/api/likes/posts/${postId}/count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Like count response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = "Failed to get like count";
      try {
        const errorData = await response.json();
        console.error("Like count error response:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error("Couldn't parse error response:", e);
        if (response.status === 401) {
          errorMessage = "Authentication error. Please log in again.";
        } else if (response.status === 404) {
          errorMessage = "Post not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();
    console.log("Like count data received:", data);

    // Parse the count from the response data, handling different API response formats
    let count = 0;
    if (data.data && typeof data.data.count === "number") {
      count = data.data.count;
    } else if (data.count && typeof data.count === "number") {
      count = data.count;
    } else if (typeof data === "object" && data !== null) {
      // Try to find a count property at any level
      const flattenObject = (obj: any): any => {
        const result: any = {};
        for (const key in obj) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            const flattened = flattenObject(obj[key]);
            for (const subKey in flattened) {
              result[`${key}.${subKey}`] = flattened[subKey];
            }
          } else {
            result[key] = obj[key];
          }
        }
        return result;
      };

      const flatData = flattenObject(data);
      for (const key in flatData) {
        if (key.includes("count") && typeof flatData[key] === "number") {
          count = flatData[key];
          break;
        }
      }
    }

    console.log(`Parsed like count: ${count}`);

    return {
      status: "success",
      data: {
        count: count,
      },
    };
  } catch (error) {
    console.error("Error getting like count:", error);
    return {
      status: "error",
      message: "Failed to get like count. Please try again later.",
    };
  }
}

/**
 * COMMENTS API
 */

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  imageUrl?: string;
  fullName?: string;
  userDTO: {
    username: string;
    email: string;
    name: string;
    surname: string;
    image_url?: string;
  };
}

export interface CreateCommentRequest {
  postId: number;
  comment: string;
}

export interface CommentsResponse {
  status: string;
  message?: string;
  data?: Comment[];
}

export interface CreateCommentResponse {
  status: string;
  message?: string;
  data?: Comment;
}

/**
 * Create a comment on a post
 * @param data - The comment data
 * @returns A promise that resolves to the response from the server
 */
export async function createComment(
  data: CreateCommentRequest
): Promise<CreateCommentResponse> {
  try {
    console.log("Creating comment with data:", {
      postId: data.postId,
      commentLength: data.comment.length,
    });

    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "Authentication error: No token found when creating comment"
      );
      return { status: "error", message: "Not authenticated" };
    }

    const username = localStorage.getItem("username");
    console.log("Current user from localStorage:", { username });

    console.log(`Sending comment request to: ${API_URL}/api/comments/create`);

    const response = await fetch(`${API_URL}/api/comments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log("Comment API response status:", response.status);

    // Log response headers for debugging
    const headerObj: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    console.log("Response headers:", headerObj);

    if (!response.ok) {
      let errorMessage = "Failed to create comment";
      try {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error("Could not parse error response:", e);
        if (response.status === 401) {
          errorMessage = "Authentication error. Please log in again.";
        } else if (response.status === 404) {
          errorMessage = "Post not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    // Parse the response data
    const responseData = await response.json();
    console.log("Comment created successfully:", responseData);

    // Simply return the response from the API
    return {
      status: "success",
      message: responseData.message || "Comment added successfully",
      data: responseData.data,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      status: "error",
      message: "Failed to create comment. Please try again later.",
    };
  }
}

/**
 * Get all comments for a post
 * @param postId - The ID of the post to get comments for
 * @returns A promise that resolves to the response from the server
 */
export async function getPostComments(
  postId: number
): Promise<CommentsResponse> {
  try {
    const token = localStorage.getItem("token");

    // Create headers object conditionally to include token if available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/api/comments/get-all-comments/${postId}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to get comments";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Post not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();

    console.log("Raw comments API response:", JSON.stringify(data, null, 2));

    // Process comments to ensure they have consistent fields
    let processedComments = [];
    if (data.data && Array.isArray(data.data)) {
      console.log("Processing comment array of length:", data.data.length);

      processedComments = data.data.map((comment: any) => {
        console.log("Raw comment object:", JSON.stringify(comment, null, 2));

        // Check if comment data uses 'comment' field instead of 'content'
        const commentContent = comment.content || comment.comment || "";

        // Ensure all comments have the new fields with appropriate fallbacks
        return {
          ...comment,
          // Ensure content is set correctly even if API returns 'comment' field instead
          content: commentContent,
          // If fullName is not provided, compose it from name and surname or use username
          fullName:
            comment.fullName ||
            (comment.userDTO
              ? `${comment.userDTO.name || ""} ${comment.userDTO.surname || ""}`.trim() ||
                comment.userDTO.username
              : comment.username || ""),
          // Use imageUrl if provided, otherwise fall back to userDTO.image_url if available
          imageUrl:
            comment.imageUrl ||
            (comment.userDTO ? comment.userDTO.image_url : undefined),
        };
      });

      console.log(
        "Processed comments:",
        JSON.stringify(processedComments, null, 2)
      );
    } else {
      console.log(
        "No comments array found in API response or it's not an array"
      );
    }

    return {
      status: "success",
      data: processedComments,
    };
  } catch (error) {
    console.error("Error getting comments:", error);
    return {
      status: "error",
      message: "We couldn't load the comments. Please try refreshing the page.",
    };
  }
}

/**
 * Fetch trending posts with pagination
 * @param page - The page number to fetch
 * @returns A promise that resolves to the paginated response from the server
 */
export async function getTrendingPosts(
  page: number = 1
): Promise<PaginatedPostsResponse> {
  try {
    const token = localStorage.getItem("token");

    // Create headers object conditionally to include token if available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/posts/trending?page=${page}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch trending posts";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || "Failed to fetch trending posts";
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Posts not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        page: page,
        totalPages: 0,
        totalPosts: 0,
        nextPage: null,
        message: errorMessage,
        data: [],
      };
    }

    const data = await response.json();
    return {
      status: data.status,
      page: data.page || page,
      totalPages: data.totalPages || 0,
      totalPosts: data.totalPosts || 0,
      nextPage: data.nextPage || null,
      message: data.message || "Trending posts fetched successfully",
      data: data.data || [],
    };
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    return {
      status: "error",
      page: page,
      totalPages: 0,
      totalPosts: 0,
      nextPage: null,
      message: "Failed to fetch trending posts. Please try again later.",
      data: [],
    };
  }
}

/**
 * Fetch all public posts without requiring authentication
 * @returns A promise that resolves to the response from the server
 */
export async function getAllPosts(): Promise<PostsResponse> {
  try {
    const token = localStorage.getItem("token");

    // Create headers object conditionally to include token if available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/posts`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch posts";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || "Failed to fetch posts";
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Posts not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      status: data.status,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return {
      status: "error",
      message: "Failed to fetch posts. Please try again later.",
    };
  }
}

/**
 * Fetch posts for a specific portfolio by ID
 * @param portfolioId - The ID of the portfolio to fetch posts for
 * @returns A promise that resolves to the response from the server
 */
export async function getPortfolioPosts(
  portfolioId: number | string
): Promise<PostsResponse> {
  try {
    console.log(`Fetching posts for portfolio ID: ${portfolioId}`);

    const token = localStorage.getItem("token");
    console.log(`Token available: ${!!token}`);

    // Create headers object conditionally to include token if available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${API_URL}/api/posts/portfolio/${portfolioId}`;
    console.log(`Request URL: ${url}`);
    console.log(`Request headers:`, headers);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log(`Portfolio posts response status: ${response.status}`);

    // Log response headers for debugging
    const headerObj: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    console.log("Response headers:", headerObj);

    // Handle 404 as a successful empty response to handle portfolios with no posts
    if (response.status === 404) {
      console.log(
        "No posts found for this portfolio (404). Returning empty array."
      );
      return {
        status: "success",
        message: "No content available",
        data: [],
      };
    }

    if (!response.ok) {
      let errorMessage = "Failed to fetch portfolio posts";
      try {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        errorMessage = errorData.message || "Failed to fetch portfolio posts";
      } catch (e) {
        console.error("Could not parse error response:", e);
        if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (response.status === 403 || response.status === 401) {
          errorMessage = "Not authorized to view these posts";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    // Get the raw text first to log it
    const responseText = await response.text();
    console.log(
      "Raw response text:",
      responseText.substring(0, 500) + (responseText.length > 500 ? "..." : "")
    );

    // Now parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return {
        status: "error",
        message: "Invalid response format from server",
      };
    }

    console.log("Portfolio posts data:", data);
    console.log("Portfolio posts data type:", typeof data);

    if (data) {
      console.log(
        "Portfolio posts data structure:",
        JSON.stringify(data, null, 2).substring(0, 300) + "..."
      );
      if (typeof data === "object" && !Array.isArray(data)) {
        console.log("Object keys:", Object.keys(data));
      }
    }

    // Check if data is directly an array (different from other endpoints)
    if (Array.isArray(data)) {
      console.log("Data is directly an array of length:", data.length);
      return {
        status: "success",
        message: "Posts retrieved successfully",
        data: data,
      };
    }

    // Handle nested data structures - some API responses might have data in a different path
    if (data && typeof data === "object") {
      // Try to find posts data in common paths
      if (Array.isArray(data.data)) {
        console.log("Found posts in data.data with length:", data.data.length);
        return {
          status: data.status || "success",
          message: data.message || "Posts retrieved successfully",
          data: data.data,
        };
      }

      // Check for posts in content field (common in pagination)
      if (data.content && Array.isArray(data.content)) {
        console.log(
          "Found posts in data.content with length:",
          data.content.length
        );
        return {
          status: "success",
          message: "Posts retrieved successfully",
          data: data.content,
        };
      }

      // Check if top-level object properties might be the posts
      if (
        Object.keys(data).some(
          (key) => typeof data[key] === "object" && data[key] !== null
        )
      ) {
        // Try to find an array in the data
        for (const key in data) {
          if (Array.isArray(data[key])) {
            console.log(
              `Found posts array in field: ${key} with length:`,
              data[key].length
            );
            return {
              status: "success",
              message: "Posts retrieved successfully",
              data: data[key],
            };
          }
        }
      }

      // Special case handling: If console shows array but it's not being detected
      if (
        typeof data.toString === "function" &&
        data.toString().includes("Array")
      ) {
        console.log(
          "Data might be an array-like object, attempting to convert"
        );
        try {
          // Try to convert to a regular array and ensure it matches Post[] type
          const arrayData = Array.from(data).filter(
            (item) => typeof item === "object" && item !== null && "id" in item // Verify it has at least the ID field required for a Post
          ) as Post[];

          if (arrayData.length > 0) {
            console.log(
              "Successfully converted to array with length:",
              arrayData.length
            );
            return {
              status: "success",
              message: "Posts retrieved successfully",
              data: arrayData,
            };
          }
        } catch (error) {
          console.error("Error converting to array:", error);
        }
      }
    }

    // Last resort: Check if we can convert the logged array to a usable format
    console.log(
      "Using fallback array handling - data might be in an unexpected format"
    );

    // If data.data is null or undefined, return an empty array
    const result = {
      status: data?.status || "success",
      message: data?.message || "Posts retrieved successfully",
      data: data?.data || [],
    };

    console.log("Final result being returned:", result);
    return result;
  } catch (error) {
    console.error("Error fetching portfolio posts:", error);
    return {
      status: "error",
      message: "Failed to fetch portfolio posts. Please try again later.",
    };
  }
}

/**
 * Fetch posts from users that the current authenticated user follows
 * @returns A promise that resolves to the response from the server
 */
export async function getFollowedPosts(): Promise<PostsResponse> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Cannot fetch followed posts without authentication");
      return {
        status: "error",
        message:
          "Sign in required - You need to be signed in to view posts from people you follow",
      };
    }

    const response = await fetch(`${API_URL}/api/posts/followed`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch posts";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || "Failed to fetch posts";
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Posts not found";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      status: data.status,
      message: data.message,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching followed posts:", error);
    return {
      status: "error",
      message: "Failed to fetch posts. Please try again later.",
    };
  }
}

/**
 * Delete a post by its ID
 * @param postId - The ID of the post to delete
 * @returns A promise that resolves to the response from the server
 */
export async function deletePost(postId: number): Promise<any> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication error: No token found when deleting post");
      return { status: "error", message: "Not authenticated" };
    }

    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete post";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Post not found";
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to delete this post";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      status: data.status || "success",
      message: data.message || "Post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      status: "error",
      message: "Failed to delete post. Please try again later.",
    };
  }
}

/**
 * Delete a comment by its ID
 * @param commentId - The ID of the comment to delete
 * @returns A promise that resolves to the response from the server
 */
export async function deleteComment(commentId: number): Promise<any> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "Authentication error: No token found when deleting comment"
      );
      return { status: "error", message: "Not authenticated" };
    }

    const response = await fetch(
      `${API_URL}/api/comments/delete/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to delete comment";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        if (response.status === 404) {
          errorMessage = "Comment not found";
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to delete this comment";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      return {
        status: "error",
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      status: data.status || "success",
      message: data.message || "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      status: "error",
      message: "Failed to delete comment. Please try again later.",
    };
  }
}
