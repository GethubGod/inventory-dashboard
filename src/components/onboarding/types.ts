import { z } from "zod";

export const onboardingStepLabels = [
  "Organization",
  "Square",
  "Locations",
  "Team",
  "Confirm",
] as const;

export const organizationTypeOptions = ["sushi", "poke", "pho", "other"] as const;
export const teamRoleOptions = ["owner", "manager", "staff"] as const;

const locationSchema = z.object({
  name: z.string().trim().min(1, "Location name is required."),
  address: z.string().trim().min(1, "Address is required."),
  phone: z.string().trim().min(7, "Phone number is required."),
});

const inviteSchema = z
  .object({
    email: z.string().trim(),
    role: z.enum(teamRoleOptions),
  })
  .superRefine((value, ctx) => {
    if (!value.email) {
      return;
    }

    const emailResult = z.string().email().safeParse(value.email);
    if (!emailResult.success) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter a valid email address.",
      });
    }
  });

export const onboardingSchema = z.object({
  organization: z.object({
    name: z.string().trim().min(2, "Organization name is required."),
    type: z.enum(organizationTypeOptions, { error: "Select an organization type." }),
    timezone: z.string().trim().min(1, "Timezone is required."),
  }),
  square: z.object({
    status: z.enum(["not_connected", "connected", "skipped"]),
    oauthState: z.string().nullable(),
    integrationId: z.string().nullable(),
    merchantId: z.string().nullable(),
  }),
  locations: z.array(locationSchema).min(1, "Add at least one location."),
  invites: z.array(inviteSchema),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
export type OrganizationType = (typeof organizationTypeOptions)[number];
export type TeamRole = (typeof teamRoleOptions)[number];

export const commonTimezoneOptions = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "UTC",
] as const;

export function getDefaultOnboardingValues(timezone: string): OnboardingFormValues {
  return {
    organization: {
      name: "",
      type: "sushi",
      timezone,
    },
    square: {
      status: "not_connected",
      oauthState: null,
      integrationId: null,
      merchantId: null,
    },
    locations: [
      {
        name: "",
        address: "",
        phone: "",
      },
    ],
    invites: [],
  };
}

export type OnboardingStepIndex = 0 | 1 | 2 | 3 | 4;

export type IntegrationRow = {
  id: string;
  merchant_id: string | null;
};
