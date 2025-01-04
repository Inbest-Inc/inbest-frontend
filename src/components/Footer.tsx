import Link from "next/link";
import { Text } from "@tremor/react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/[0.04]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Text className="text-[22px] leading-[28px] font-semibold text-[#1D1D1F] tracking-tight">
              Inbest
            </Text>
            <Text className="text-[15px] leading-[20px] text-[#6E6E73]">
              Making investing social, transparent, and accessible for everyone.
            </Text>
          </div>

          {/* Product Links */}
          <div>
            <Text className="text-[13px] leading-[18px] font-semibold text-[#1D1D1F] mb-4">
              For Investors
            </Text>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/best-portfolios"
                  className="text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  Best Portfolios
                </Link>
              </li>
              <li>
                <Link
                  href="/opinions"
                  className="text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  Opinions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <Text className="text-[13px] leading-[18px] font-semibold text-[#1D1D1F] mb-4">
              Company
            </Text>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <Text className="text-[13px] leading-[18px] font-semibold text-[#1D1D1F] mb-4">
              Legal
            </Text>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[15px] leading-[20px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-black/[0.04]">
          <Text className="text-[13px] leading-[18px] text-[#6E6E73]">
            © 2024 Inbest. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}
