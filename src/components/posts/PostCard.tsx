import React, { useState } from "react";
import { Card } from "@tremor/react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import {
  Post,
  likePost,
  unlikePost,
  deletePost,
} from "@/services/socialService";
import Avatar from "@/components/Avatar";
import CommentsSection from "@/components/posts/CommentsSection";
import PostShareButton from "@/components/posts/PostShareButton";
import DeleteConfirmationModal from "@/components/posts/DeleteConfirmationModal";
import { getStockLogo } from "../../utils/stockUtils";

// Helper functions to format dates
export const formatRelativeTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

export const formatExactDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

// Helper to get an icon based on the action type
export const getActionIcon = (actionType: string) => {
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

// Helper to get an action message based on the action type
export const getActionMessage = (
  actionType: string,
  symbol: string,
  name?: string,
  newWeight?: number,
  oldWeight?: number
) => {
  const stockName = name || symbol;

  const formatWeight = (weight?: number) => {
    if (weight === undefined || weight === null) return "0.0%";
    return `${(weight * 100).toFixed(1)}%`;
  };

  // Convert to uppercase and standardize action types
  const upperType = actionType.toUpperCase();

  // Use the same standardized action messages as in ShareActionModal
  if (upperType === "ADD" || upperType === "START" || upperType === "OPEN") {
    return `Started investing in ${stockName} (${symbol})`;
  } else if (upperType === "BUY" || upperType === "INCREASE") {
    if (oldWeight !== undefined) {
      return `Increased ${stockName} (${symbol}) position from ${formatWeight(oldWeight)} to ${formatWeight(newWeight)} of portfolio`;
    }
    return `Increased position in ${stockName} (${symbol})`;
  } else if (upperType === "CLOSE") {
    return `Closed position in ${stockName} (${symbol})`;
  } else if (upperType === "SELL" || upperType === "DECREASE") {
    if (newWeight === 0) {
      return `Closed position in ${stockName} (${symbol})`;
    }
    if (oldWeight !== undefined) {
      return `Reduced ${stockName} (${symbol}) position from ${formatWeight(oldWeight)} to ${formatWeight(newWeight)} of portfolio`;
    }
    return `Reduced position in ${stockName} (${symbol})`;
  }

  return `Updated ${stockName} (${symbol}) position`;
};

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: number) => void;
  isCommentsExpanded?: boolean;
  isStandalone?: boolean;
}

export default function PostCard({
  post,
  onPostDeleted,
  isCommentsExpanded = false,
  isStandalone = false,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(post.liked);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState<number>(
    post.commentCount || 0
  );
  const [isLikeActionPending, setIsLikeActionPending] =
    useState<boolean>(false);
  const [isCommentsOpen, setIsCommentsOpen] =
    useState<boolean>(isCommentsExpanded);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Check if current user is the post owner
  const currentUsername = localStorage.getItem("username");
  const isOwnPost = post.userDTO.username === currentUsername;

  const handleLikeAction = async () => {
    if (isLikeActionPending) return;
    setIsLikeActionPending(true);

    try {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? Math.max(0, prev - 1) : prev + 1));

      // Make API call
      const response = isLiked
        ? await unlikePost(post.id)
        : await likePost(post.id);

      if (response.status !== "success") {
        // Revert optimistic update on error
        setIsLiked(isLiked);
        setLikeCount((prev) => (isLiked ? prev : Math.max(0, prev - 1)));
        toast.error(response.message || "Failed to update like status");
      }
    } catch (error) {
      console.error("Error handling like action:", error);
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikeCount((prev) => (isLiked ? prev : Math.max(0, prev - 1)));
      toast.error(`Failed to ${isLiked ? "unlike" : "like"} post`);
    } finally {
      setIsLikeActionPending(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await deletePost(post.id);
      if (response.status === "success") {
        toast.success("Post deleted successfully");
        if (onPostDeleted) {
          onPostDeleted(post.id);
        }
      } else {
        toast.error(response.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/60 backdrop-blur-md p-5 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
          {/* Post header with user info and action buttons */}
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
            <div className="flex items-center gap-2">
              {isOwnPost && (
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 text-[#6E6E73] hover:text-red-500 transition-colors"
                  title="Delete post"
                  aria-label="Delete post"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
              <PostShareButton post={post} />
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
                    post.stockSymbol,
                    post.investmentActivityResponseDTO.stockName,
                    post.investmentActivityResponseDTO.new_position_weight,
                    post.investmentActivityResponseDTO.old_position_weight
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

          {/* Timestamps */}
          <div
            className="mb-4 text-xs text-[#6E6E73]"
            title={formatExactDate(post.createdAt)}
          >
            {formatRelativeTime(post.createdAt)}
          </div>

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

              <button
                className="flex items-center gap-2 text-[#6E6E73] hover:text-blue-600 transition-colors"
                onClick={() => setIsCommentsOpen(!isCommentsOpen)}
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
                <span className="text-sm font-medium">{commentCount}</span>
              </button>
            </div>

            {isStandalone && (
              <Link
                href={`/${post.userDTO.username}/posts/${post.id}`}
                className="text-[#6E6E73] hover:text-blue-600 transition-colors"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Comments section */}
          <AnimatePresence>
            {isCommentsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <CommentsSection
                  postId={post.id}
                  commentCount={commentCount}
                  onCommentCountUpdate={(count) => setCommentCount(count)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </>
  );
}
