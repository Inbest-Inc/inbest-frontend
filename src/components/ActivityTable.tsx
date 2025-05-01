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
import Tooltip from "./Tooltip";
import InfoTooltip, { metricExplanations } from "./InfoTooltip";

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
            <TableHead>
              <span className="flex items-center gap-1">
                Asset
                <InfoTooltip content={metricExplanations.asset} />
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="flex items-center justify-end gap-1">
                Allocation %
                <InfoTooltip content={metricExplanations.allocation} />
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="flex items-center justify-end gap-1">
                Avg Price
                <InfoTooltip content={metricExplanations.averagePrice} />
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="flex items-center justify-end gap-1">
                Current Price
                <InfoTooltip content={metricExplanations.currentPrice} />
              </span>
            </TableHead>
            <TableHead className="text-right">
              <span className="flex items-center justify-end gap-1">
                Return
                <InfoTooltip content={metricExplanations.return} />
              </span>
            </TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                Last Transaction
                <InfoTooltip content={metricExplanations.lastTransaction} />
              </span>
            </TableHead>
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
                <Tooltip content={`${holding.allocation}%`}>
                  <span>{holding.allocation.toFixed(1)}%</span>
                </Tooltip>
              </TableCell>
              <TableCell className="text-right">
                <Tooltip content={`$${holding.averagePrice}`}>
                  <span>${holding.averagePrice.toFixed(2)}</span>
                </Tooltip>
              </TableCell>
              <TableCell className="text-right">
                <Tooltip content={`$${holding.currentPrice}`}>
                  <span>${holding.currentPrice.toFixed(2)}</span>
                </Tooltip>
              </TableCell>
              <TableCell className="text-right">
                <Tooltip content={`${holding.return}%`}>
                  <span
                    className={
                      holding.return >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {holding.return >= 0 ? "+" : ""}
                    {holding.return.toFixed(1)}%
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${
                    holding.lastTransaction.type === "buy" ||
                    holding.lastTransaction.type === "start" ||
                    holding.lastTransaction.type === "increase"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  } rounded-full`}
                >
                  {holding.lastTransaction.type === "buy" ||
                  holding.lastTransaction.type === "start" ||
                  holding.lastTransaction.type === "increase" ? (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  )}
                  <span>
                    {holding.lastTransaction.type.charAt(0).toUpperCase() +
                      holding.lastTransaction.type.slice(1)}{" "}
                    • {holding.lastTransaction.date}
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
