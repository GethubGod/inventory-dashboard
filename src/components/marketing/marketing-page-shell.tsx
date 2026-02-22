import { ReactNode } from "react";
import { Footer } from "./footer";

interface MarketingPageShellProps {
  children: ReactNode;
}

export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="w-full relative overflow-x-hidden font-sans selection:bg-teal-500/30">
      <div className="pt-[60px] lg:pt-[72px]">{children}</div>
      <Footer />
    </div>
  );
}
