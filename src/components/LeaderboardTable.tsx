"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./Table";

// Trophy icons for top 3
const TrophyGold = () => (
  <div className="h-8 w-8 rounded-full bg-yellow-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04]">
    <svg
      className="w-5 h-5 text-yellow-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  </div>
);

const TrophySilver = () => (
  <div className="h-8 w-8 rounded-full bg-gray-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04]">
    <svg
      className="w-5 h-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  </div>
);

const TrophyBronze = () => (
  <div className="h-8 w-8 rounded-full bg-amber-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04]">
    <svg
      className="w-5 h-5 text-amber-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  </div>
);

const UserPlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-1"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const leaderboardData = [
  {
    rank: 1,
    name: "You Know Who",
    username: "warrenbuffett",
    portfolioName: "Secret Portfolio",
    avatar:
      "https://img.freepik.com/premium-vector/yellow-light-bulb-with-smile-it_410516-80048.jpg",
    averageReturn: 52.4,
    ytdReturn: 18.7,
    holdings: 12,
    followers: 85000000,
  },
  {
    rank: 2,
    name: "Samet Sahin",
    username: "samet",
    portfolioName: "Tech Growth",
    avatar: "https://sametsahin.com/images/new-pp.jpeg",
    averageReturn: 48.2,
    ytdReturn: 22.3,
    holdings: 35,
    followers: 98234,
  },
  {
    rank: 3,
    name: "Enes Cakmak",
    username: "enes_cakmak_2003",
    portfolioName: "Gold and Silver",
    avatar:
      "https://media.licdn.com/dms/image/D4D03AQE3zS1U-n_r9A/profile-displayphoto-shrink_200_200/0/1716110426777?e=2147483647&v=beta&t=tU0lNTciq1IDw6eS_vgCzYoQu_ZLbAXsuhVf8zDjfOs",
    averageReturn: 45.7,
    ytdReturn: 15.8,
    holdings: 8,
    followers: 76543,
  },
  {
    rank: 4,
    name: "Sude Akarcay",
    username: "pm",
    portfolioName: "My Portfolio",
    avatar: "https://i.ytimg.com/vi/m0XpDRhnTN8/maxresdefault.jpg",
    averageReturn: 42.1,
    ytdReturn: -12.4,
    holdings: 28,
    followers: 65432,
  },
  {
    rank: 5,
    name: "Mert Gunes",
    username: "skraatz416",
    portfolioName: "Betting on my ÖÇP earnings",
    avatar:
      "https://pbs.twimg.com/profile_images/965317696639459328/pRPM9a9H_400x400.jpg",
    averageReturn: 40.1,
    ytdReturn: 13.4,
    holdings: 2,
    followers: 3,
  },
  {
    rank: 6,
    name: "Mehmet Yıldırım",
    username: "faizsebep",
    portfolioName: "Enflasyon't Touch This Portfolio",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBgTAXz-EbpmyMVUcrO6ra6DolsQxJaF11uA&s",
    averageReturn: 38.0,
    ytdReturn: 13.4,
    holdings: 13,
    followers: 4893,
  },
  {
    rank: 7,
    name: "Mehmet Kocyigit",
    username: "kocyigit",
    portfolioName: "Fethiye Portfolio Management",
    avatar:
      "https://media.licdn.com/dms/image/v2/D4D03AQHeqaS39F_X9Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1731703909704?e=2147483647&v=beta&t=FfYf_MXcsLFkWRKQqrJSGEQ6uqRSCw_BpnXuADqrEJY",
    averageReturn: 37.8,
    ytdReturn: 8.9,
    holdings: 15,
    followers: 34521,
  },

  {
    rank: 8,
    name: "Cuneyt Sevgi",
    portfolioName: "Nitelikli Yatirimcilar Portfoyu",
    username: "stockpro1",
    avatar: "https://i.ytimg.com/vi/YEbCfWsTZpo/hqdefault.jpg",
    averageReturn: 35.0,
    ytdReturn: 25.4,
    holdings: 4,
    followers: 1,
  },
  {
    rank: 9,
    name: "Ercan Uchar",
    username: "ctisadmin",
    portfolioName: "Later Than Ever, Richer Than Most",
    avatar:
      "https://pbs.twimg.com/profile_images/1316982158578298880/BRoYwo1W_400x400.jpg",
    averageReturn: 32.0,
    ytdReturn: -1.4,
    holdings: 8,
    followers: 4008,
  },
  {
    rank: 10,
    name: "Serdar Genc",
    portfolioName: "The One Who Stocks",
    username: "phpsgenc",
    avatar:
      "https://i1.rgstatic.net/ii/profile.image/11431281283013872-1728568858685_Q512/Serkan-Genc.jpg",
    averageReturn: 23.0,
    ytdReturn: 8.2,
    holdings: 25,
    followers: 13008,
  },
];

