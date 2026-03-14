"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useSupabase } from "@/components/providers/supabase-provider";
import { useApi } from "@/hooks/use-api";
import { ConfirmationStep } from "@/components/onboarding/steps/confirmation-step";
import { InviteTeamStep } from "@/components/onboarding/steps/invite-team-step";
import { LocationSetupStep } from "@/components/onboarding/steps/location-setup-step";
import { OrganizationDetailsStep } from "@/components/onboarding/steps/organization-details-step";
import { SquareConnectionStep } from "@/components/onboarding/steps/square-connection-step";
import {
  getDefaultOnboardingValues,
  onboardingSchema,
  onboardingStepLabels,
  type IntegrationRow,
  type OnboardingFormValues,
} from "@/components/onboarding/types";
import { WizardShell } from "@/components/onboarding/wizard-shell";
import { Button } from "@/components/ui/button";

const ONBOARDING_DRAFT_KEY = "babytuna-onboarding-draft-v1";

const stepCopy = [
  {
    title: "Organization details",
    description: "Set the core profile for your restaurant group.",
  },
  {
    title: "Connect Square POS",
    description: "Link Square to start syncing sales and menu data.",
  },
  {
    title: "Location setup",
    description: "Add each physical location you manage.",
  },
  {
    title: "Invite your team",
    description: "Invite managers and staff now, or skip and do this later.",
  },
  {
    title: "Confirm and launch",
    description: "Review everything before creating your workspace.",
  },
] as const;

type DraftPayload = {
  step: number;
  values: OnboardingFormValues;
};


function fallbackUuid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function normalizeInvites(values: OnboardingFormValues["invites"]) {
  return values
    .map((invite) => ({
      email: invite.email.trim().toLowerCase(),
      role: invite.role,
    }))
    .filter((invite) => invite.email.length > 0);
}

function normalizeLocations(values: OnboardingFormValues["locations"]) {
  return values.map((location) => ({
    name: location.name.trim(),
    address: location.address.trim(),
    phone: location.phone.trim(),
  }));
}

function parseDraft(raw: string | null): DraftPayload | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DraftPayload>;
    if (typeof parsed.step !== "number" || !parsed.values) {
      return null;
    }

    const result = onboardingSchema.safeParse(parsed.values);
    if (!result.success) {
      return null;
    }

    return {
      step: parsed.step,
      values: result.data,
    };
  } catch {
    return null;
  }
}

