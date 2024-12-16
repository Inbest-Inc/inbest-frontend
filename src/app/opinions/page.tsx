"use client";

import { Card } from "@tremor/react";
import { useState } from "react";
import OpinionsFeed from "@/components/OpinionsFeed";

export default function OpinionsPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Opinions</h1>
        <p className="mt-2 text-gray-600">
          Track investment decisions and insights from the Inbest community
        </p>
      </div>

      <Card className="p-6">
        {/* Tab Selection */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("for-you")}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === "for-you"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              For You
              {activeTab === "for-you" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === "following"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Following
              {activeTab === "following" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Feed Content */}
        <div className="mt-6">
          <OpinionsFeed activeTab={activeTab} />
        </div>
      </Card>
    </main>
  );
}
