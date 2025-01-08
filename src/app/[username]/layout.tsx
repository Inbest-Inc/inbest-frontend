export function generateStaticParams() {
  // Provide a base path for static generation
  return [{ username: "_" }];
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  return children;
}
