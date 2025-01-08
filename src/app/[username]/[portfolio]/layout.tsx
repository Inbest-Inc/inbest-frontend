"use client";

export default function PortfolioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string; portfolio: string };
}) {
  return <div className="portfolio-layout">{children}</div>;
}
