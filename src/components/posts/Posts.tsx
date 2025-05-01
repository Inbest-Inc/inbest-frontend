import React, { useState, useEffect } from "react";
import { Card, Text } from "@tremor/react";
import { motion } from "framer-motion";
import {
  getUserPosts,
  getUserPostsByUsername,
  getPortfolioPosts,
  getAllPosts,
  getFollowedPosts,
  Post,
} from "@/services/socialService";
import PostCard from "./PostCard";

interface PostsProps {
  username?: string;
  isOwnProfile?: boolean;
  portfolioId?: string | number;
  view?: "forYou" | "followed";
}

export default function Posts({
  username,
  isOwnProfile = false,
  portfolioId,
  view,
}: PostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [username, isOwnProfile, portfolioId, view]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;

      if (view === "forYou") {
        // For the "For You" tab in the Opinions page
        response = await getAllPosts();
      } else if (view === "followed") {
        // For the "Following" tab in the Opinions page
        response = await getFollowedPosts();
      } else if (portfolioId) {
        // If portfolioId is provided, fetch posts for that portfolio
        response = await getPortfolioPosts(portfolioId);
      } else if (isOwnProfile || !username) {
        response = await getUserPosts();
      } else {
        response = await getUserPostsByUsername(username);
      }

      // If response is success but data is empty array, just set posts to empty array without error
      if (response.status === "success") {
        // Ensure all posts have a valid liked field
        const processedPosts = (response.data || []).map((post) => ({
          ...post,
          liked: post.liked === true, // Ensure it's a boolean
        }));

        setPosts(processedPosts);
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

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            className="bg-white/60 backdrop-blur-md p-5 ring-1 ring-black/[0.04] shadow-sm rounded-2xl"
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
            {view === "followed"
              ? "Failed to load followed posts"
              : "Failed to load posts"}
          </Text>
          <Text className="text-gray-500 text-center">
            We couldn't load the content. Please try again later.
          </Text>
          <button
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            onClick={fetchPosts}
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-md p-6 ring-1 ring-black/[0.04] shadow-sm rounded-2xl">
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
              : view === "forYou"
                ? "Explore more content and check back soon for investment updates."
                : portfolioId
                  ? "This portfolio doesn't have any posts yet."
                  : isOwnProfile
                    ? "Share your first investment insight to see it here!"
                    : "No content available at this time."}
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onPostDeleted={handlePostDeleted}
          isStandalone={true}
        />
      ))}
    </div>
  );
}
