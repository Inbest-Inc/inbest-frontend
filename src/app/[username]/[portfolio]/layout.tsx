export function generateStaticParams() {
  // Provide a base path for static generation
  return [{ username: "_", portfolio: "_" }];
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string; portfolio: string };
}) {
  return children;
}
