import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Text } from "@tremor/react";
import { motion } from "framer-motion";
import {
  getUserPosts,
  getUserPostsByUsername,
  getPortfolioPosts,
  getAllPosts,
  getFollowedPosts,
  getTrendingPosts,
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Function to fetch initial posts
  const fetchPosts = async (resetState = true) => {
    if (resetState) {
      setIsLoading(true);
      setError(null);
      setPosts([]);
      setCurrentPage(1);
      setHasNextPage(true);
    }

    try {
      let response;

      if (view === "forYou") {
        // For the "For You" tab in the Opinions page, use the new trending endpoint with pagination
        const trendingResponse = await getTrendingPosts(1);

        if (trendingResponse.status === "success") {
          // Set pagination state
          setTotalPages(trendingResponse.totalPages);
          setHasNextPage(trendingResponse.nextPage !== null);

          // Ensure all posts have a valid liked field
          const processedPosts = (trendingResponse.data || []).map((post) => ({
            ...post,
            liked: post.liked === true, // Ensure it's a boolean
          }));

          setPosts(processedPosts);
        } else {
          setError(trendingResponse.message || "Failed to load trending posts");
        }
      } else if (view === "followed") {
        // For the "Following" tab in the Opinions page
        response = await getFollowedPosts();

        if (response.status === "success") {
          // Ensure all posts have a valid liked field
          const processedPosts = (response.data || []).map((post) => ({
            ...post,
            liked: post.liked === true, // Ensure it's a boolean
          }));

          setPosts(processedPosts);
        } else {
          setError(response.message || "Failed to load posts");
        }
      } else if (portfolioId) {
        // If portfolioId is provided, fetch posts for that portfolio
        response = await getPortfolioPosts(portfolioId);

        if (response.status === "success") {
          // Ensure all posts have a valid liked field
          const processedPosts = (response.data || []).map((post) => ({
            ...post,
            liked: post.liked === true, // Ensure it's a boolean
          }));

          setPosts(processedPosts);
        } else {
          setError(response.message || "Failed to load posts");
        }
      } else if (isOwnProfile || !username) {
        response = await getUserPosts();

        if (response.status === "success") {
          // Ensure all posts have a valid liked field
          const processedPosts = (response.data || []).map((post) => ({
            ...post,
            liked: post.liked === true, // Ensure it's a boolean
          }));

          setPosts(processedPosts);
        } else {
          setError(response.message || "Failed to load posts");
        }
      } else {
        response = await getUserPostsByUsername(username);

        if (response.status === "success") {
          // Ensure all posts have a valid liked field
          const processedPosts = (response.data || []).map((post) => ({
            ...post,
            liked: post.liked === true, // Ensure it's a boolean
          }));

          setPosts(processedPosts);
        } else {
          setError(response.message || "Failed to load posts");
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load more posts for infinite scroll
  const loadMorePosts = async () => {
    // Only load more if we have a next page and we're not already loading
    if (!hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const nextPage = currentPage + 1;

      if (view === "forYou") {
        const trendingResponse = await getTrendingPosts(nextPage);

        if (trendingResponse.status === "success" && trendingResponse.data) {
          // Set pagination state
          setCurrentPage(nextPage);
          setTotalPages(trendingResponse.totalPages);
          setHasNextPage(trendingResponse.nextPage !== null);

          // Ensure all posts have a valid liked field
          const processedPosts = (trendingResponse.data || []).map((post) => ({
            ...post,
            liked: post.liked === true, // Ensure it's a boolean
          }));

          // Append new posts to existing posts
          setPosts((prevPosts) => [...prevPosts, ...processedPosts]);
        } else {
          console.error("Failed to load more posts:", trendingResponse.message);
          setHasNextPage(false);
        }
      }
      // Other views don't support pagination yet
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Setup Intersection Observer for infinite scroll
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isLoadingMore) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            loadMorePosts();
          }
        },
        { rootMargin: "200px" } // Load more posts when we're 200px from the bottom
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, isLoadingMore, hasNextPage]
  );

  // Fetch posts on initial mount and when dependencies change
  useEffect(() => {
    fetchPosts();
    return () => {
      // Clean up observer on unmount
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [username, isOwnProfile, portfolioId, view]);

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
              ? "Sign in required for followed posts"
              : "Oops! Something went wrong"}
          </Text>
          <Text className="text-gray-500 text-center">
            {view === "followed"
              ? "You need to be signed in to view posts from accounts you follow."
              : "We're having trouble loading this content right now. Please try again in a moment."}
          </Text>
          <button
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            onClick={() => fetchPosts()}
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
      {posts.map((post, index) => {
        // If this is the last post and we have more pages, attach the ref for infinite scrolling
        if (
          index === posts.length - 1 &&
          view === "forYou" &&
          currentPage < totalPages
        ) {
          return (
            <div key={post.id} ref={lastPostRef}>
              <PostCard
                post={post}
                onPostDeleted={handlePostDeleted}
                isStandalone={true}
              />
            </div>
          );
        }
        return (
          <PostCard
            key={post.id}
            post={post}
            onPostDeleted={handlePostDeleted}
            isStandalone={true}
          />
        );
      })}

      {/* Loading indicator for fetching more posts */}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Hidden div at the bottom to trigger loading more posts */}
      {view === "forYou" && hasNextPage && !isLoadingMore && (
        <div ref={loadMoreRef} className="h-1 opacity-0"></div>
      )}
    </div>
  );
}
