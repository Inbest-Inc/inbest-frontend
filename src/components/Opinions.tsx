import React, { useState, useEffect, useRef } from "react";
import { Card, Text, Metric } from "@tremor/react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllPosts,
  getFollowedPosts,
  Post,
  likePost,
  unlikePost,
  checkPostLikeStatus,
  getPostLikeCount,
  getPostComments,
  createComment,
  Comment,
} from "@/services/socialService";
import { getApiUrl } from "@/config/env";
import { format, formatDistanceToNow } from "date-fns";
import Avatar from "@/components/Avatar";
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
import { getStockLogo } from "../utils/stockUtils";

interface OpinionsProps {
  username?: string;
  isOwnProfile?: boolean;
  portfolioId?: string | number;
  view?: "forYou" | "followed";
}

const SharePostButton = ({ post }: { post: Post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Generate a shareable URL for the current post
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${post.userDTO.username}/posts/${post.id}`
      : "";

  const shareTitle = `Check out @${post.userDTO.username}'s investment insight on Inbest!`;
  const shareDescription = `Follow along with ${post.userDTO.username}'s investment strategy on Inbest - the social investing platform.`;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setCopied(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            setIsOpen(false);
            setCopied(false);
          }, 1500);
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[#6E6E73] hover:text-blue-600 transition-colors"
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
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span className="text-sm font-medium">Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-auto bg-white rounded-xl shadow-lg ring-1 ring-black/[0.08] overflow-hidden z-50">
          <div className="p-3">
            <div className="text-[13px] leading-[18px] text-[#6E6E73] mb-3 px-2">
              Share this post
            </div>
            <div className="flex items-center justify-between gap-2 px-2">
              <XShareButton
                url={shareUrl}
                title={shareTitle}
                className="hover:opacity-80 transition-opacity"
              >
                <XIcon size={36} round />
              </XShareButton>

              <LinkedinShareButton
                url={shareUrl}
                title={shareTitle}
                summary={shareDescription}
                className="hover:opacity-80 transition-opacity"
              >
                <LinkedinIcon size={36} round />
              </LinkedinShareButton>

              <WhatsappShareButton
                url={shareUrl}
                title={shareTitle}
                className="hover:opacity-80 transition-opacity"
              >
                <WhatsappIcon size={36} round />
              </WhatsappShareButton>

              <TelegramShareButton
                url={shareUrl}
                title={shareTitle}
                className="hover:opacity-80 transition-opacity"
              >
                <TelegramIcon size={36} round />
              </TelegramShareButton>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100">
              <button
                className={`w-full text-left px-3 py-2 text-[13px] leading-[18px] ${copied ? "text-green-600 flex items-center" : "text-blue-600"} hover:bg-blue-50/50 rounded-lg transition-colors`}
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Link copied!
                  </>
                ) : (
                  "Copy link to clipboard"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Comments section component
const CommentsSection = ({
  postId,
  commentCount,
  setCommentsCount,
  formatExactDate,
  formatRelativeTime,
}: {
  postId: number;
  commentCount: number;
  setCommentsCount: React.Dispatch<
    React.SetStateAction<{ [key: number]: number }>
  >;
  formatExactDate: (dateString: string) => string;
  formatRelativeTime: (dateString: string) => string;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await getPostComments(postId);
        console.log("Comments response in component:", response);

        if (response.status === "success" && response.data) {
          // Map API response to Comment objects with proper structure
          const formattedComments = response.data.map((comment: any) => {
            console.log("Processing comment in component:", comment);

            // Get content field, handling different API formats
            const commentContent = comment.content || comment.comment || "";

            // If the comment is from the old format (without userDTO), transform it
            if (!comment.userDTO && comment.username) {
              return {
                id: comment.id || Math.random() * 100000, // Generate an id if none exists
                content: commentContent, // Use the extracted content
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

          console.log("Final formatted comments:", formattedComments);
          setComments(formattedComments);
        } else {
          setError(response.message || "Failed to load comments");
        }
      } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        setError("An error occurred while fetching comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Verify authentication
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedName = localStorage.getItem("name") || "";
    const storedSurname = localStorage.getItem("surname") || "";

    if (!token || !storedUsername) {
      toast.error("You need to be logged in to comment");
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit the comment to the API
      console.log(
        `Submitting comment for post ID: ${postId}, content: "${newComment}"`
      );
      const response = await createComment({
        postId,
        comment: newComment,
      });

      console.log("Comment creation API response:", response);

      if (response.status === "success") {
        // Clear the input field
        setNewComment("");

        // Success message
        toast.success(response.message || "Comment added successfully");

        // Increment comment count
        setCommentsCount((prev) => ({
          ...prev,
          [postId]: (prev[postId] || 0) + 1,
        }));

        // Instead of refetching comments, add the new comment directly to the list
        // with the current user's information to avoid the "@user" placeholder
        // This ensures correct user info is displayed even before API refresh
        const currentTimestamp = new Date().toISOString();

        // Create a new comment object with all required fields
        const newCommentObj: Comment = {
          id: response.data?.id || Math.random() * 100000, // Use API ID or generate temporary one
          content: newComment,
          createdAt: currentTimestamp,
          fullName: `${storedName} ${storedSurname}`.trim(),
          userDTO: {
            username: storedUsername,
            email: localStorage.getItem("email") || "",
            name: storedName,
            surname: storedSurname,
            image_url: localStorage.getItem("profileImage") || undefined,
          },
        };

        // Add the new comment to the list
        setComments((prevComments) => [newCommentObj, ...prevComments]);

        // Refetch comments in the background to ensure data consistency
        setTimeout(async () => {
          try {
            const commentsResponse = await getPostComments(postId);
            if (
              commentsResponse.status === "success" &&
              commentsResponse.data
            ) {
              setComments(commentsResponse.data);
            }
          } catch (error) {
            console.error("Error refreshing comments:", error);
          }
        }, 1000);
      } else {
        toast.error(response.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("An error occurred while adding your comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-pulse flex space-x-4 w-full max-w-md">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <svg
          className="w-8 h-8 text-red-500 mb-2"
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
        <Text className="text-red-500 text-sm">{error}</Text>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 text-sm hover:underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment input form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="relative">
          <input
            ref={commentInputRef}
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full h-[44px] px-4 rounded-xl border border-black/[0.08] bg-white/90 backdrop-blur-xl shadow-sm text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 ${
              isSubmitting
                ? "text-gray-400"
                : "text-blue-600 hover:text-blue-700"
            } transition-colors`}
            aria-label="Post comment"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment.id ? comment.id.toString() : `temp-comment-${index}`}
              className="bg-gray-50/60 p-3 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <Avatar
                  src={comment.imageUrl || comment.userDTO?.image_url || null}
                  name={
                    comment.fullName ||
                    `${comment.userDTO?.name || ""} ${comment.userDTO?.surname || ""}`
                  }
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-[#1D1D1F] text-sm">
                        {comment.fullName ||
                          `${comment.userDTO?.name || ""} ${comment.userDTO?.surname || ""}`}
                      </span>
                      <Link
                        href={`/${comment.userDTO?.username || localStorage.getItem("username") || "#"}`}
                      >
                        <span className="ml-1 text-xs text-[#6E6E73] hover:text-blue-600 transition-colors">
                          @
                          {comment.userDTO?.username ||
                            localStorage.getItem("username") ||
                            "user"}
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
    </div>
  );
};

export default function Opinions({
  username,
  isOwnProfile = false,
  portfolioId,
  view = "forYou",
}: OpinionsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const [isLikeActionPending, setIsLikeActionPending] = useState<{
    [key: number]: boolean;
  }>({});
  const [commentCounts, setCommentCounts] = useState<{ [key: number]: number }>(
    {}
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null); // Reset error state on each fetch attempt
      try {
        let response;

        // Use the appropriate endpoint based on the view prop
        if (view === "followed") {
          response = await getFollowedPosts();
          console.log("Followed posts response:", response);
        } else {
          // Default to "forYou" view
          response = await getAllPosts();
          console.log("For You posts response:", response);
        }

        // If response is success but data is empty array, just set posts to empty array without error
        if (response.status === "success") {
          // Ensure all posts have a valid liked field
          const processedPosts = (response.data || []).map((post) => ({
            ...post,
            liked: post.liked === true, // Ensure it's a boolean
          }));

          setPosts(processedPosts);

          // Initialize like counts and liked status with the data from posts
          const initialLikeCounts: { [key: number]: number } = {};
          const initialLikedPosts: { [key: number]: boolean } = {};
          const initialCommentCounts: { [key: number]: number } = {};
          processedPosts.forEach((post) => {
            initialLikeCounts[post.id] = post.likeCount || 0;
            initialLikedPosts[post.id] = post.liked; // This is now guaranteed to be a boolean
            initialCommentCounts[post.id] = post.commentCount || 0;
          });
          setLikeCounts(initialLikeCounts);
          setLikedPosts(initialLikedPosts);
          setCommentCounts(initialCommentCounts);
        } else {
          // Only set error if actual error response
          setError(response.message || "Failed to load posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [view]);

  const fetchLikeCount = async (postId: number) => {
    try {
      console.log(`Fetching like count for post ${postId}`);
      const response = await getPostLikeCount(postId);
      console.log(`Like count response:`, response);

      if (response.status === "success" && response.data) {
        setLikeCounts((prev) => ({ ...prev, [postId]: response.data!.count }));
      }
    } catch (error) {
      console.error(`Error fetching like count for post ${postId}:`, error);
    }
  };

  const handleLikeAction = async (postId: number) => {
    // Prevent multiple clicks while action is pending
    if (isLikeActionPending[postId]) return;

    setIsLikeActionPending((prev) => ({ ...prev, [postId]: true }));

    try {
      const isCurrentlyLiked = likedPosts[postId] || false;
      const previousCount = likeCounts[postId] || 0;

      // Optimistic update
      setLikedPosts((prev) => ({ ...prev, [postId]: !isCurrentlyLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: isCurrentlyLiked
          ? Math.max(0, (prev[postId] || 0) - 1)
          : (prev[postId] || 0) + 1,
      }));

      // Update likeCount in the posts array
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount: isCurrentlyLiked
                  ? Math.max(0, post.likeCount - 1)
                  : post.likeCount + 1,
                liked: !isCurrentlyLiked,
              }
            : post
        )
      );

      // Make API call
      let response;
      if (isCurrentlyLiked) {
        response = await unlikePost(postId);
      } else {
        response = await likePost(postId);
      }

      console.log("Like/unlike response:", response);

      // Handle potential errors
      if (response.status !== "success") {
        // Revert optimistic update if there was an error
        setLikedPosts((prev) => ({ ...prev, [postId]: isCurrentlyLiked }));
        setLikeCounts((prev) => ({ ...prev, [postId]: previousCount }));

        // Revert the posts array update
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likeCount: previousCount, liked: isCurrentlyLiked }
              : post
          )
        );

        toast.error(
          response.message ||
            `Failed to ${isCurrentlyLiked ? "unlike" : "like"} post`
        );
      } else {
        // Show success message
        toast.success(
          isCurrentlyLiked
            ? "Post unliked successfully"
            : "Post liked successfully"
        );

        // Fetch and apply the latest count from the API directly
        const API_URL = getApiUrl();
        const token = localStorage.getItem("token");

        try {
          console.log(`Fetching like count for post ${postId}`);
          const countResponse = await fetch(
            `${API_URL}/api/likes/posts/${postId}/count`,
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
              // Update likeCounts state
              setLikeCounts((prev) => ({
                ...prev,
                [postId]: countData.likeCount,
              }));

              // Update the posts array with the accurate count from server
              setPosts((prevPosts) =>
                prevPosts.map((post) =>
                  post.id === postId
                    ? { ...post, likeCount: countData.likeCount }
                    : post
                )
              );

              console.log(`Updated like count to: ${countData.likeCount}`);
            }
          }
        } catch (countError) {
          console.error(
            `Error fetching like count for post ${postId}:`,
            countError
          );
        }
      }
    } catch (error) {
      console.error(`Error handling like action for post ${postId}:`, error);
      toast.error(
        `Failed to ${likedPosts[postId] ? "unlike" : "like"} post. Please try again.`
      );

      // Revert optimistic update on error
      const isCurrentlyLiked = likedPosts[postId] || false;
      setLikedPosts((prev) => ({ ...prev, [postId]: isCurrentlyLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: isCurrentlyLiked
          ? (prev[postId] || 0) + 1
          : Math.max(0, (prev[postId] || 0) - 1),
      }));
    } finally {
      setIsLikeActionPending((prev) => ({ ...prev, [postId]: false }));
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

  // Format action message for consistency with the share modal
  const getActionMessage = (
    actionType: string,
    stockSymbol: string,
    stockName: string,
    oldWeight: number,
    newWeight: number
  ) => {
    const formatWeight = (weight: number) => {
      return `${(weight * 100).toFixed(1)}%`;
    };

    // Standardize action types
    const upperType = actionType.toUpperCase();

    if (upperType === "ADD" || upperType === "START" || upperType === "OPEN") {
      return `Started investing in ${stockName} (${stockSymbol})`;
    } else if (upperType === "BUY" || upperType === "INCREASE") {
      return `Increased ${stockName} (${stockSymbol}) position from ${formatWeight(oldWeight)} to ${formatWeight(newWeight)} of portfolio`;
    } else if (upperType === "CLOSE") {
      return `Closed position in ${stockName} (${stockSymbol})`;
    } else if (upperType === "SELL" || upperType === "DECREASE") {
      if (newWeight === 0) {
        return `Closed position in ${stockName} (${stockSymbol})`;
      }
      return `Reduced ${stockName} (${stockSymbol}) position from ${formatWeight(oldWeight)} to ${formatWeight(newWeight)} of portfolio`;
    }

    return `Updated ${stockName} (${stockSymbol}) position`;
  };

  // Get action icon based on action type
  const getActionIcon = (actionType: string) => {
    // Standardize the action type
    const upperType = (actionType || "").toUpperCase();

    if (upperType === "OPEN" || upperType === "ADD" || upperType === "START") {
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      );
    }

    if (upperType === "BUY" || upperType === "INCREASE") {
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>
      );
    }

    if (
      upperType === "SELL" ||
      upperType === "DECREASE" ||
      upperType === "CLOSE"
    ) {
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      );
    }

    // Default icon for unknown action types
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
  };

  // Toggle expanded post
  const toggleExpand = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
          >
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
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
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
            {view === "followed"
              ? "Failed to load followed posts"
              : "Failed to load posts"}
          </Text>
          <Text className="text-gray-500 text-center">
            We couldn't load the content. Please try again later.
          </Text>
          <button
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      </Card>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <Text className="text-[#1D1D1F] font-medium text-xl mb-2">
            No posts yet
          </Text>
          <Text className="text-[#6E6E73] text-center max-w-md">
            {view === "followed"
              ? "Follow more investors to see their posts in your feed."
              : "Explore more content and check back soon for investment updates."}
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="p-6">
              {/* Post header with user info and share button */}
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  <Avatar
                    src={post.userDTO.image_url}
                    name={`${post.userDTO.name} ${post.userDTO.surname}`}
                    size="md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {/* User Info and Timestamp */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-[#1D1D1F]">
                        {post.userDTO.name} {post.userDTO.surname}
                      </div>
                      <Link href={`/${post.userDTO.username}`}>
                        <span className="text-sm text-[#6E6E73] hover:text-blue-600 transition-colors">
                          @{post.userDTO.username}
                        </span>
                      </Link>
                    </div>
                    <div
                      className="text-sm text-[#6E6E73]"
                      title={formatExactDate(post.createdAt)}
                    >
                      {formatRelativeTime(post.createdAt)}
                    </div>
                  </div>

                  {/* Stock action card */}
                  <div className="border border-gray-100 rounded-xl p-3 mb-4">
                    <div className="flex items-center">
                      {/* Action Icon */}
                      <div className="mr-3">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-sm ${
                            post.investmentActivityResponseDTO.actionType.toUpperCase() ===
                            "BUY"
                              ? "bg-emerald-50/80"
                              : post.investmentActivityResponseDTO.actionType.toUpperCase() ===
                                  "SELL"
                                ? "bg-red-50/80"
                                : "bg-blue-50/80"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 ${
                              post.investmentActivityResponseDTO.actionType.toUpperCase() ===
                              "BUY"
                                ? "text-emerald-600"
                                : post.investmentActivityResponseDTO.actionType.toUpperCase() ===
                                    "SELL"
                                  ? "text-red-600"
                                  : "text-blue-600"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {post.investmentActivityResponseDTO.actionType.toUpperCase() ===
                            "BUY" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 4v16m8-8H4"
                              />
                            ) : post.investmentActivityResponseDTO.actionType.toUpperCase() ===
                              "SELL" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 12H4"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5l7 7-7 7"
                              />
                            )}
                          </svg>
                        </div>
                      </div>

                      {/* Action Description */}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-[#1D1D1F] font-medium">
                            {getActionMessage(
                              post.investmentActivityResponseDTO.actionType,
                              post.investmentActivityResponseDTO.stockSymbol ||
                                post.stockSymbol,
                              post.investmentActivityResponseDTO.stockName ||
                                post.stockSymbol,
                              post.investmentActivityResponseDTO
                                .old_position_weight,
                              post.investmentActivityResponseDTO
                                .new_position_weight
                            )}
                          </span>

                          {/* Stock Info */}
                          <div className="flex items-center ml-2">
                            <div className="relative h-5 w-5 rounded-md overflow-hidden bg-white shadow-sm mr-1">
                              <Image
                                src={getStockLogo(post.stockSymbol)}
                                alt={post.stockSymbol}
                                fill
                                className="object-contain p-0.5"
                              />
                            </div>
                            <span className="font-semibold text-[#1D1D1F]">
                              ${post.stockSymbol}
                            </span>
                          </div>
                        </div>

                        {/* Position Details */}
                        <div className="text-sm text-[#6E6E73] mt-1">
                          {/* Position details now included in the action message */}
                        </div>
                      </div>

                      {/* Portfolio Link */}
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
                  <div className="flex items-center gap-6 mt-4">
                    <button
                      className={`flex items-center gap-2 text-sm ${
                        likedPosts[post.id]
                          ? "text-[#0071E3]"
                          : "text-[#6E6E73] hover:text-[#0071E3]"
                      } transition-colors`}
                      onClick={() => handleLikeAction(post.id)}
                      disabled={isLikeActionPending[post.id]}
                    >
                      <svg
                        className={`w-5 h-5 ${isLikeActionPending[post.id] ? "animate-pulse" : ""}`}
                        fill={likedPosts[post.id] ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      <span>{likeCounts[post.id] || post.likeCount || 0}</span>
                    </button>
                    <button
                      className="flex items-center gap-2 text-sm text-[#6E6E73] hover:text-[#0071E3] transition-colors"
                      onClick={() => toggleExpand(post.id)}
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>
                        {commentCounts[post.id] || post.commentCount || 0}
                      </span>
                    </button>
                    <div className="relative">
                      <SharePostButton post={post} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments section (expandable) */}
              <AnimatePresence>
                {expandedPostId === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 pt-4 border-t border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Text className="font-medium text-[#1D1D1F]">
                        Comments
                      </Text>
                      <button
                        onClick={() => setExpandedPostId(null)}
                        className="text-sm text-[#6E6E73] hover:text-[#1D1D1F]"
                      >
                        Close
                      </button>
                    </div>

                    <CommentsSection
                      postId={post.id}
                      commentCount={
                        commentCounts[post.id] || post.commentCount || 0
                      }
                      setCommentsCount={setCommentCounts}
                      formatExactDate={formatExactDate}
                      formatRelativeTime={formatRelativeTime}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
