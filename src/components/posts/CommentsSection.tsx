import React, { useState, useEffect, useRef } from "react";
import { Text } from "@tremor/react";
import Link from "next/link";
import {
  getPostComments,
  createComment,
  deleteComment,
  Comment,
} from "@/services/socialService";
import { toast } from "react-hot-toast";
import Avatar from "@/components/Avatar";
import { formatExactDate, formatRelativeTime } from "./PostCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface CommentsSectionProps {
  postId: number;
  commentCount: number;
  onCommentCountUpdate: (count: number) => void;
}

export default function CommentsSection({
  postId,
  commentCount,
  onCommentCountUpdate,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Check if current user is logged in
  const currentUsername = localStorage.getItem("username");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await getPostComments(postId);

      if (response.status === "success" && response.data) {
        // Debug: Log raw comments
        console.log("Raw comments from API:", response.data);

        // Map API response to Comment objects with proper structure
        const formattedComments = response.data.map((comment: any) => {
          // Get content field, handling different API formats
          const commentContent = comment.content || comment.comment || "";

          // Debug log each comment before processing
          console.log("Processing comment:", comment, "ID:", comment.id);

          // If the comment is from the old format (without userDTO), transform it
          if (!comment.userDTO && comment.username) {
            return {
              id: comment.id, // Use the original comment ID, don't generate random one
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

        // Filter out any comments without valid IDs
        const validComments = formattedComments.filter((comment) => {
          const isValid = comment.id !== undefined && comment.id !== null;
          if (!isValid) {
            console.warn("Invalid comment found:", comment);
          }
          return isValid;
        });

        if (validComments.length !== formattedComments.length) {
          console.warn(
            `Filtered out ${formattedComments.length - validComments.length} comments with invalid IDs`
          );
          console.log("Valid comments:", validComments);
        }

        setComments(validComments);
        onCommentCountUpdate(validComments.length);
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
      const response = await createComment({
        postId,
        comment: newComment,
      });

      if (response.status === "success") {
        // Clear the input field
        setNewComment("");

        // Success message
        toast.success(response.message || "Comment added successfully");

        // Update comment count
        onCommentCountUpdate(commentCount + 1);

        // Instead of refetching comments, add the new comment directly to the list
        // with the current user's information to avoid the "@user" placeholder
        // This ensures correct user info is displayed even before API refresh
        const currentTimestamp = new Date().toISOString();

        // Make sure we have a valid ID from the API response
        if (response.data && response.data.id) {
          // Create a new comment object with all required fields and the actual ID from API
          const newCommentObj: Comment = {
            id: response.data.id, // Use the actual ID from API response
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
        } else {
          // If we didn't get an ID back, it's safer to just refetch all comments
          fetchComments();
        }
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

  const handleDeleteComment = async () => {
    if (commentToDelete === null) return;

    try {
      const response = await deleteComment(commentToDelete);

      if (response.status === "success") {
        toast.success("Comment deleted successfully");

        // Remove comment from the list
        setComments(
          comments.filter((comment) => comment.id !== commentToDelete)
        );

        // Update comment count
        onCommentCountUpdate(commentCount - 1);
      } else {
        toast.error(response.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An error occurred while deleting the comment");
    } finally {
      setCommentToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((index) => (
          <div
            key={`comment-${index}`}
            className="bg-gray-50/60 p-3 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="w-32 h-4 bg-gray-200 rounded-md"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded-md"></div>
                </div>
                <div className="w-3/4 h-4 bg-gray-200 rounded-md mt-2"></div>
              </div>
            </div>
          </div>
        ))}
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
          {comments.map((comment, index) => {
            // Check if the current user is the comment owner
            const isOwnComment = comment.userDTO?.username === currentUsername;

            return (
              <div
                key={`comment-${comment.id}`}
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
                      <div className="flex items-center gap-2">
                        <div
                          className="text-xs text-[#6E6E73] cursor-help"
                          title={formatExactDate(comment.createdAt)}
                        >
                          {formatRelativeTime(comment.createdAt)}
                        </div>

                        {isOwnComment && (
                          <button
                            onClick={() => {
                              // Only set the comment ID if it's defined
                              if (
                                comment.id !== undefined &&
                                comment.id !== null
                              ) {
                                console.log(
                                  "Setting comment to delete:",
                                  comment.id
                                );
                                setCommentToDelete(comment.id);
                              } else {
                                console.error(
                                  "Cannot delete comment: ID is undefined"
                                );
                                toast.error(
                                  "Cannot delete comment: ID is missing"
                                );
                              }
                            }}
                            className="text-[#6E6E73] hover:text-red-500 transition-colors"
                            title="Delete comment"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[#1D1D1F] mt-1 whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={commentToDelete !== null}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </div>
  );
}
