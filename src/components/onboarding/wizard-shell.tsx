import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type WizardShellProps = {
  currentStep: number;
  stepLabels: readonly string[];
  title: string;
  description: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel: string;
  skipLabel?: string;
  nextDisabled?: boolean;
  isProcessing?: boolean;
};

export function WizardShell({
  currentStep,
  stepLabels,
  title,
  description,
  children,
  onBack,
  onNext,
  onSkip,
  nextLabel,
  skipLabel,
  nextDisabled,
  isProcessing,
}: WizardShellProps) {
  const totalSteps = stepLabels.length;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  return (
    <main className="min-h-screen bg-[#F5F5F0] px-4 py-8 text-[#1A1A1A] sm:px-6 sm:py-10 lg:py-14">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-[#726A61]">
          <span>Babytuna Systems</span>
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>

        <div className="space-y-2">
          <Progress value={progressValue} className="h-1.5 rounded-full bg-[#E8E5DF]" />
          <ol className="grid grid-cols-5 gap-2">
            {stepLabels.map((label, index) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full border border-[#D5D0C8] transition-colors",
                    index <= currentStep ? "bg-[#1A1A1A]" : "bg-[#F5F5F0]",
                  )}
                  aria-hidden
                />
                <span className="hidden text-[11px] font-medium text-[#7B736A] sm:inline">{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <Card className="rounded-2xl border-[#E9E6E2] bg-white shadow-[0_20px_40px_-30px_rgb(26_26_26/0.35)]">
          <div className="space-y-1 border-b border-[#EFECE6] px-6 py-5 sm:px-8">
            <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">{title}</h1>
            <p className="text-sm text-[#6F6A64]">{description}</p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-7">{children}</div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFECE6] px-6 py-5 sm:px-8">
            <div className="flex items-center gap-2">
              {onBack ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="rounded-full border-[#D8D3CB] bg-white px-5 text-[#1A1A1A] hover:bg-[#F5F3EF]"
                >
                  Back
                </Button>
              ) : null}

              {onSkip && skipLabel ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onSkip}
                  className="rounded-full px-4 text-[#6F6A64] hover:bg-[#F3F0EA]"
                >
                  {skipLabel}
                </Button>
              ) : null}
            </div>

            <Button
              type="button"
              onClick={onNext}
              disabled={nextDisabled || isProcessing}
              className="min-w-[180px] rounded-full bg-[#1A1A1A] px-6 text-white hover:bg-[#262626]"
            >
              {isProcessing ? "Saving..." : nextLabel}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
