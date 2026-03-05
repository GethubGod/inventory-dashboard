import { Controller, type UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { commonTimezoneOptions, organizationTypeOptions, type OnboardingFormValues } from "@/components/onboarding/types";

type OrganizationDetailsStepProps = {
  form: UseFormReturn<OnboardingFormValues>;
};

export function OrganizationDetailsStep({ form }: OrganizationDetailsStepProps) {
  const selectedType = form.watch("organization.type");
  const selectedTimezone = form.watch("organization.timezone");
  const timezoneOptions = selectedTimezone && !commonTimezoneOptions.some((timezone) => timezone === selectedTimezone)
    ? [selectedTimezone, ...commonTimezoneOptions]
    : [...commonTimezoneOptions];

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="organization-name">Organization name</Label>
        <Input
          id="organization-name"
          placeholder="Babytuna Downtown"
          className="h-11 rounded-xl border-[#DED9D0]"
          {...form.register("organization.name")}
        />
        {form.formState.errors.organization?.name ? (
          <p className="text-sm text-red-600">{form.formState.errors.organization.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        <Label>Organization type</Label>
        <div className="flex flex-wrap gap-2">
          {organizationTypeOptions.map((option) => {
            const isActive = selectedType === option;

            return (
              <button
                key={option}
                type="button"
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors",
                  isActive ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#D8D3CB] bg-[#F6F4EF] text-[#58524A] hover:bg-[#EEE9E1]",
                )}
                onClick={() => {
                  form.setValue("organization.type", option, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
        {form.formState.errors.organization?.type ? (
          <p className="text-sm text-red-600">{form.formState.errors.organization.type.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization-timezone">Timezone</Label>
        <Controller
          control={form.control}
          name="organization.timezone"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="organization-timezone" className="h-11 rounded-xl border-[#DED9D0]">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezoneOptions.map((timezone) => (
                  <SelectItem key={timezone} value={timezone}>
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.organization?.timezone ? (
          <p className="text-sm text-red-600">{form.formState.errors.organization.timezone.message}</p>
        ) : null}
      </div>
    </div>
  );
}
