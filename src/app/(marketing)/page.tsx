import { HeroCinematic } from "@/components/marketing/hero-cinematic";
import { FeaturesSection } from "@/components/marketing/features-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { Footer } from "@/components/marketing/footer";

export default function MarketingPage() {
  return (
    <div className="relative w-full overflow-x-hidden bg-black font-sans selection:bg-teal-500/30">
      <HeroCinematic />

      <div className="relative z-20 bg-[#fafaf9]">
        <FeaturesSection />
        <PricingSection />
        <Footer />
      </div>
    </div>
  );
}
