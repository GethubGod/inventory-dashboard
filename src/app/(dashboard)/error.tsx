"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to monitoring/console in development
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="rounded-full bg-red-100 p-4 dark:bg-red-950/40">
        <svg
          className="h-8 w-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          An unexpected error occurred while loading this page. Please try again, or contact support
          if the issue persists.
        </p>
      </div>

      <button
        type="button"
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/40 mt-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
      >
        Try again
      </button>

      {error.digest && (
        <p className="text-muted-foreground/60 mt-4 text-xs">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
