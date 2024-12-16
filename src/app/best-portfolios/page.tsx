import { Card } from "@tremor/react";
import LeaderboardTable from "@/components/LeaderboardTable";

export default function BestPortfoliosPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Best Portfolios</h1>
        <p className="mt-2 text-gray-600">
          Discover and follow the top-performing investors on Inbest
        </p>
      </div>

      <Card className="p-6">
        <LeaderboardTable />
      </Card>
    </main>
  );
}
