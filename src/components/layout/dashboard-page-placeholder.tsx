import { Sparkles } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

type DashboardPagePlaceholderProps = {
  title: string;
  description: string;
  comingSoon?: boolean;
  comingSoonItems?: string[];
};

export function DashboardPagePlaceholder({
  title,
  description,
  comingSoon = true,
  comingSoonItems,
}: DashboardPagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h1>
          {comingSoon ? (
            <span className="bg-secondary text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              Coming Soon
            </span>
          ) : null}
        </div>
        <p className="text-muted-foreground max-w-3xl text-sm">{description}</p>
      </div>

      {comingSoon ? (
        <div className="border-border bg-card rounded-xl border border-dashed p-8 text-center">
          <div className="bg-secondary text-muted-foreground mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-foreground text-lg font-semibold">Feature in development</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            This module is planned for an upcoming release. The layout below previews the final
            structure.
          </p>

          {comingSoonItems && comingSoonItems.length > 0 ? (
            <ul className="text-muted-foreground mx-auto mt-4 max-w-md space-y-1.5 text-left text-sm">
              {comingSoonItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="bg-muted-foreground/40 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="border-border bg-card rounded-xl border p-5 xl:col-span-8">
          <Skeleton className="mb-4 h-6 w-48" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        </div>

        <div className="border-border bg-card rounded-xl border p-5 xl:col-span-4">
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
