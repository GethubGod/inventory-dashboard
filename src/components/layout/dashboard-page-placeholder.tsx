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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {comingSoon ? (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Coming Soon
            </span>
          ) : null}
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>

      {comingSoon ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Feature in development</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This module is planned for an upcoming release. The layout below previews the final structure.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="rounded-xl border border-border bg-card p-5 xl:col-span-8">
          <Skeleton className="mb-4 h-6 w-48" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 xl:col-span-4">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
