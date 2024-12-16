import Image from "next/image";
import Link from "next/link";
import { Card } from "@tremor/react";
import { useState } from "react";

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
            "https://media.licdn.com/dms/image/D4D03AQFGs29qS6A3gg/profile-displayphoto-shrink_200_200/0/1706555428746?e=2147483647&v=beta&t=-VKVt7rkB_K8yNbqZ6l8uAIGJE67rdSBCZOKlgHp6lo",
        },
        text: "But what about AI, Warren? Have you heard about our lord and savior ChatGPT? 🤖",
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
        text: "Here we go again with the doom predictions 🙄",
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
  switch (type) {
    case "buy":
    case "increase":
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-green-600"
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
        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-red-600"
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
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-blue-600"
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
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-gray-600"
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

  return (
    <div className="space-y-6">
      {feed.map((item) => (
        <Card key={item.id} className="bg-white p-4">
          <div className="flex gap-4">
            {/* Action Icon */}
            <ActionIcon type={item.action.type} />

            {/* Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between">
                <Link
                  href={`/portfolios/${item.user.username}`}
                  className="inline-flex items-center gap-2 group"
                >
                  <div className="relative h-5 w-5 rounded-full overflow-hidden">
                    <Image
                      src={item.user.avatar}
                      alt={item.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-gray-700">
                    {item.user.name}
                  </span>
                  <span className="text-gray-500">@{item.user.username}</span>
                </Link>
                <span className="text-sm text-gray-500">
                  {formatTimeAgo(item.timestamp)}
                </span>
              </div>

              {/* Action */}
              <Link
                href={`/portfolios/${item.user.username}/${item.portfolioId}`}
                className="mt-2 flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700"
              >
                <div className="relative h-4 w-4">
                  <Image
                    src={item.action.stockLogo}
                    alt={item.action.stock}
                    fill
                    className="object-contain"
                  />
                </div>
                {getActionText(item.action)}
              </Link>

              {/* Note */}
              {item.note && (
                <p className="mt-3 text-gray-900 text-lg">{item.note}</p>
              )}

              {/* Footer */}
              <div className="mt-4 flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-sm">{item.likes}</span>
                </button>
                <button
                  onClick={(e) => toggleComments(item.id, e)}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
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
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-sm">
                    {item.comments.length}{" "}
                    {expandedPosts.has(item.id) ? "Hide" : "Show"}
                  </span>
                </button>
              </div>

              {/* Comments */}
              {expandedPosts.has(item.id) && item.comments.length > 0 && (
                <div className="mt-4 space-y-3 border-t pt-3">
                  {item.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <div className="relative h-5 w-5 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {comment.user.name}
                          </span>
                          <span className="text-gray-500 text-sm">
                            @{comment.user.username}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{comment.text}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={(e) => toggleCommentLike(comment.id, e)}
                            className="flex items-center gap-1 text-sm transition-colors duration-200"
                          >
                            {likedComments.has(comment.id) ? (
                              <>
                                <svg
                                  className="w-4 h-4 text-red-500"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="text-red-500">
                                  {comment.likes + 1}
                                </span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 text-gray-500 hover:text-red-500"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                                <span className="text-gray-500 hover:text-red-500">
                                  {comment.likes}
                                </span>
                              </>
                            )}
                          </button>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">
                            {formatTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
