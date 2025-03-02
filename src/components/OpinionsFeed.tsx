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
        <div className={`${baseClasses} bg-red-50/80`}>
          <svg
            className="w-5 h-5 text-red-600"
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
    default:
      return null;
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
  const [feed, setFeed] = useState<FeedItem[]>(
    activeTab === "for-you" ? forYouFeed : followingFeed
  );
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [likedComments, setLikedComments] = useState<string[]>([]);

  useEffect(() => {
    setFeed(activeTab === "for-you" ? forYouFeed : followingFeed);
  }, [activeTab]);

  const toggleComments = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedComments((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleCommentLike = (commentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setLikedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  // Updated to return human-readable dates
  const formatDate = (date: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day}`;
  };

  const togglePostLike = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="space-y-6">
      {feed.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <Link
            href={`/portfolio/${item.portfolioId}`}
            className="block p-6 hover:bg-gray-50/50 transition-colors duration-200"
          >
            {/* User and Action Header */}
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                <Image
                  src={item.user.avatar}
                  alt={item.user.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* User Info and Timestamp */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-[#1D1D1F]">
                      {item.user.name}
                    </div>
                    <div className="text-sm text-[#6E6E73]">
                      @{item.user.username}
                    </div>
                  </div>
                  <div className="text-sm text-[#6E6E73]">
                    {formatDate(item.timestamp)}
                  </div>
                </div>

                {/* Simplified Action Section with Better Clarity */}
                <div className="border border-gray-100 rounded-xl p-3 mb-4">
                  <div className="flex items-center">
                    {/* Action Type Icon */}
                    <div className="mr-3">
                      <ActionIcon type={item.action.type} />
                    </div>

                    {/* Action Description */}
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-[#1D1D1F] font-medium">
                          {item.action.type === "buy"
                            ? "Bought"
                            : item.action.type === "sell"
                              ? "Sold"
                              : item.action.type === "increase"
                                ? "Increased position in"
                                : item.action.type === "decrease"
                                  ? "Decreased position in"
                                  : item.action.type === "start"
                                    ? "Started position in"
                                    : "Exited position in"}
                        </span>

                        {/* Stock Info */}
                        <div className="flex items-center ml-2">
                          <div className="relative h-5 w-5 rounded-md overflow-hidden bg-white border border-gray-100 mr-1">
                            <Image
                              src={item.action.stockLogo}
                              alt={item.action.stock}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                          <span className="font-semibold text-[#1D1D1F]">
                            ${item.action.stock}
                          </span>
                        </div>
                      </div>

                      {/* Position Details - Only show if relevant */}
                      {(item.action.type === "increase" ||
                        item.action.type === "decrease") && (
                        <div className="text-sm text-[#6E6E73] mt-1">
                          Changed from{" "}
                          <span className="font-medium">
                            {item.action.oldPosition}%
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {item.action.newPosition}%
                          </span>{" "}
                          of portfolio
                        </div>
                      )}
                      {item.action.type === "buy" &&
                        item.action.newPosition && (
                          <div className="text-sm text-[#6E6E73] mt-1">
                            New position:{" "}
                            <span className="font-medium">
                              {item.action.newPosition}%
                            </span>{" "}
                            of portfolio
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Note */}
                {item.note && (
                  <div className="text-[#1D1D1F] mb-4 text-base">
                    {item.note}
                  </div>
                )}

                {/* Interaction Buttons */}
                <div className="flex items-center gap-6 mt-4">
                  <button
                    onClick={(e) => togglePostLike(item.id, e)}
                    className="flex items-center gap-2 text-sm text-[#6E6E73] hover:text-[#0071E3] transition-colors duration-200"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        likedPosts.includes(item.id)
                          ? "text-[#0071E3] fill-[#0071E3]"
                          : "text-[#6E6E73]"
                      }`}
                      fill="none"
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
                    <span>
                      {likedPosts.includes(item.id)
                        ? item.likes + 1
                        : item.likes}
                    </span>
                  </button>

                  <button
                    onClick={(e) => toggleComments(item.id, e)}
                    className="flex items-center gap-2 text-sm text-[#6E6E73] hover:text-[#0071E3] transition-colors duration-200"
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
                    <span>{item.comments.length}</span>
                  </button>

                  <button className="flex items-center gap-2 text-sm text-[#6E6E73] hover:text-[#0071E3] transition-colors duration-200">
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
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {expandedComments.includes(item.id) &&
                item.comments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 pt-4 border-t border-gray-100"
                  >
                    <div className="space-y-4">
                      {item.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="relative h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                            <Image
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium text-sm text-[#1D1D1F]">
                                {comment.user.name}
                              </div>
                              <div className="text-xs text-[#6E6E73]">
                                {formatDate(comment.timestamp)}
                              </div>
                            </div>
                            <div className="text-sm text-[#1D1D1F]">
                              {comment.text}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={(e) =>
                                  toggleCommentLike(comment.id, e)
                                }
                                className="flex items-center gap-1 text-xs text-[#6E6E73] hover:text-[#0071E3] transition-colors duration-200"
                              >
                                <svg
                                  className={`w-4 h-4 ${
                                    likedComments.includes(comment.id)
                                      ? "text-[#0071E3] fill-[#0071E3]"
                                      : "text-[#6E6E73]"
                                  }`}
                                  fill="none"
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
                                <span>
                                  {likedComments.includes(comment.id)
                                    ? comment.likes + 1
                                    : comment.likes}
                                </span>
                              </button>
                              <button className="text-xs text-[#6E6E73] hover:text-[#0071E3] transition-colors duration-200">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comment Input */}
                    <div className="mt-4 flex gap-3">
                      <div className="relative h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <Image
                          src="https://sametsahin.com/images/new-pp.jpeg"
                          alt="Your avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="w-full py-2 px-4 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 font-medium text-sm">
                          Post
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </Link>
        </motion.div>
      ))}

      {feed.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#6E6E73] mb-2">No opinions yet</div>
          <div className="text-sm text-[#6E6E73]">
            {activeTab === "for-you"
              ? "Check back later for personalized opinions"
              : "Follow more investors to see their opinions"}
          </div>
        </div>
      )}
    </div>
  );
}
