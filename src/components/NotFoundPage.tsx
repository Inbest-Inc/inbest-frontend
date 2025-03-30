import { Text } from "@tremor/react";
import Link from "next/link";

export default function NotFoundPage({
  message = "User not found",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 rounded-2xl bg-gray-50/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/[0.04] shadow-sm mb-6">
          <svg
            className="w-12 h-12 text-[#6E6E73]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        </div>
        <Text className="text-[28px] leading-[34px] font-semibold text-[#1D1D1F] mb-4">
          404 - Not Found
        </Text>
        <Text className="text-[19px] leading-[24px] text-[#6E6E73] mb-8 max-w-md">
          {message}
        </Text>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-[17px] leading-[22px] font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
