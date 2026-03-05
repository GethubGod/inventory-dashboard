import { Plus, Trash2, Users } from "lucide-react";
import { Controller, type FieldArrayWithId, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type OnboardingFormValues } from "@/components/onboarding/types";

type InviteTeamStepProps = {
  form: UseFormReturn<OnboardingFormValues>;
  fields: FieldArrayWithId<OnboardingFormValues, "invites", "id">[];
  onAddInvite: () => void;
  onRemoveInvite: (index: number) => void;
};

export function InviteTeamStep({
  form,
  fields,
  onAddInvite,
  onRemoveInvite,
}: InviteTeamStepProps) {
  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D7D2C9] bg-[#FBFAF8] p-6 text-center">
          <Users className="mx-auto mb-2 h-5 w-5 text-[#777066]" aria-hidden />
          <p className="text-sm font-medium text-[#1A1A1A]">No invites yet</p>
          <p className="mt-1 text-sm text-[#716B63]">Invite managers and staff now, or skip and add them later in settings.</p>
        </div>
      ) : null}

      {fields.map((field, index) => {
        const errors = form.formState.errors.invites?.[index];

        return (
          <section key={field.id} className="space-y-4 rounded-2xl border border-[#E5E1DB] bg-[#FBFAF8] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Invite {index + 1}</h2>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onRemoveInvite(index)}
                className="rounded-full px-3 text-[#7A7268] hover:bg-[#EFE9E1]"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Remove
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`invite-email-${index}`}>Email</Label>
                <Input
                  id={`invite-email-${index}`}
                  type="email"
                  placeholder="manager@babytuna.com"
                  className="h-11 rounded-xl border-[#DDD8D0]"
                  {...form.register(`invites.${index}.email`)}
                />
                {errors?.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`invite-role-${index}`}>Role</Label>
                <Controller
                  control={form.control}
                  name={`invites.${index}.role`}
                  render={({ field: roleField }) => (
                    <Select onValueChange={roleField.onChange} value={roleField.value}>
                      <SelectTrigger id={`invite-role-${index}`} className="h-11 rounded-xl border-[#DDD8D0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors?.role ? <p className="text-sm text-red-600">{errors.role.message}</p> : null}
              </div>
            </div>
          </section>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={onAddInvite}
        className="rounded-full border-[#D8D3CB] bg-white px-5 text-[#1A1A1A] hover:bg-[#F5F3EF]"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add team member
      </Button>
    </div>
  );
}
