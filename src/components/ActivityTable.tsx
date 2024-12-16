"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./Table";

interface Holding {
  symbol: string;
  name: string;
  allocation: number;
  averagePrice: number;
  currentPrice: number;
  return: number;
  logo: string;
  lastTransaction: {
    type: "buy" | "sell" | "start" | "increase" | "decrease";
    date: string;
  };
}

const ActionIcon = ({ type }: { type: Holding["lastTransaction"]["type"] }) => {
  switch (type) {
    case "buy":
    case "increase":
      return (
        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-green-600"
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
        <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-red-600"
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
        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-blue-600"
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
  }
};

export default function ActivityTable({ data }: { data: Holding[] }) {
  return (
    <TableRoot>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Allocation %</TableHead>
            <TableHead className="text-right">Avg Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Return</TableHead>
            <TableHead>Last Transaction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((holding) => (
            <TableRow key={holding.symbol}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-8">
                    <Image
                      src={`https://assets.parqet.com/logos/symbol/${holding.symbol}?format=svg`}
                      alt={holding.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {holding.symbol}
                    </div>
                    <div className="text-sm text-gray-500">{holding.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {holding.allocation.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                ${holding.averagePrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${holding.currentPrice.toFixed(2)}
              </TableCell>
              <TableCell
                className={`text-right font-medium ${
                  holding.return >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {holding.return >= 0 ? "+" : ""}
                {holding.return.toFixed(2)}%
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ActionIcon type={holding.lastTransaction.type} />
                  <span className="text-sm text-gray-600">
                    {holding.lastTransaction.date}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableRoot>
  );
}
