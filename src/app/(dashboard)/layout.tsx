import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OrgProvider, type OrgContextValue } from "@/components/providers/org-provider";
import { createServerApi } from "@/lib/api-client-server";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const api = await createServerApi();
  const { data: ctx } = await api.getUserContext();

  if (!ctx?.membership?.orgId) {
    redirect("/onboarding");
  }

  if (!ctx.organization) {
    redirect("/onboarding");
  }

  const profile: OrgContextValue["profile"] = {
    id: user.id,
    full_name:
      ctx.profile.fullName ??
      (user.user_metadata.full_name as string | undefined) ??
      null,
  };

  const membership: OrgContextValue["membership"] = {
    org_id: ctx.membership.orgId,
    role: ctx.membership.role ?? "member",
  };

  const organization: OrgContextValue["organization"] = {
    id: ctx.organization.id,
    name: ctx.organization.name,
  };

  return (
    <OrgProvider
      value={{
        profile,
        membership,
        organization,
      }}
    >
      <DashboardShell>{children}</DashboardShell>
    </OrgProvider>
  );
}
