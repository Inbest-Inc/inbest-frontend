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
