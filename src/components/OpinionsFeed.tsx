import Image from "next/image";
import Link from "next/link";
import { Card, Text } from "@tremor/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  timestamp: Date;
  likes: number;
}

interface FeedItem {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  portfolioId: string;
  action: {
    type: "buy" | "sell" | "increase" | "decrease" | "start" | "exit";
    stock: string;
    stockLogo: string;
    oldPosition?: number;
    newPosition?: number;
  };
  note?: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

// Helper function to get stock logo URL
const getStockLogo = (symbol: string) => {
  return `https://assets.parqet.com/logos/symbol/${symbol}?format=svg`;
};

const forYouFeed: FeedItem[] = [
  {
    id: "1",
    user: {
      name: "Warren Buffett",
      username: "warrenbuffett",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfPqLD2DHAh-b4RqasJvR4SOHB_JNAq-wuRA&s",
    },
    portfolioId: "value-investing",
    action: {
      type: "increase",
      stock: "AAPL",
      stockLogo: getStockLogo("AAPL"),
      oldPosition: 35.5,
      newPosition: 45.2,
    },
    note: "As I always say: Be fearful when others are greedy, and greedy when others are fearful 🍎",
    timestamp: new Date("2024-03-18T10:30:00"),
    likes: 15342,
    comments: [
      {
        id: "c1",
        user: {
          name: "Mehmet Kocyigit",
          username: "kocyigit",
          avatar:
            "https://media.licdn.com/dms/image/v2/D4D03AQHeqaS39F_X9Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1731703909704?e=2147483647&v=beta&t=FfYf_MXcsLFkWRKQqrJSGEQ6uqRSCw_BpnXuADqrEJY",
        },
        text: "But what about AI, Warren? Have you ever tried ChatGPT? 🤖",
        timestamp: new Date("2024-03-18T10:35:00"),
        likes: 892,
      },
      {
        id: "c2",
        user: {
          name: "Ercan Uchar",
          username: "ctisadmin",
          avatar:
            "https://pbs.twimg.com/profile_images/1316982158578298880/BRoYwo1W_400x400.jpg",
        },
        text: "Another bubble. See you at $50 👀",
        timestamp: new Date("2024-03-18T10:40:00"),
        likes: 1563,
      },
    ],
  },
  {
    id: "2",
    user: {
      name: "Cuneyt Sevgi",
      username: "stockpro1",
      avatar: "https://i.ytimg.com/vi/YEbCfWsTZpo/hqdefault.jpg",
    },
    portfolioId: "ark-innovation",
    action: {
      type: "buy",
      stock: "NVDA",
      stockLogo: getStockLogo("NVDA"),
      newPosition: 12.5,
    },
    note: "AI will be bigger than the internet. Loading up on $NVDA 🚀",
    timestamp: new Date("2024-03-18T09:15:00"),
    likes: 8891,
    comments: [
      {
        id: "c3",
        user: {
          name: "Mehmet Timsek",
          username: "hazineningulu",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBgTAXz-EbpmyMVUcrO6ra6DolsQxJaF11uA&s",
        },
        text: "Have you considered adding some risk parity to your portfolio? 📊",
        timestamp: new Date("2024-03-18T09:20:00"),
        likes: 445,
      },
    ],
  },
  {
    id: "3",
    user: {
      name: "Samet Sahin",
      username: "samet",
      avatar: "https://sametsahin.com/images/new-pp.jpeg",
    },
    portfolioId: "tech-growth",
    action: {
      type: "start",
      stock: "MSFT",
      stockLogo: getStockLogo("MSFT"),
    },
    note: "Copilot is the future of coding. Time to bet on Satya 💻",
    timestamp: new Date("2024-03-17T15:20:00"),
    likes: 2069,
    comments: [
      {
        id: "c4",
        user: {
          name: "Bill Gates",
          username: "billgates",
          avatar:
            "https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg",
        },
        text: "Good choice! But I might be biased 😉",
        timestamp: new Date("2024-03-17T15:25:00"),
        likes: 5678,
      },
    ],
  },
];

const followingFeed: FeedItem[] = [
  {
    id: "f1",
    user: {
      name: "Mert Gunes",
      username: "skraatz416",
      avatar:
        "https://pbs.twimg.com/profile_images/965317696639459328/pRPM9a9H_400x400.jpg",
    },
    portfolioId: "big-short",
    action: {
      type: "sell",
      stock: "TSLA",
      stockLogo: getStockLogo("TSLA"),
      oldPosition: 5.2,
      newPosition: 0,
    },
    note: "Overvalued. Reminds me of 2008, but worse 🎯",
    timestamp: new Date("2024-10-18T14:00:00"),
    likes: 2,
    comments: [
      {
        id: "fc1",
        user: {
          name: "Sude Akarcay",
          username: "pm",
          avatar: "https://i.ytimg.com/vi/m0XpDRhnTN8/maxresdefault.jpg",
        },
        text: "Are you sure about that? 🤔 Because I'm not sure about that. If you are sure about that, please make me be sure about that. 🤔",
        timestamp: new Date("2024-10-18T14:05:00"),
        likes: 1,
      },
    ],
  },
  {
    id: "f2",
    user: {
      name: "Mert Gunes",
      username: "skraatz416",
      avatar:
        "https://pbs.twimg.com/profile_images/965317696639459328/pRPM9a9H_400x400.jpg",
    },
    portfolioId: "big-short",
    action: {
      type: "start",
      stock: "AMZN",
      stockLogo: getStockLogo("AMZN"),
      oldPosition: 5.2,
      newPosition: 0,
    },
    note: "Amazon is a monopoly. It's not going anywhere 🚀",
    timestamp: new Date("2024-02-18T14:00:00"),
    likes: 13,
    comments: [],
  },
  {
    id: "f3",
    user: {
      name: "Mert Gunes",
      username: "skraatz416",
      avatar:
        "https://pbs.twimg.com/profile_images/965317696639459328/pRPM9a9H_400x400.jpg",
    },
    portfolioId: "big-short",
    action: {
      type: "buy",
      stock: "GOOG",
      stockLogo: getStockLogo("GOOG"),
      oldPosition: 5.2,
      newPosition: 0,
    },
    note: "I tried ChatGPT search, Google should not be scared 🤣",
    timestamp: new Date("2024-02-18T14:00:00"),
    likes: 13,
    comments: [],
  },
];

const ActionIcon = ({ type }: { type: FeedItem["action"]["type"] }) => {
  const baseClasses =
    "h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-sm";
  switch (type) {
    case "buy":
    case "increase":
      return (
        <div className={`${baseClasses} bg-emerald-50/80`}>
          <svg
            className="w-5 h-5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>
      );
    case "sell":
    case "decrease":
      return (
        <div className={`${baseClasses} bg-rose-50/80`}>
          <svg
            className="w-5 h-5 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      );
    case "start":
      return (
        <div className={`${baseClasses} bg-blue-50/80`}>
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      );
    case "exit":
      return (
        <div className={`${baseClasses} bg-gray-50/80`}>
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
  }
};

const getActionText = (action: FeedItem["action"]) => {
  const stockSymbol = `$${action.stock}`;
  switch (action.type) {
    case "buy":
      return `bought ${stockSymbol}`;
    case "sell":
      return `sold ${stockSymbol}`;
    case "increase":
      return `increased ${stockSymbol} position from ${action.oldPosition}% to ${action.newPosition}%`;
    case "decrease":
      return `decreased ${stockSymbol} position from ${action.oldPosition}% to ${action.newPosition}%`;
    case "start":
      return `started a new position in ${stockSymbol}`;
    case "exit":
      return `exited position in ${stockSymbol}`;
  }
};

interface OpinionsFeedProps {
  activeTab: "for-you" | "following";
}

export default function OpinionsFeed({ activeTab }: OpinionsFeedProps) {
  const feed = activeTab === "for-you" ? forYouFeed : followingFeed;
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const toggleComments = (postId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any parent click events
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const toggleCommentLike = (commentId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any parent click events
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo`;
  };

  const togglePostLike = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="bg-white/60 backdrop-blur-sm p-4 ring-1 ring-black/[0.04] shadow-sm rounded-2xl"
          >
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-gray-100/80 animate-pulse backdrop-blur-sm ring-1 ring-black/[0.04]" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gray-100/80 animate-pulse backdrop-blur-sm ring-1 ring-black/[0.04]" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-100/80 rounded animate-pulse backdrop-blur-sm ring-1 ring-black/[0.04]" />
                        <div className="h-3 w-16 bg-gray-100/80 rounded animate-pulse backdrop-blur-sm ring-1 ring-black/[0.04]" />
                      </div>
                    </div>
                    <div className="h-8 w-32 bg-gray-100/80 rounded-xl animate-pulse backdrop-blur-sm ring-1 ring-black/[0.04]" />
                  </div>
                </div>
                <div className="h-6 w-3/4 bg-gray-100/80 rounded animate-pulse backdrop-blur-sm ring-1 ring-black/[0.04]" />
                <div className="flex gap-4">
                  <div className="h-7 w-16 bg-gray-100/80 rounded-full animate-pulse backdrop-blur-sm ring-1 ring-black/[0.04]" />
                  <div className="h-7 w-16 bg-gray-100/80 rounded-full animate-pulse backdrop-blur-sm ring-1 ring-black/[0.04]" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feed.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm p-4 hover:bg-white transition-all duration-300 ring-1 ring-black/[0.04] shadow-sm hover:shadow-md rounded-2xl">
            <div className="flex gap-4">
              {/* Action Icon */}
              <ActionIcon type={item.action.type} />

              {/* Content */}
              <div className="flex-1 space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link
                      href={`/${item.user.username}`}
                      className="group flex items-center gap-3 flex-shrink-0"
                    >
                      <div className="relative h-8 w-8 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                        <Image
                          src={item.user.avatar}
                          alt={item.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <Text className="font-medium text-[#1D1D1F] group-hover:text-blue-600 transition-colors duration-200">
                          {item.user.name}
                        </Text>
                        <Text className="text-sm text-[#6E6E73]">
                          @{item.user.username}
                        </Text>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50/80 backdrop-blur-sm rounded-xl text-sm text-[#1D1D1F] flex-shrink-0 ring-1 ring-black/[0.04] hover:bg-gray-100/80 transition-colors duration-200">
                      <div className="relative h-4 w-4 rounded-md overflow-hidden ring-1 ring-black/[0.04]">
                        <Image
                          src={item.action.stockLogo}
                          alt={item.action.stock}
                          fill
                          className="object-contain"
                        />
                      </div>
                      {getActionText(item.action)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors duration-200"
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </motion.button>
                    <Text className="text-sm text-[#6E6E73]">
                      {formatTimeAgo(item.timestamp)}
                    </Text>
                  </div>
                </div>

                {/* Note */}
                {item.note && (
                  <Text className="text-[17px] leading-[22px] text-[#1D1D1F]">
                    {item.note}
                  </Text>
                )}

                {/* Footer */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={(e) => togglePostLike(item.id, e)}
                    className="flex items-center gap-2 group"
                  >
                    <div
                      className={`h-7 w-7 rounded-full ${
                        likedPosts.has(item.id)
                          ? "bg-rose-50/80"
                          : "bg-gray-50/80"
                      } backdrop-blur-sm flex items-center justify-center transition-colors duration-200 ring-1 ring-black/[0.04] group-hover:bg-rose-50/80`}
                    >
                      <motion.svg
                        animate={
                          likedPosts.has(item.id) ? { scale: [1, 1.2, 1] } : {}
                        }
                        className={`w-4 h-4 ${
                          likedPosts.has(item.id)
                            ? "text-[#FF3B30]"
                            : "text-[#6E6E73] group-hover:text-[#FF3B30]"
                        } transition-colors duration-200`}
                        viewBox="0 0 24 24"
                        fill={likedPosts.has(item.id) ? "currentColor" : "none"}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </motion.svg>
                    </div>
                    <motion.span
                      animate={
                        likedPosts.has(item.id) ? { scale: [1, 1.2, 1] } : {}
                      }
                      className={`text-sm font-medium ${
                        likedPosts.has(item.id)
                          ? "text-[#FF3B30]"
                          : "text-[#6E6E73] group-hover:text-[#FF3B30]"
                      } transition-colors duration-200`}
                    >
                      {likedPosts.has(item.id) ? item.likes + 1 : item.likes}
                    </motion.span>
                  </button>

                  <button
                    onClick={(e) => toggleComments(item.id, e)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="h-7 w-7 rounded-full bg-gray-50/80 backdrop-blur-sm group-hover:bg-blue-50/80 flex items-center justify-center transition-colors duration-200 ring-1 ring-black/[0.04]">
                      <svg
                        className="w-4 h-4 text-[#6E6E73] group-hover:text-blue-600 transition-colors duration-200"
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
                    </div>
                    <span className="text-sm font-medium text-[#6E6E73] group-hover:text-blue-600 transition-colors duration-200">
                      {item.comments.length}
                    </span>
                  </button>

                  {/* Sentiment Indicator */}
                  {item.likes > 1000 && (
                    <div className="ml-auto flex items-center gap-2 px-2 py-1 rounded-full bg-[#00A852]/[0.08] backdrop-blur-sm ring-1 ring-[#00A852]/[0.08]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00A852]"></div>
                      <span className="text-xs font-medium text-[#00A852]">
                        Trending
                      </span>
                    </div>
                  )}
                </div>

                {/* Comments */}
                <AnimatePresence>
                  {expandedPosts.has(item.id) && item.comments.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 border-t border-black/[0.06] pt-3"
                    >
                      {item.comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-3 group"
                        >
                          <div className="relative h-6 w-6 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-black/[0.08]">
                            <Image
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 bg-gray-50/80 backdrop-blur-sm group-hover:bg-gray-100/80 rounded-xl p-3 transition-colors duration-200 ring-1 ring-black/[0.04]">
                            <div className="flex items-center gap-2">
                              <Text className="font-medium text-[#1D1D1F]">
                                {comment.user.name}
                              </Text>
                              <Text className="text-sm text-[#6E6E73]">
                                @{comment.user.username}
                              </Text>
                              <Text className="text-[#6E6E73] text-xs">•</Text>
                              <Text className="text-[#6E6E73] text-xs">
                                {formatTimeAgo(comment.timestamp)}
                              </Text>
                            </div>
                            <Text className="text-[15px] leading-[20px] text-[#1D1D1F]">
                              {comment.text}
                            </Text>
                            <button
                              onClick={(e) => toggleCommentLike(comment.id, e)}
                              className="mt-1 flex items-center gap-1.5 group/like"
                            >
                              <svg
                                className={`w-3.5 h-3.5 ${
                                  likedComments.has(comment.id)
                                    ? "text-[#FF3B30]"
                                    : "text-[#6E6E73] group-hover/like:text-[#FF3B30]"
                                } transition-colors duration-200`}
                                viewBox="0 0 24 24"
                                fill={
                                  likedComments.has(comment.id)
                                    ? "currentColor"
                                    : "none"
                                }
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              <span
                                className={`text-xs ${
                                  likedComments.has(comment.id)
                                    ? "text-[#FF3B30]"
                                    : "text-[#6E6E73] group-hover/like:text-[#FF3B30]"
                                } transition-colors duration-200`}
                              >
                                {likedComments.has(comment.id)
                                  ? comment.likes + 1
                                  : comment.likes}
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}

      {/* End of feed indicator */}
      <div className="pt-4 pb-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50/80 backdrop-blur-sm ring-1 ring-black/[0.04]">
          <div className="w-1 h-1 rounded-full bg-[#6E6E73]/30" />
          <span className="text-sm text-[#6E6E73] font-medium">
            {activeTab === "for-you" ? "You're all caught up" : "End of feed"}
          </span>
          <div className="w-1 h-1 rounded-full bg-[#6E6E73]/30" />
        </div>
      </div>
    </div>
  );
}
