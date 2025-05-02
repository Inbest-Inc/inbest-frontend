"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkAuthStatus } from "@/services/userService";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const verifyAuth = async () => {
      try {
        // Check if we're running on the client-side
        if (typeof window === "undefined") return;

        // Check if user is authenticated
        const token = localStorage.getItem("token");
        const isAuthenticated = !!token;

        // Auth pages that should redirect if user is already logged in
        const isAuthPage = pathname === "/login" || pathname === "/register";

        // If user is logged in and trying to access login/register, redirect to home
        if (isAuthenticated && isAuthPage) {
          router.replace("/");
          return;
        }

        // If user is logged in, check their verification status
        if (isAuthenticated) {
          const authStatus = await checkAuthStatus();

          // If auth check returns success but user is not verified
          if (
            authStatus.status === "success" &&
            authStatus.isVerified === false
          ) {
            // Only redirect if not already on verification page
            if (pathname !== "/verification-required") {
              router.replace("/verification-required");
              return;
            }
          }
        }
      } catch (error) {
        console.error("Auth provider error:", error);
      }
    };

    verifyAuth();
  }, [pathname, router]);

  // Only render the children when mounted (client-side)
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
