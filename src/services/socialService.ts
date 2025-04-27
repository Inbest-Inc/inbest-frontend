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

    const requestBody = {
      investmentActivityId: parsedActivityId,
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
        errorMessage =
          errorData.message || errorData.error || "Failed to share post";
      } catch (parseError) {
        // If not JSON, try to get the text
        try {
          const textData = await response.text();
          console.error("Error response text:", textData);

          // If text contains meaningful information, use it
          if (textData && textData.length > 0) {
            errorMessage = textData;
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
      console.error("No auth token found in localStorage");
      return { status: "error", message: "Not authenticated" };
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
    if (!token) {
      console.error("No auth token found in localStorage");
      return { status: "error", message: "Not authenticated" };
    }

    const response = await fetch(`${API_URL}/api/posts/user/${username}`, {
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
          errorMessage = "User not found";
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

    // Check if the API returned the comment structure we expect
    if (responseData.status === "success") {
      // Create a proper Comment object for the response, handling both
      // new API format (data in data field) and old API format
      let commentData: Comment;

      if (responseData.data && typeof responseData.data === "object") {
        // New format: Comment data is in responseData.data
        commentData = responseData.data;
      } else {
        // Old format or missing data: Construct a comment object from available info
        const storedUsername = localStorage.getItem("username") || "user";

        commentData = {
          id: Date.now(), // Generate a temporary ID
          content: data.comment,
          createdAt: new Date().toISOString(),
          userDTO: {
            username: storedUsername,
            email: "",
            name: storedUsername,
            surname: "",
          },
        };
      }

      return {
        status: "success",
        message: responseData.message || "Comment added successfully",
        data: commentData,
      };
    } else {
      console.error("API returned non-success status:", responseData);
      return {
        status: "error",
        message: responseData.message || "Failed to create comment",
      };
    }
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
    if (!token) {
      console.error("No auth token found in localStorage");
      return { status: "error", message: "Not authenticated" };
    }

    const response = await fetch(
      `${API_URL}/api/comments/get-all-comments/${postId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    return {
      status: "success",
      data: data.data || [],
    };
  } catch (error) {
    console.error("Error getting comments:", error);
    return {
      status: "error",
      message: "Failed to get comments. Please try again later.",
    };
  }
}