export function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase, user, isLoading } = useSupabase();
  const api = useApi();

  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: getDefaultOnboardingValues(timezone),
    mode: "onBlur",
  });

  const locationsFieldArray = useFieldArray({
    control: form.control,
    name: "locations",
  });

  const invitesFieldArray = useFieldArray({
    control: form.control,
    name: "invites",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isConnectingSquare, setIsConnectingSquare] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const handledSquareStateRef = useRef<string | null>(null);

  const persistDraft = useCallback(
    (step: number, values: OnboardingFormValues) => {
      window.localStorage.setItem(
        ONBOARDING_DRAFT_KEY,
        JSON.stringify({
          step,
          values,
        } satisfies DraftPayload),
      );
    },
    [],
  );

  useEffect(() => {
    const restored = parseDraft(window.localStorage.getItem(ONBOARDING_DRAFT_KEY));

    if (restored) {
      form.reset(restored.values);
      setCurrentStep(Math.min(Math.max(restored.step, 0), stepCopy.length - 1));
    }

    setDraftReady(true);
  }, [form]);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    const subscription = form.watch((values) => {
      const result = onboardingSchema.safeParse(values);
      if (!result.success) {
        return;
      }

      persistDraft(currentStep, result.data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentStep, draftReady, form, persistDraft]);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    const result = onboardingSchema.safeParse(form.getValues());
    if (!result.success) {
      return;
    }

    persistDraft(currentStep, result.data);
  }, [currentStep, draftReady, form, persistDraft]);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    const squareStatus = searchParams.get("square");
    if (!squareStatus) {
      return;
    }

    const squareState = searchParams.get("state");
    const message = searchParams.get("message");
    const cleanupParams = new URLSearchParams(searchParams.toString());
    cleanupParams.delete("square");
    cleanupParams.delete("state");
    cleanupParams.delete("message");

    const cleanedPath = cleanupParams.size > 0 ? `/onboarding?${cleanupParams.toString()}` : "/onboarding";

    const finish = () => {
      router.replace(cleanedPath);
    };

    if (squareStatus === "error") {
      toast.error(message || "Could not connect Square.");
      setIsConnectingSquare(false);
      finish();
      return;
    }

    if (squareStatus !== "connected" || !squareState) {
      finish();
      return;
    }

    if (handledSquareStateRef.current === squareState) {
      finish();
      return;
    }

    handledSquareStateRef.current = squareState;

    const expectedState = form.getValues("square.oauthState");
    if (!expectedState || expectedState !== squareState) {
      toast.error("Square callback state did not match this onboarding session.");
      form.setValue("square.status", "not_connected", {
        shouldDirty: true,
        shouldValidate: true,
      });
      finish();
      return;
    }

    void (async () => {
      const result = await api.getIntegration({
        provider: "square",
        oauthState: squareState,
      });

      if (result.error || !result.data?.integration) {
        toast.error(result.error || "Square connected, but we could not find token details.");
        form.setValue("square.status", "not_connected", {
          shouldDirty: true,
          shouldValidate: true,
        });
      } else {
        form.setValue("square.status", "connected", {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue("square.integrationId", result.data.integration.id, {
          shouldDirty: true,
        });
        form.setValue("square.merchantId", result.data.integration.merchantId, {
          shouldDirty: true,
        });
        toast.success("Connected to Square.");
        setCurrentStep((step) => (step < 1 ? 1 : step));
      }

      setIsConnectingSquare(false);
      finish();
    })();
  }, [draftReady, form, router, searchParams, supabase]);

  const currentValues = form.watch();

  const nextLabel =
    currentStep === 4
      ? "Launch Dashboard"
      : currentStep === 1 && currentValues.square.status !== "connected"
        ? "Continue without Square"
        : "Next";

  const canSkip = currentStep === 1 || currentStep === 3;

  const skipLabel = currentStep === 1 ? "Skip for now" : currentStep === 3 ? "Skip invites" : undefined;

  const validateCurrentStep = async () => {
    if (currentStep === 0) {
      return form.trigger(["organization.name", "organization.type", "organization.timezone"], {
        shouldFocus: true,
      });
    }

    if (currentStep === 2) {
      return form.trigger("locations", {
        shouldFocus: true,
      });
    }

    if (currentStep === 3) {
      return form.trigger("invites", {
        shouldFocus: true,
      });
    }

    return true;
  };

  const moveToStep = (target: number) => {
    setCurrentStep(Math.min(Math.max(target, 0), stepCopy.length - 1));
  };

  const handleBack = () => {
    moveToStep(currentStep - 1);
  };

  const finishOnboarding = form.handleSubmit(async (values) => {
    if (!user) {
      toast.error("Sign in required.");
      return;
    }

    const locationRows = normalizeLocations(values.locations);
    const inviteRows = normalizeInvites(values.invites);

    try {
      const result = await api.completeOnboarding({
        organization: {
          name: values.organization.name.trim(),
          type: values.organization.type,
          timezone: values.organization.timezone,
        },
        locations: locationRows,
        invites: inviteRows,
        square: {
          status: values.square.status,
          integrationId: values.square.integrationId,
          oauthState: values.square.oauthState,
        },
      });

      if (result.error) {
        throw new Error(result.error);
      }

      window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      toast.success("Workspace created.");
      router.push("/dashboard/overview");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete onboarding.");
    }
  });

  const handleNext = async () => {
    if (currentStep === 4) {
      void finishOnboarding();
      return;
    }

    const valid = await validateCurrentStep();
    if (!valid) {
      return;
    }

    if (currentStep === 1 && currentValues.square.status === "not_connected") {
      toast.warning("Continuing without Square connection.");
      form.setValue("square.status", "skipped", {
        shouldDirty: true,
      });
    }

    moveToStep(currentStep + 1);
  };

  const handleSkip = () => {
    if (currentStep === 1) {
      toast.warning("Square skipped. You can connect it later in dashboard settings.");
      form.setValue("square.status", "skipped", {
        shouldDirty: true,
        shouldValidate: true,
      });
      moveToStep(2);
      return;
    }

    if (currentStep === 3) {
      invitesFieldArray.replace([]);
      moveToStep(4);
    }
  };

  const handleConnectSquare = () => {
    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;

    if (!appId) {
      toast.error("Missing NEXT_PUBLIC_SQUARE_APP_ID.");
      return;
    }

    const oauthState = typeof window.crypto?.randomUUID === "function" ? window.crypto.randomUUID() : fallbackUuid();
    const redirectUri = `${window.location.origin}/api/auth/square/callback`;
    const authorizeBase = process.env.NEXT_PUBLIC_SQUARE_AUTHORIZE_URL || "https://connect.squareup.com/oauth2/authorize";

    const url = new URL(authorizeBase);
    url.searchParams.set("client_id", appId);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "MERCHANT_PROFILE_READ INVENTORY_READ ITEMS_READ PAYMENTS_READ");
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("state", oauthState);

    form.setValue("square.oauthState", oauthState, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("square.status", "not_connected", {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("square.integrationId", null, {
      shouldDirty: true,
    });
    form.setValue("square.merchantId", null, {
      shouldDirty: true,
    });

    const draftResult = onboardingSchema.safeParse(form.getValues());
    if (draftResult.success) {
      persistDraft(currentStep, draftResult.data);
    }

    setIsConnectingSquare(true);
    window.location.assign(url.toString());
  };

  if (isLoading || !draftReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F5F0] px-4 py-8">
        <div className="rounded-2xl border border-[#E5E1DB] bg-white px-6 py-5 text-sm text-[#6F6A64]">Loading onboarding...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F5F0] px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-[#E5E1DB] bg-white p-6 text-center">
          <h1 className="text-lg font-semibold text-[#1A1A1A]">Sign in required</h1>
          <p className="mt-2 text-sm text-[#6F6A64]">Please sign in before completing onboarding.</p>
          <Button
            className="mt-4 rounded-full bg-[#1A1A1A] text-white hover:bg-[#262626]"
            onClick={() => router.push("/login")}
          >
            Go to login
          </Button>
        </div>
      </main>
    );
  }

  return (
    <WizardShell
      currentStep={currentStep}
      stepLabels={onboardingStepLabels}
      title={stepCopy[currentStep].title}
      description={stepCopy[currentStep].description}
      onBack={currentStep > 0 ? handleBack : undefined}
      onSkip={canSkip ? handleSkip : undefined}
      skipLabel={skipLabel}
      onNext={handleNext}
      nextLabel={nextLabel}
      nextDisabled={form.formState.isSubmitting}
      isProcessing={form.formState.isSubmitting}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {currentStep === 0 ? <OrganizationDetailsStep form={form} /> : null}
          {currentStep === 1 ? (
            <SquareConnectionStep
              status={currentValues.square.status}
              merchantId={currentValues.square.merchantId}
              onConnect={handleConnectSquare}
              isConnecting={isConnectingSquare}
            />
          ) : null}
          {currentStep === 2 ? (
            <LocationSetupStep
              form={form}
              fields={locationsFieldArray.fields}
              onAddLocation={() =>
                locationsFieldArray.append({
                  name: "",
                  address: "",
                  phone: "",
                })
              }
              onRemoveLocation={locationsFieldArray.remove}
            />
          ) : null}
          {currentStep === 3 ? (
            <InviteTeamStep
              form={form}
              fields={invitesFieldArray.fields}
              onAddInvite={() =>
                invitesFieldArray.append({
                  email: "",
                  role: "manager",
                })
              }
              onRemoveInvite={invitesFieldArray.remove}
            />
          ) : null}
          {currentStep === 4 ? <ConfirmationStep values={form.getValues()} /> : null}
        </motion.div>
      </AnimatePresence>
    </WizardShell>
  );
}