interface LeaderboardTableProps {
  timeFilter: "all" | "year";
  sortBy: "return" | "followers";
}

export default function LeaderboardTable({
  timeFilter,
  sortBy,
}: LeaderboardTableProps) {
  const getReturnValue = (portfolio: (typeof leaderboardData)[0]) => {
    switch (timeFilter) {
      case "all":
        return portfolio.averageReturn;
      case "year":
        return portfolio.ytdReturn;
      default:
        return portfolio.averageReturn;
    }
  };

  const filteredAndSortedData = [...leaderboardData]
    .map((portfolio) => ({
      ...portfolio,
      currentReturn: getReturnValue(portfolio),
    }))
    .sort((a, b) => {
      if (sortBy === "return") {
        return b.currentReturn - a.currentReturn;
      } else {
        return b.followers - a.followers;
      }
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyGold />;
      case 2:
        return <TrophySilver />;
      case 3:
        return <TrophyBronze />;
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04]">
            <span className="text-sm font-medium text-[#1D1D1F]">{rank}</span>
          </div>
        );
    }
  };

  const formatReturn = (value: number) => {
    const formattedValue = value >= 0 ? `+${value}` : value;
    return `${formattedValue}%`;
  };

  const getReturnColorClass = (value: number) => {
    return value >= 0 ? "text-[#00A852]" : "text-[#FF3B30]";
  };

  const formatFollowers = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <TableRoot>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-sm font-medium text-[#6E6E73]">
              Rank
            </TableHead>
            <TableHead className="text-sm font-medium text-[#6E6E73]">
              Investor / Portfolio
            </TableHead>
            <TableHead className="text-right text-sm font-medium text-[#6E6E73]">
              {timeFilter === "all" ? "Average Return" : "YTD Return"}
            </TableHead>
            {timeFilter === "all" && (
              <TableHead className="text-right text-sm font-medium text-[#6E6E73]">
                YTD Return
              </TableHead>
            )}
            <TableHead className="text-center text-sm font-medium text-[#6E6E73]">
              Holdings
            </TableHead>
            <TableHead className="text-right text-sm font-medium text-[#6E6E73]">
              Followers
            </TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedData.map((portfolio, index) => (
            <motion.tr
              key={portfolio.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(portfolio.rank)}
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/${portfolio.username}`}
                  className="flex items-center gap-4 group/link"
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/[0.08]">
                    <Image
                      src={portfolio.avatar}
                      alt={portfolio.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-[#1D1D1F] group-hover/link:text-blue-600 transition-colors duration-200">
                      {portfolio.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#6E6E73]">
                        @{portfolio.username}
                      </span>
                      <span className="text-[#6E6E73]">•</span>
                      <span className="text-sm text-[#6E6E73]">
                        {portfolio.portfolioName}
                      </span>
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell
                className={`text-right font-medium ${getReturnColorClass(portfolio.currentReturn)}`}
              >
                {formatReturn(portfolio.currentReturn)}
              </TableCell>
              {timeFilter === "all" && (
                <TableCell
                  className={`text-right font-medium ${getReturnColorClass(portfolio.ytdReturn)}`}
                >
                  {formatReturn(portfolio.ytdReturn)}
                </TableCell>
              )}
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center h-6 min-w-[48px] rounded-full bg-gray-50/80 backdrop-blur-sm text-sm font-medium text-[#1D1D1F] ring-1 ring-black/[0.04]">
                  {portfolio.holdings}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-medium text-[#1D1D1F]">
                  {formatFollowers(portfolio.followers)}
                </span>
              </TableCell>
              <TableCell>
                <button className="px-4 py-1.5 rounded-full bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  Follow
                </button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  );
}
