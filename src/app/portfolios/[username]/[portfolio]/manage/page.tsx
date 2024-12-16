"use client";

import { Card } from "@tremor/react";
import { useState } from "react";
import ManageableActivityTable from "@/components/ManageableActivityTable";
import AddStockModal from "@/components/AddStockModal";
import ShareActionModal from "@/components/ShareActionModal";
import PortfolioSettingsModal from "@/components/PortfolioSettingsModal";
import Image from "next/image";

// Mock data - replace with real data later
const portfolioData = {
  name: "Tech Growth",
  username: "samet",
  description: "Focus on high-growth technology companies",
  isPublic: true,
  overview: {
    dailyReturn: 2.5,
    monthlyReturn: -3.2,
    totalReturn: 45.8,
    rank: 30,
    totalUsers: 763927,
  },
  topMovers: {
    gainers: [
      { symbol: "NVDA", change: 5.2 },
      { symbol: "AMD", change: 3.8 },
    ],
    losers: [
      { symbol: "TSLA", change: -4.1 },
      { symbol: "AAPL", change: -2.3 },
    ],
  },
  riskMetrics: {
    beta: 1.2,
    sharpeRatio: 1.8,
    volatility: 25.4,
  },
  holdings: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 150,
      allocation: 25.5,
      averagePrice: 175.23,
      currentPrice: 182.52,
      return: 4.16,
      logo: "https://assets.parqet.com/logos/symbol/AAPL?format=svg",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      shares: 100,
      allocation: 20.3,
      averagePrice: 285.12,
      currentPrice: 312.45,
      return: 9.59,
      logo: "https://assets.parqet.com/logos/symbol/MSFT?format=svg",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      shares: 80,
      allocation: 18.2,
      averagePrice: 420.5,
      currentPrice: 485.75,
      return: 15.52,
      logo: "https://assets.parqet.com/logos/symbol/NVDA?format=svg",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 60,
      allocation: 15.8,
      averagePrice: 138.45,
      currentPrice: 125.3,
      return: -9.49,
      logo: "https://assets.parqet.com/logos/symbol/GOOGL?format=svg",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      shares: 45,
      allocation: 12.4,
      averagePrice: 280.15,
      currentPrice: 315.2,
      return: 12.51,
      logo: "https://assets.parqet.com/logos/symbol/META?format=svg",
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      shares: 30,
      allocation: 7.8,
      averagePrice: 265.25,
      currentPrice: 202.8,
      return: -23.54,
      logo: "https://assets.parqet.com/logos/symbol/TSLA?format=svg",
    },
  ],
};

const RiskMetricBar = ({
  value,
  maxValue,
  label,
}: {
  value: number;
  maxValue: number;
  label: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-600 rounded-full transition-all duration-500"
        style={{ width: `${(value / maxValue) * 100}%` }}
      />
    </div>
  </div>
);

// Helper to get top gainers and losers from holdings
const getTopMovers = (holdings: any[]) => {
  const sorted = [...holdings].sort((a, b) => b.return - a.return);
  return {
    gainers: sorted.filter((h) => h.return > 0).slice(0, 2),
    losers: sorted.filter((h) => h.return < 0).slice(0, 2),
  };
};

export default function ManagePortfolioPage() {
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isShareActionModalOpen, setIsShareActionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [portfolioName, setPortfolioName] = useState(portfolioData.name);
  const [isPublic, setIsPublic] = useState(portfolioData.isPublic);

  const topMovers = getTopMovers(portfolioData.holdings);

  const handleStockChange = (changes: any) => {
    // Handle stock changes
    console.log(changes);
  };

  const handleShareAction = (action: any) => {
    setSelectedAction(action);
    setIsShareActionModalOpen(true);
  };

  const handleAddStock = (stock: any) => {
    // Handle adding new stock
    console.log("Adding stock:", stock);
    // Automatically open share modal for the new addition
    setSelectedAction({
      type: "start",
      symbol: stock.symbol,
      name: stock.name,
      logo: stock.logo,
      newShares: 0,
    });
    setIsShareActionModalOpen(true);
  };

  const handleDeletePortfolio = () => {
    // Handle portfolio deletion
    console.log("Deleting portfolio");
  };

  const handlePortfolioNameChange = (newName: string) => {
    setPortfolioName(newName);
    // Here you would typically make an API call to update the portfolio name
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{portfolioName}</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsAddStockModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg
              className="h-5 w-5 mr-2"
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
            Add Stock
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Portfolio Overview */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Portfolio Overview
          </h3>
          <div className="mt-4 space-y-4">
            {/* Rank */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rank on Inbest</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-900">
                  #{portfolioData.overview.rank.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  of {portfolioData.overview.totalUsers.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="h-px bg-gray-100" /> {/* Divider */}
            {/* Returns */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Daily Return</span>
              <span
                className={`text-sm font-medium ${portfolioData.overview.dailyReturn >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {portfolioData.overview.dailyReturn >= 0 ? "+" : ""}
                {portfolioData.overview.dailyReturn}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Return</span>
              <span
                className={`text-sm font-medium ${portfolioData.overview.monthlyReturn >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {portfolioData.overview.monthlyReturn >= 0 ? "+" : ""}
                {portfolioData.overview.monthlyReturn}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Return</span>
              <span
                className={`text-sm font-medium ${portfolioData.overview.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {portfolioData.overview.totalReturn >= 0 ? "+" : ""}
                {portfolioData.overview.totalReturn}%
              </span>
            </div>
          </div>
        </Card>

        {/* Daily Movers */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Movers</h3>
          <div className="mt-4 space-y-4">
            <div>
              <span className="text-xs text-gray-500">Top Gainers</span>
              {topMovers.gainers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between items-center mt-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative h-5 w-5">
                      <Image
                        src={stock.logo}
                        alt={stock.symbol}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium">{stock.symbol}</span>
                  </div>
                  <span className="text-sm text-green-600">
                    +{stock.return.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <div>
              <span className="text-xs text-gray-500">Top Losers</span>
              {topMovers.losers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between items-center mt-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative h-5 w-5">
                      <Image
                        src={stock.logo}
                        alt={stock.symbol}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium">{stock.symbol}</span>
                  </div>
                  <span className="text-sm text-red-600">
                    {stock.return.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Risk Metrics */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Metrics</h3>
          <div className="mt-4 space-y-6">
            <RiskMetricBar
              value={portfolioData.riskMetrics.beta}
              maxValue={2}
              label="Beta (vs S&P 500)"
            />
            <RiskMetricBar
              value={portfolioData.riskMetrics.sharpeRatio}
              maxValue={3}
              label="Sharpe Ratio"
            />
            <RiskMetricBar
              value={portfolioData.riskMetrics.volatility}
              maxValue={50}
              label="Volatility %"
            />
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Holdings</h2>
          <p className="text-sm text-gray-600">
            Manage your portfolio allocations
          </p>
        </div>
        <ManageableActivityTable
          data={portfolioData.holdings}
          onChange={handleStockChange}
          onShare={handleShareAction}
          portfolioName={portfolioName}
          onPortfolioNameChange={handlePortfolioNameChange}
        />
      </Card>

      {/* Modals */}
      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        onAddStock={handleAddStock}
      />
      <ShareActionModal
        isOpen={isShareActionModalOpen}
        onClose={() => setIsShareActionModalOpen(false)}
        action={selectedAction}
      />
      <PortfolioSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        portfolioName={portfolioName}
        isPublic={isPublic}
        onToggleVisibility={setIsPublic}
        onDelete={handleDeletePortfolio}
        onRename={handlePortfolioNameChange}
      />
    </main>
  );
}
