import { CheckCircle2, Circle, Link2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";

type SquareConnectionStepProps = {
  status: "not_connected" | "connected" | "skipped";
  merchantId: string | null;
  onConnect: () => void;
  isConnecting: boolean;
};

export function SquareConnectionStep({ status, merchantId, onConnect, isConnecting }: SquareConnectionStepProps) {
  const isConnected = status === "connected";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#E3DED6] bg-[#FCFBF9] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
            ) : (
              <Circle className="h-5 w-5 text-[#8A837A]" aria-hidden />
            )}
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                {isConnected ? "Connected to Square" : "Square not connected"}
              </p>
              <p className="text-sm text-[#6A655F]">
                {isConnected
                  ? "Token is stored and ready for sync."
                  : "Connect now to pull sales and catalog data for forecasting."}
              </p>
            </div>
          </div>

          <Pill variant={isConnected ? "success" : "subtle"}>{isConnected ? "Connected" : "Pending"}</Pill>
        </div>

        {merchantId ? <p className="mt-3 text-xs text-[#6A655F]">Merchant ID: {merchantId}</p> : null}
      </div>

      <Button
        type="button"
        onClick={onConnect}
        disabled={isConnecting}
        className="rounded-full bg-[#1A1A1A] px-5 text-white hover:bg-[#262626]"
      >
        <Link2 className="h-4 w-4" aria-hidden />
        {isConnecting ? "Redirecting..." : isConnected ? "Reconnect Square" : "Connect Square POS"}
      </Button>

      {!isConnected ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
          <AlertTitle>Skipping limits automation</AlertTitle>
          <AlertDescription>
            You can continue without Square, but sales sync, forecasting, and recipe mapping will remain limited until connected.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
