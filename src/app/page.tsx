import { Card, Title, Text } from "@tremor/react";

export default function Home() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Welcome to Inbest</Title>
      <Text>Your portfolio sharing and comparison platform</Text>

      <Card className="mt-6">
        <div className="h-96">
          <Title>Sample Portfolio</Title>
          <Text>Portfolio performance visualization will go here</Text>
        </div>
      </Card>
    </main>
  );
}
