import { HeroCinematic } from "@/components/marketing/hero-cinematic";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CTASection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export default function MarketingPage() {
  return (
    <div className="w-full relative overflow-x-hidden bg-black font-sans selection:bg-teal-500/30">
      {/* 
        The cinematic hero handles the complex 650vh scroll bound.
        It transitions the background from black to off-white smoothly,
        meaning the sections that follow (which are off-white) blend seamlessly.
      */}
      <HeroCinematic />

      {/* 
        Supporting sections placed directly after the hero.
        Because the hero handles its own exit animation, it perfectly hands off the viewport to these.
      */}
      <div className="relative z-20 bg-[#fafaf9]">
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
