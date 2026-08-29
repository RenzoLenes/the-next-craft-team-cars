import { DemoPreview } from "@/components/landing/demo-preview";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FinalCta, SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function LandingPage() {
  return (
    <div className="signal-landing flex flex-1 flex-col bg-[var(--signal-bg)] text-[var(--signal-fg)]">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <DemoPreview />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
