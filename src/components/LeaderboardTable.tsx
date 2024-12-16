"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./Table";
import Link from "next/link";
import Image from "next/image";

// Trophy icons for top 3
const TrophyGold = () => (
  <svg
    className="w-5 h-5 text-yellow-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5 16.93a8 8 0 1 1 14 0l-7 4.07-7-4.07ZM12 3c-1.86 0-3.52.83-4.63 2.14A7.95 7.95 0 0 0 4 11h16a7.95 7.95 0 0 0-3.37-5.86A6.96 6.96 0 0 0 12 3Z" />
  </svg>
);

const TrophySilver = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5 16.93a8 8 0 1 1 14 0l-7 4.07-7-4.07ZM12 3c-1.86 0-3.52.83-4.63 2.14A7.95 7.95 0 0 0 4 11h16a7.95 7.95 0 0 0-3.37-5.86A6.96 6.96 0 0 0 12 3Z" />
  </svg>
);

const TrophyBronze = () => (
  <svg
    className="w-5 h-5 text-amber-600"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5 16.93a8 8 0 1 1 14 0l-7 4.07-7-4.07ZM12 3c-1.86 0-3.52.83-4.63 2.14A7.95 7.95 0 0 0 4 11h16a7.95 7.95 0 0 0-3.37-5.86A6.96 6.96 0 0 0 12 3Z" />
  </svg>
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
    name: "Warren Buffett",
    username: "warrenbuffett",
    portfolioName: "Value Investing",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfPqLD2DHAh-b4RqasJvR4SOHB_JNAq-wuRA&s",
    averageReturn: 52.4,
    ytdReturn: 18.7,
    holdings: 12,
    followers: 152890,
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
    portfolioName: "My Portfolio",
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
    portfolioName: "All Weather",
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
    portfolioName: "Bet",
    avatar:
      "https://pbs.twimg.com/profile_images/965317696639459328/pRPM9a9H_400x400.jpg",
    averageReturn: 40.1,
    ytdReturn: 13.4,
    holdings: 2,
    followers: 29,
  },
  {
    rank: 6,
    name: "Mehmet Timsek",
    username: "hazineningulu",
    portfolioName: "Justice and Development",
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
    portfolioName: "Portfolio 2",
    avatar:
      "https://media.licdn.com/dms/image/D4D03AQFGs29qS6A3gg/profile-displayphoto-shrink_200_200/0/1706555428746?e=2147483647&v=beta&t=-VKVt7rkB_K8yNbqZ6l8uAIGJE67rdSBCZOKlgHp6lo",
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
    portfolioName: "My Portfolio",
    avatar:
      "https://pbs.twimg.com/profile_images/1316982158578298880/BRoYwo1W_400x400.jpg",
    averageReturn: 32.0,
    ytdReturn: -1.4,
    holdings: 8,
    followers: 4008,
  },
  {
    rank: 10,
    name: "Nancy Pelosi",
    portfolioName: "Like I didn't know",
    username: "insidertrader",
    avatar:
      "https://cdn.britannica.com/93/204193-050-16E326DA/Nancy-Pelosi-2018.jpg",
    averageReturn: 23.0,
    ytdReturn: 8.2,
    holdings: 25,
    followers: 13008,
  },
];

export default function LeaderboardTable() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyGold />;
      case 2:
        return <TrophySilver />;
      case 3:
        return <TrophyBronze />;
      default:
        return null;
    }
  };

  const formatReturn = (value: number) => {
    const formattedValue = value >= 0 ? `+${value}` : value;
    return `${formattedValue}%`;
  };

  const getReturnColorClass = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <TableRoot>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Investor / Portfolio</TableHead>
            <TableHead className="text-right">Average Return</TableHead>
            <TableHead className="text-right">YTD Return</TableHead>
            <TableHead className="text-center">Holdings</TableHead>
            <TableHead className="text-right">Followers</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((portfolio) => (
            <TableRow key={portfolio.username}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getRankIcon(portfolio.rank)}#{portfolio.rank}
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/portfolios/${portfolio.username}`}
                  className="flex items-center gap-3 hover:opacity-80"
                >
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={portfolio.avatar}
                      alt={portfolio.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {portfolio.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        @{portfolio.username}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600 font-medium">
                        {portfolio.portfolioName}
                      </span>
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell
                className={`text-right font-medium ${getReturnColorClass(portfolio.averageReturn)}`}
              >
                {formatReturn(portfolio.averageReturn)}
              </TableCell>
              <TableCell
                className={`text-right font-medium ${getReturnColorClass(portfolio.ytdReturn)}`}
              >
                {formatReturn(portfolio.ytdReturn)}
              </TableCell>
              <TableCell className="text-center">
                {portfolio.holdings}
              </TableCell>
              <TableCell className="text-right">
                {portfolio.followers.toLocaleString()}
              </TableCell>
              <TableCell>
                <button className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100 inline-flex items-center">
                  <UserPlusIcon />
                  Follow
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  );
}
