import { Suspense } from "react";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F5F5F0] px-4 py-8">
          <div className="rounded-2xl border border-[#E5E1DB] bg-white px-6 py-5 text-sm text-[#6F6A64]">
            Loading onboarding...
          </div>
        </main>
      }
    >
      <OnboardingWizard />
    </Suspense>
  );
}
