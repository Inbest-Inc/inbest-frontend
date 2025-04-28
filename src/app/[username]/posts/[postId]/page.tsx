"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { Card, Text } from "@tremor/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { getUserInfo } from "@/services/userService";
import Avatar from "@/components/Avatar";
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
import {
  LinkedinShareButton,
  TwitterShareButton as XShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  XIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";
import { toast } from "react-hot-toast";

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
        if (!token) {
          console.log("Authentication error: No token found");
          setError("Authentication required to view this post");
          setIsLoading(false);
          return;
        }

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "https://api.inbest.app";
        console.log(`Fetching post with ID: ${params.postId}`);

        const response = await fetch(`${API_URL}/api/posts/${params.postId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          setPost(data.data);
          setLikeCount(data.data.likeCount || 0);
          setIsLiked(data.data.liked || false);
          setCommentCount(data.data.commentCount || 0);

          // Fetch comments
          if (data.data.id) {
            fetchComments(data.data.id);
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
      if (!token) {
        console.log(
          "Authentication error: No token found when fetching comments"
        );
        return;
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://api.inbest.app";

      console.log(`Fetching comments for post: ${postId}`);
      const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log(`Comments fetch failed with status: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log(
        `Comments fetched successfully. Raw response:`,
        JSON.stringify(data)
      );

      if (data.status === "success" && data.data) {
        // Check the format of the comments and normalize if needed
        const formattedComments = data.data.map((comment: any) => {
          // If the comment is from the old format (without userDTO), transform it
          if (!comment.userDTO && comment.username) {
            return {
              id: comment.id || Date.now() + Math.random() * 10000,
              content: comment.comment || "",
              createdAt: comment.createdAt || new Date().toISOString(),
              userDTO: {
                username: comment.username || "",
                email: "",
                name: comment.username || "",
                surname: "",
              },
            };
          }
          return comment;
        });

        console.log("Formatted comments:", formattedComments);
        setComments(formattedComments);
      } else {
        console.log("API returned error when fetching comments:", data.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
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
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "https://api.inbest.app";
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

    // Optimistically add the comment with current user information from localStorage
    // Using a numeric ID for the temporary comment to match the Comment type
    const tempId = Date.now(); // Using timestamp as a numeric ID

    // Get user info from userInfo state if available or use localStorage as fallback
    const commentUser = {
      username: userInfo?.username || storedUsername || "",
      name: userInfo?.name || storedUsername || "",
      surname: userInfo?.surname || "",
      email: userInfo?.email || "",
      // image_url is optional so we can omit it if it doesn't exist
    };

    console.log("Creating temp comment with user data:", commentUser);

    // Create a temporary comment that matches the Comment type structure
    const tempComment: Comment = {
      id: tempId,
      content: newComment,
      createdAt: new Date().toISOString(),
      userDTO: commentUser,
    };

    setComments((prev) => [tempComment, ...prev]);
    setNewComment("");

    // Update comment count
    setCommentCount((prevCount) => prevCount + 1);

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
        toast.success(response.message || "Comment added successfully");

        // Replace the temp comment with the real one if we have data
        if (response.data) {
          setComments((prev) =>
            prev.map((c) => (c.id === tempId ? response.data! : c))
          );
        }
      } else {
        // Remove the temp comment if there was an error
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        // Revert comment count
        setCommentCount((prevCount) => Math.max(0, prevCount - 1));
        toast.error(response.message || "Failed to add comment");
        setNewComment(newComment); // Restore the comment text
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Remove the temp comment if there was an error
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      // Revert comment count
      setCommentCount((prevCount) => Math.max(0, prevCount - 1));
      toast.error("An error occurred while adding your comment");
      setNewComment(newComment); // Restore the comment text
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Format exact date for tooltip
  const formatExactDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Format action message for consistency
  const getActionMessage = (actionType: string, weight: number) => {
    switch (actionType.toUpperCase()) {
      case "BUY":
        return `Increased position to ${weight.toFixed(2)}% of portfolio`;
      case "SELL":
        return `Decreased position to ${weight.toFixed(2)}% of portfolio`;
      default:
        return `${actionType} position (${weight.toFixed(2)}% of portfolio)`;
    }
  };

  // Get action icon based on action type
  const getActionIcon = (actionType: string) => {
    switch (actionType.toUpperCase()) {
      case "BUY":
        return (
          <div className="h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-sm bg-emerald-50/80">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        );
      case "SELL":
        return (
          <div className="h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-sm bg-red-50/80">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 12H4"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-sm bg-blue-50/80">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        );
    }
  };

  // Helper function to get stock logo URL
  const getStockLogo = (symbol: string) => {
    return `https://assets.parqet.com/logos/symbol/${symbol}?format=svg`;
  };

  // Share functionality
  const ShareSection = ({ post }: { post: Post }) => {
    const [copied, setCopied] = useState(false);

    // Generate shareable URL
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const shareTitle = `Check out @${post.userDTO.username}'s investment insight on Inbest!`;
    const shareDescription = `Follow along with ${post.userDTO.username}'s investment strategy on Inbest - the social investing platform.`;

    const handleCopyLink = () => {
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1500);
          })
          .catch((err) => {
            console.error("Could not copy text: ", err);
          });
      }
    };

    return (
      <div className="mt-6 p-5 bg-white/60 backdrop-blur-md rounded-2xl ring-1 ring-black/[0.04] shadow-sm relative z-10">
        <Text className="text-[#1D1D1F] font-medium mb-3">Share this post</Text>
        <div className="flex flex-wrap gap-3 mb-4">
          <XShareButton
            url={shareUrl}
            title={shareTitle}
            className="hover:opacity-80 transition-opacity"
          >
            <XIcon size={40} round />
          </XShareButton>

          <LinkedinShareButton
            url={shareUrl}
            title={shareTitle}
            summary={shareDescription}
            className="hover:opacity-80 transition-opacity"
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>

          <WhatsappShareButton
            url={shareUrl}
            title={shareTitle}
            className="hover:opacity-80 transition-opacity"
          >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          <TelegramShareButton
            url={shareUrl}
            title={shareTitle}
            className="hover:opacity-80 transition-opacity"
          >
            <TelegramIcon size={40} round />
          </TelegramShareButton>
        </div>

        <div className="relative">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="w-full px-4 py-2 pr-24 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-500"
          />
          <button
            onClick={handleCopyLink}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs rounded-md ${
              copied ? "bg-green-500 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-white/60 backdrop-blur-md p-5 ring-1 ring-black/[0.04] shadow-sm rounded-2xl mb-6">
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
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm rounded-2xl">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <Text className="text-red-500 font-medium text-lg mb-2">
              {error}
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              We couldn't load this post. Please try again later.
            </Text>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Not found state
  if (!post) {
    return <NotFoundPage message="Post not found" />;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/${params.username}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-1"
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
          Back to Profile
        </Link>
      </div>

      <Card className="bg-white/60 backdrop-blur-md p-5 ring-1 ring-black/[0.04] shadow-sm rounded-2xl mb-6">
        {/* Post header with user info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.userDTO.image_url}
              name={`${post.userDTO.name} ${post.userDTO.surname}`}
              size="md"
            />
            <div>
              <div className="font-medium text-[#1D1D1F]">
                {post.userDTO.name} {post.userDTO.surname}
              </div>
              <Link href={`/${post.userDTO.username}`}>
                <span className="text-sm text-[#6E6E73] hover:text-blue-600 transition-colors">
                  @{post.userDTO.username}
                </span>
              </Link>
            </div>
          </div>
          <div
            className="text-sm text-[#6E6E73] cursor-help"
            title={formatExactDate(post.createdAt)}
          >
            {formatRelativeTime(post.createdAt)}
          </div>
        </div>

        {/* Stock action card */}
        <div className="p-4 mb-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-black/[0.02]">
          <div className="flex items-center gap-3">
            {getActionIcon(post.investmentActivityResponseDTO.actionType)}
            <div className="flex-grow space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5 rounded-md overflow-hidden bg-white shadow-sm">
                  <Image
                    src={getStockLogo(post.stockSymbol)}
                    alt={post.stockSymbol}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-[#1D1D1F]">
                  ${post.stockSymbol}
                </span>
              </div>
              <div className="text-sm text-[#6E6E73]">
                {getActionMessage(
                  post.investmentActivityResponseDTO.actionType,
                  post.investmentActivityResponseDTO.new_position_weight
                )}
              </div>
            </div>
            <Link
              href={`/${post.userDTO.username}/${post.investmentActivityResponseDTO.portfolioId}`}
              className="p-2 text-[#6E6E73] hover:text-blue-600 transition-colors"
              title="View Portfolio"
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Post content */}
        {post.content && (
          <div className="mb-4">
            <p className="text-[#1D1D1F] text-[15px] leading-[20px] whitespace-pre-line">
              {post.content}
            </p>
          </div>
        )}

        {/* Interaction buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-5">
            <button
              className={`flex items-center gap-2 ${
                isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-[#6E6E73] hover:text-blue-600"
              } transition-colors`}
              onClick={handleLikeAction}
              disabled={isLikeActionPending}
            >
              <svg
                className={`w-5 h-5 ${isLikeActionPending ? "animate-pulse" : ""}`}
                fill={isLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <div className="flex items-center gap-2 text-[#6E6E73]">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm font-medium">{commentCount}</span>
            </div>
          </div>

          <Link
            href={`/${post.userDTO.username}/${post.investmentActivityResponseDTO.portfolioId}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-[15px] leading-[20px] font-medium text-[#1D1D1F] bg-gray-50/80 backdrop-blur-sm rounded-full ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-all duration-200"
          >
            View Portfolio
          </Link>
        </div>
      </Card>

      {/* Comments Section */}
      <Card className="bg-white/60 backdrop-blur-md p-5 ring-1 ring-black/[0.04] shadow-sm rounded-2xl mb-6">
        <div className="mb-4">
          <Text className="font-medium text-[#1D1D1F]">Comments</Text>
        </div>

        {/* Add new comment form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              disabled={isSubmittingComment}
            />
            <button
              type="submit"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 ${
                isSubmittingComment
                  ? "text-gray-400"
                  : "text-blue-600 hover:text-blue-700"
              } transition-colors`}
              aria-label="Post comment"
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              ) : (
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
                    d="M13 5l7 7-7 7M5 12h15"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Comments list */}
        {isCommentsLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex space-x-4 w-full max-w-md">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50/60 p-3 rounded-xl">
                <div className="flex items-start gap-3">
                  <Avatar
                    src={comment.userDTO?.image_url || null}
                    name={`${comment.userDTO?.name || ""} ${comment.userDTO?.surname || ""}`}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-[#1D1D1F] text-sm">
                          {comment.userDTO?.name || ""}{" "}
                          {comment.userDTO?.surname || ""}
                        </span>
                        <Link href={`/${comment.userDTO?.username || "#"}`}>
                          <span className="ml-1 text-xs text-[#6E6E73] hover:text-blue-600 transition-colors">
                            @{comment.userDTO?.username || "user"}
                          </span>
                        </Link>
                      </div>
                      <div
                        className="text-xs text-[#6E6E73] cursor-help"
                        title={formatExactDate(comment.createdAt)}
                      >
                        {formatRelativeTime(comment.createdAt)}
                      </div>
                    </div>
                    <p className="text-sm text-[#1D1D1F] mt-1 whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <svg
              className="w-10 h-10 text-gray-300 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <Text className="text-[#6E6E73]">
              No comments yet. Be the first to comment!
            </Text>
          </div>
        )}
      </Card>

      {/* Share section */}
      <ShareSection post={post} />
    </div>
  );
}
