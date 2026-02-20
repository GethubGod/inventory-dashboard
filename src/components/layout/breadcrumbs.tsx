"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  DASHBOARD_NAV_BY_HREF,
  isActiveRoute,
} from "@/components/layout/dashboard-nav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SEGMENT_OVERRIDES: Record<string, string> = {
  dashboard: "Dashboard",
  settings: "Settings",
  "app-connection": "Mobile App",
};

function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLabelForPath(path: string) {
  const navMatch = DASHBOARD_NAV_BY_HREF.get(path);
  if (navMatch) {
    return navMatch.label;
  }

  const lastSegment = path.split("/").filter(Boolean).at(-1);
  if (!lastSegment) {
    return "Dashboard";
  }

  return SEGMENT_OVERRIDES[lastSegment] ?? formatSegment(lastSegment);
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname();

  if (!isActiveRoute(pathname, "/dashboard")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [
    {
      href: "/dashboard/overview",
      label: "Dashboard",
    },
  ];

  let currentPath = "/dashboard";
  for (const segment of segments.slice(1)) {
    currentPath += `/${segment}`;
    crumbs.push({
      href: currentPath,
      label: getLabelForPath(currentPath),
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={`${crumb.href}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-foreground">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
