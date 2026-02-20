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

  let profile: OrgContextValue["profile"] = {
    id: user?.id ?? "guest-user",
    full_name: (user?.user_metadata?.full_name as string | undefined) ?? "Guest User",
  };

  let membership: OrgContextValue["membership"] = {
    org_id: "demo-org",
    role: "admin",
  };

  let organization: OrgContextValue["organization"] = {
    id: "demo-org",
    name: "Babytuna Demo Org",
  };

  if (user) {
    const [{ data: dbProfile }, { data: dbMembership }] = await Promise.all([
      supabase.from("profiles").select("id, full_name").eq("id", user.id).maybeSingle(),
      supabase.from("org_memberships").select("org_id, role").eq("user_id", user.id).maybeSingle(),
    ]);

    if (dbProfile) {
      profile = {
        id: dbProfile.id,
        full_name: dbProfile.full_name,
      };
    }

    if (dbMembership?.org_id) {
      membership = {
        org_id: dbMembership.org_id,
        role: dbMembership.role ?? "member",
      };

      const { data: dbOrganization } = await supabase
        .from("organizations")
        .select("id, name")
        .eq("id", dbMembership.org_id)
        .maybeSingle();

      if (dbOrganization) {
        organization = {
          id: dbOrganization.id,
          name: dbOrganization.name,
        };
      }
    }
  }

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
