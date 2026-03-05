import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OrgProvider, type OrgContextValue } from "@/components/providers/org-provider";
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

  const [{ data: dbProfile }, { data: dbMembership }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("org_memberships")
      .select("org_id, role, accepted_at")
      .eq("user_id", user.id)
      .not("accepted_at", "is", null)
      .order("accepted_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!dbMembership?.org_id) {
    redirect("/onboarding");
  }

  const { data: dbOrganization } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", dbMembership.org_id)
    .maybeSingle();

  if (!dbOrganization) {
    redirect("/onboarding");
  }

  const profile: OrgContextValue["profile"] = {
    id: user.id,
    full_name: dbProfile?.full_name ?? (user.user_metadata.full_name as string | undefined) ?? null,
  };

  const membership: OrgContextValue["membership"] = {
    org_id: dbMembership.org_id,
    role: dbMembership.role ?? "member",
  };

  const organization: OrgContextValue["organization"] = {
    id: dbOrganization.id,
    name: dbOrganization.name,
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
