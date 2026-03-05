import { Badge } from "@/components/ui/badge";

import { type OnboardingFormValues } from "@/components/onboarding/types";

type ConfirmationStepProps = {
  values: OnboardingFormValues;
};

function formatRole(role: "owner" | "manager" | "staff") {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function ConfirmationStep({ values }: ConfirmationStepProps) {
  const inviteRows = values.invites.filter((invite) => invite.email.trim().length > 0);

  return (
    <div className="space-y-4 text-sm">
      <section className="rounded-2xl border border-[#E5E1DB] bg-[#FBFAF8] p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A]">Organization</h2>
        <dl className="mt-3 grid gap-2 text-[#5D5852] sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#7A746D]">Name</dt>
            <dd className="mt-1 text-sm text-[#1A1A1A]">{values.organization.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#7A746D]">Type</dt>
            <dd className="mt-1 text-sm capitalize text-[#1A1A1A]">{values.organization.type}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#7A746D]">Timezone</dt>
            <dd className="mt-1 text-sm text-[#1A1A1A]">{values.organization.timezone}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-[#E5E1DB] bg-[#FBFAF8] p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A]">Square connection</h2>
        <p className="mt-2 text-[#5D5852]">
          {values.square.status === "connected"
            ? `Connected${values.square.merchantId ? ` (merchant ${values.square.merchantId})` : ""}`
            : values.square.status === "skipped"
              ? "Skipped for now"
              : "Not connected"}
        </p>
      </section>

      <section className="rounded-2xl border border-[#E5E1DB] bg-[#FBFAF8] p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A]">Locations ({values.locations.length})</h2>
        <ul className="mt-2 space-y-2 text-[#5D5852]">
          {values.locations.map((location, index) => (
            <li key={`${location.name}-${index}`} className="rounded-xl border border-[#ECE8E1] bg-white px-3 py-2">
              <p className="font-medium text-[#1A1A1A]">{location.name}</p>
              <p>{location.address}</p>
              <p>{location.phone}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[#E5E1DB] bg-[#FBFAF8] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[#1A1A1A]">Team invites</h2>
          <Badge variant="outline" className="rounded-full border-[#D7D2CA] bg-white text-[#5F5A54]">
            {inviteRows.length} pending
          </Badge>
        </div>

        {inviteRows.length ? (
          <ul className="mt-2 space-y-2 text-[#5D5852]">
            {inviteRows.map((invite, index) => (
              <li key={`${invite.email}-${index}`} className="rounded-xl border border-[#ECE8E1] bg-white px-3 py-2">
                <p className="font-medium text-[#1A1A1A]">{invite.email}</p>
                <p>{formatRole(invite.role)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[#5D5852]">No invites were added.</p>
        )}
      </section>
    </div>
  );
}
