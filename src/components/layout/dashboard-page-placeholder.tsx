import { Sparkles } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

type DashboardPagePlaceholderProps = {
  title: string;
  description: string;
  comingSoon?: boolean;
};

export function DashboardPagePlaceholder({
  title,
  description,
  comingSoon = false,
}: DashboardPagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
          {comingSoon ? (
            <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Coming Soon
            </span>
          ) : null}
        </div>
        <p className="max-w-3xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      {comingSoon ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d9488]/10 text-[#0d9488] dark:bg-[#0d9488]/20 dark:text-teal-300">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Feature in development</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This module is planned for an upcoming release. The layout below previews the final structure.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 xl:col-span-8">
          <Skeleton className="mb-4 h-6 w-48 bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 xl:col-span-4">
          <Skeleton className="mb-4 h-5 w-32 bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-16 w-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
