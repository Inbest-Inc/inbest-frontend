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
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo section */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-semibold text-blue-600 tracking-tight"
            >
              Inbest
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:flex-1 md:justify-center">
            <div className="space-x-8">
              <Link
                href="/best-portfolios"
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === "/best-portfolios"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Best Portfolios
              </Link>
              <Link
                href="/opinions"
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === "/opinions"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Opinions
              </Link>
            </div>
          </nav>

          {/* Right section */}
          {isManagePage ? (
            <div className="flex items-center gap-3">
              <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Share
              </button>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden ring-1 ring-black/[0.08]">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userData.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="hidden items-center justify-end gap-6 md:flex md:flex-shrink-0">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
