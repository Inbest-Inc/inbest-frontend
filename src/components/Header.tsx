"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isManagePage = pathname?.includes("/manage");

  const userData = {
    name: "Warren Buffett",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfPqLD2DHAh-b4RqasJvR4SOHB_JNAq-wuRA&s",
  };

  return (
    <header className="relative z-20 bg-white">
      <div className="flex items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        {/* Logo section */}
        <div className="flex justify-start">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Inbest
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden space-x-5 md:flex">
          <Link
            href="/portfolios"
            className="whitespace-nowrap rounded-full px-3 py-1 text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Portfolios
          </Link>
          <Link
            href="/best-portfolios"
            className="whitespace-nowrap rounded-full px-3 py-1 text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Best Portfolios
          </Link>
          <Link
            href="/opinions"
            className="whitespace-nowrap rounded-full px-3 py-1 text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Opinions
          </Link>
          <Link
            href="/compare"
            className="whitespace-nowrap rounded-full px-3 py-1 text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Compare
          </Link>
          <Link
            href="/strategies"
            className="whitespace-nowrap rounded-full px-3 py-1 text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Strategies
          </Link>
        </nav>

        {/* Desktop right section */}
        {isManagePage ? (
          <div className="hidden items-center justify-end gap-4 md:flex md:flex-1 lg:w-0">
            <button className="text-gray-600 hover:text-gray-800">
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
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={userData.avatar}
                alt={userData.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="hidden items-center justify-end gap-5 md:flex md:flex-1 lg:w-0">
            <Link
              href="/login"
              className="whitespace-nowrap rounded-full px-3 py-1 text-base text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-blue-600 py-1 pl-3 pr-1 text-base font-medium text-white shadow-sm"
            >
              Sign up
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="ml-1 h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
