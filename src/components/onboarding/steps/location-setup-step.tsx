import { Plus, Trash2 } from "lucide-react";
import { type FieldArrayWithId, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { type OnboardingFormValues } from "@/components/onboarding/types";

type LocationSetupStepProps = {
  form: UseFormReturn<OnboardingFormValues>;
  fields: FieldArrayWithId<OnboardingFormValues, "locations", "id">[];
  onAddLocation: () => void;
  onRemoveLocation: (index: number) => void;
};

export function LocationSetupStep({
  form,
  fields,
  onAddLocation,
  onRemoveLocation,
}: LocationSetupStepProps) {
  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const errors = form.formState.errors.locations?.[index];

        return (
          <section key={field.id} className="space-y-4 rounded-2xl border border-[#E5E1DB] bg-[#FBFAF8] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Location {index + 1}</h2>
              {fields.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onRemoveLocation(index)}
                  className="rounded-full px-3 text-[#7A7268] hover:bg-[#EFE9E1]"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Remove
                </Button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`location-name-${index}`}>Location name</Label>
                <Input
                  id={`location-name-${index}`}
                  placeholder="Downtown Kitchen"
                  className="h-11 rounded-xl border-[#DDD8D0]"
                  {...form.register(`locations.${index}.name`)}
                />
                {errors?.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`location-address-${index}`}>Address</Label>
                <Input
                  id={`location-address-${index}`}
                  placeholder="123 Market Street"
                  className="h-11 rounded-xl border-[#DDD8D0]"
                  {...form.register(`locations.${index}.address`)}
                />
                {errors?.address ? <p className="text-sm text-red-600">{errors.address.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`location-phone-${index}`}>Phone</Label>
                <Input
                  id={`location-phone-${index}`}
                  placeholder="(555) 123-4567"
                  className="h-11 rounded-xl border-[#DDD8D0]"
                  {...form.register(`locations.${index}.phone`)}
                />
                {errors?.phone ? <p className="text-sm text-red-600">{errors.phone.message}</p> : null}
              </div>
            </div>
          </section>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={onAddLocation}
        className="rounded-full border-[#D8D3CB] bg-white px-5 text-[#1A1A1A] hover:bg-[#F5F3EF]"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add another location
      </Button>
    </div>
  );
}
