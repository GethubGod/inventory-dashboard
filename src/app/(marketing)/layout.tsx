import { ReactNode } from "react";
import { Navbar } from "@/components/marketing/navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black text-white selection:bg-teal-500/30">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
