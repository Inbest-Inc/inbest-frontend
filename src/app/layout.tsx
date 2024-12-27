import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inbest - Social Investing Platform",
  description:
    "Making investing social, transparent, and accessible for everyone.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/icon-dark.png",
        type: "image/png",
        sizes: "32x32",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
        rel: "apple-touch-icon",
      },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Inbest",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Inbest - Social Investing Platform",
    description:
      "Making investing social, transparent, and accessible for everyone.",
    url: "https://inbest.app",
    siteName: "Inbest",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inbest - Social Investing Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inbest - Social Investing Platform",
    description:
      "Making investing social, transparent, and accessible for everyone.",
    images: ["/twitter-image.png"],
    creator: "@inbest",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
