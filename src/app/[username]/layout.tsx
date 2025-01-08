"use client";

export default function UsernameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  return <div className="username-layout">{children}</div>;
}
