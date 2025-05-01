"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { Card, Text } from "@tremor/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getUserInfo } from "@/services/userService";
import NotFoundPage from "@/components/NotFoundPage";
import {
  Post,
  Comment,
  getPostComments,
  createComment,
  likePost,
  unlikePost,
  checkPostLikeStatus,
  getPostLikeCount,
} from "@/services/socialService";
import { toast } from "react-hot-toast";
import { getApiUrl } from "@/config/env";
import PostCard from "@/components/posts/PostCard";

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeActionPending, setIsLikeActionPending] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsUserInfoLoading(true);
      try {
        const response = await getUserInfo(params.username as string);

        if (response.status === "error") {
          console.error("Error fetching user info:", response.message);
          setIsUserInfoLoading(false);
          return;
        }

        setUserInfo(response);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsUserInfoLoading(false);
      }
    };

    if (params.username) {
      fetchUserInfo();
    }
  }, [params.username]);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // Fetch the specific post by its ID
        const token = localStorage.getItem("token");
        const API_URL = getApiUrl();
        console.log(`Fetching post with ID: ${params.postId}`);

        // Create headers object conditionally to include token if available
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/posts/${params.postId}`, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          const statusCode = response.status;
          console.log(`Post fetch failed with status: ${statusCode}`);

          if (statusCode === 401) {
            console.log("Authentication error: Token invalid or expired");
            setError("Your session has expired. Please log in again.");
          } else if (statusCode === 404) {
            console.log("Post not found error");
            setError("Post not found");
          } else {
            console.log(`Unexpected status code: ${statusCode}`);
            setError("Failed to load post");
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Post data received:", data.status);

        if (data.status === "success" && data.data) {
          // Ensure the post has a valid liked field
          const processedPost = {
            ...data.data,
            liked: data.data.liked === true, // Ensure it's a boolean
          };

          setPost(processedPost);
          setLikeCount(processedPost.likeCount || 0);
          setIsLiked(processedPost.liked);
          setCommentCount(processedPost.commentCount || 0);

          // Fetch comments
          if (processedPost.id) {
            fetchComments(processedPost.id);
          } else {
            console.log("Warning: Post data missing ID property");
          }
        } else {
          console.log("API returned error:", data.message);
          setError(data.message || "Failed to load post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.postId) {
      fetchPost();
    }
  }, [params.postId]);

  const fetchLikeCount = async (postId: number) => {
    try {
      const response = await getPostLikeCount(postId);
      if (response.status === "success" && response.data) {
        setLikeCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  const fetchComments = async (postId: number) => {
    setIsCommentsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = getApiUrl();

      console.log(`[DEBUG] Fetching comments for post ID: ${postId}`);

      // Create headers object conditionally to include token if available
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log("[DEBUG] Using token for comment fetch");
      } else {
        console.log("[DEBUG] No token available for comment fetch");
      }

      // Try the first endpoint
      console.log(
        `[DEBUG] Trying primary endpoint: ${API_URL}/api/posts/${postId}/comments`
      );
      let response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        method: "GET",
        headers,
      });

      // If that fails, try the fallback endpoint
      if (!response.ok) {
        console.log(
          `[DEBUG] Primary endpoint failed with status: ${response.status}, trying fallback endpoint`
        );

        response = await fetch(
          `${API_URL}/api/comments/get-all-comments/${postId}`,
          {
            method: "GET",
            headers,
          }
        );
      }

      console.log(
        `[DEBUG] Final comments fetch response status: ${response.status}`
      );

      if (!response.ok) {
        console.log(
          `[ERROR] Comments fetch failed with status: ${response.status}`
        );
        return;
      }

      const data = await response.json();
      console.log(`[DEBUG] Comments fetched successfully. Response:`, data);

      if (data.status === "success" && data.data) {
        console.log(
          `[DEBUG] Comment data available, length: ${data.data.length}`
        );
        // Check the format of the comments and normalize if needed
        const formattedComments = data.data.map((comment: any) => {
          console.log("[DEBUG] Processing comment:", comment);

          // Get content field, handling different API formats
          const commentContent = comment.content || comment.comment || "";

          // If the comment is from the old format (without userDTO), transform it
          if (!comment.userDTO && comment.username) {
            return {
              id: comment.id || Date.now() + Math.random() * 10000,
              content: commentContent,
              createdAt: comment.createdAt || new Date().toISOString(),
              imageUrl: comment.imageUrl || null,
              fullName: comment.fullName || comment.username || "",
              userDTO: {
                username: comment.username || "",
                email: "",
                name: comment.username || "",
                surname: "",
              },
            };
          }

          // For standard format, ensure content is set correctly
          return {
            ...comment,
            content: commentContent, // Ensure content is set correctly
          };
        });

        console.log("[DEBUG] Formatted comments complete, setting state");
        setComments(formattedComments);
      } else {
        console.log(
          "[ERROR] API returned error or no data:",
          data.message || "No comment data"
        );
      }
    } catch (error) {
      console.error("[ERROR] Exception while fetching comments:", error);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handleLikeAction = async () => {
    if (!post || isLikeActionPending) return;

    setIsLikeActionPending(true);

    try {
      // Store current state for potential revert
      const previousIsLiked = isLiked;
      const previousCount = likeCount;

      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount((prevCount) =>
        isLiked ? Math.max(0, prevCount - 1) : prevCount + 1
      );

      // Update post object too
      if (post) {
        setPost({
          ...post,
          likeCount: isLiked
            ? Math.max(0, post.likeCount - 1)
            : post.likeCount + 1,
          liked: !isLiked,
        });
      }

      // Make API call
      let response;
      if (isLiked) {
        response = await unlikePost(post.id);
      } else {
        response = await likePost(post.id);
      }

      // Handle errors
      if (response.status !== "success") {
        // Revert optimistic update if there was an error
        setIsLiked(previousIsLiked);
        setLikeCount(previousCount);

        // Revert post object update
        if (post) {
          setPost({
            ...post,
            likeCount: previousCount,
            liked: previousIsLiked,
          });
        }

        toast.error(
          response.message || `Failed to ${isLiked ? "unlike" : "like"} post`
        );
      } else {
        // Show success message for successful like/unlike action
        toast.success(
          isLiked ? "Post unliked successfully" : "Post liked successfully"
        );

        // Fetch the latest count from the API
        const API_URL = getApiUrl();
        const token = localStorage.getItem("token");

        try {
          console.log(`Fetching like count for post ${post.id}`);
          const countResponse = await fetch(
            `${API_URL}/api/likes/posts/${post.id}/count`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (countResponse.ok) {
            const countData = await countResponse.json();
            console.log("Like count response:", countData);

            // Use the likeCount directly from the response
            if (
              countData.status === "success" &&
              countData.likeCount !== undefined
            ) {
              setLikeCount(countData.likeCount);

              // Update the post object too
              if (post) {
                setPost({
                  ...post,
                  likeCount: countData.likeCount,
                });
              }

              console.log(`Updated like count to: ${countData.likeCount}`);
            }
          }
        } catch (countError) {
          console.error("Error fetching like count:", countError);
        }
      }
    } catch (error) {
      console.error("Error handling like action:", error);
      toast.error(
        `Failed to ${isLiked ? "unlike" : "like"} post. Please try again.`
      );

      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikeCount((prevCount) =>
        isLiked ? prevCount + 1 : Math.max(0, prevCount - 1)
      );
    } finally {
      setIsLikeActionPending(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);

    // For debugging: Log current authentication status
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    console.log("Comment submission - Authentication status:", {
      hasToken: !!token,
      storedUsername,
    });

    if (!token || !storedUsername) {
      toast.error("You need to be logged in to comment");
      setIsSubmittingComment(false);
      return;
    }

    try {
      console.log(
        `Submitting comment to API for post ID: ${post?.id}, content: "${newComment}"`
      );
      const response = await createComment({
        postId: post!.id,
        comment: newComment,
      });

      console.log("Comment API response:", response);

      if (response.status === "success") {
        // Clear the input field
        setNewComment("");

        // Show success message
        toast.success(response.message || "Comment added successfully");

        // Increment comment count
        setCommentCount((prevCount) => prevCount + 1);

        // Update post object too if available
        if (post) {
          setPost({
            ...post,
            commentCount: post.commentCount + 1,
          });
        }

        // Refetch all comments to get the latest data
        if (post) {
          console.log("Refreshing comments after successful submission");
          await fetchComments(post.id);
        }
      } else {
        toast.error(response.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("An error occurred while adding your comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handlePostDeleted = () => {
    // Redirect to user profile if post is deleted
    router.push(`/${params.username}`);
    toast.success("Post deleted successfully");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-white/60 backdrop-blur-md p-5 ring-1 ring-black/[0.04] shadow-sm rounded-2xl">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
                <div className="h-3 w-16 bg-gray-200 rounded-md"></div>
              </div>
              <div className="h-28 bg-gray-100 rounded-xl mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded-md mb-4"></div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <div className="flex gap-4">
                  <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return <NotFoundPage message={error} />;
  }

  // If post is not available, show error
  if (!post) {
    return <NotFoundPage message="Post not found" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href={`/${params.username}`}
            className="inline-flex items-center gap-2 text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to profile
          </Link>
        </div>

        <PostCard
          post={post}
          onPostDeleted={handlePostDeleted}
          isCommentsExpanded={true}
        />
      </div>
    </div>
  );
}
