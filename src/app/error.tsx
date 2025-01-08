"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h1 className="text-xl font-bold text-red-800 mb-2">
        Something went wrong
      </h1>
      {process.env.NEXT_PUBLIC_DEBUG === "true" && (
        <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
          {error.message}
          {error.stack}
        </pre>
      )}
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
