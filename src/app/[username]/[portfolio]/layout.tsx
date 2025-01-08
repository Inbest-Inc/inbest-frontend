"use client";

type LayoutProps = {
  children: React.ReactNode;
  params: {
    username: string;
    portfolio: string;
  };
};

export default function PortfolioLayout({ children, params }: LayoutProps) {
  return <div className="portfolio-layout">{children}</div>;
}
