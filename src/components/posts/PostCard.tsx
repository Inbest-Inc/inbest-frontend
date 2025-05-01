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

// Helper function to get the right icon for different action types
export const getActionIcon = (actionType: string) => {
  switch (actionType?.toLowerCase()) {
    case "buy":
    case "purchased":
      return (
        <div className="p-2 bg-green-50 text-green-600 rounded-full">
          <svg
            className="w-4 h-4"
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
    case "sell":
    case "sold":
      return (
        <div className="p-2 bg-red-50 text-red-600 rounded-full">
          <svg
            className="w-4 h-4"
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
        <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      );
  }
};

// Helper to get an action message based on the action type
export const getActionMessage = (
  actionType: string,
  symbol: string,
  newWeight?: number
) => {
  const formatPercent = (value?: number) => {
    if (value === undefined || value === null) return "";
    return ` (${(value * 100).toFixed(1)}% of portfolio)`;
  };

  switch (actionType?.toLowerCase()) {
    case "buy":
    case "purchased":
      return `Purchased ${symbol}${formatPercent(newWeight)}`;
    case "sell":
    case "sold":
      return `Sold ${symbol}${formatPercent(newWeight)}`;
    default:
      return `Updated ${symbol} position${formatPercent(newWeight)}`;
  }
};

// Helper to get stock logo
export const getStockLogo = (symbol: string) => {
  return `https://assets.parqet.com/logos/symbol/${symbol}?format=svg`;
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
