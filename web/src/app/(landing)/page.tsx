import { Capabilities } from "@/components/landing/capabilities";
import { ControlSignals } from "@/components/landing/control-signals";
import { Hero } from "@/components/landing/hero";
import { MetricsSimulator } from "@/components/landing/metrics-simulator";
import { FinalCta, SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function LandingPage() {
  return (
    <div className="fleet-landing flex flex-1 flex-col bg-[var(--fleet-bg)] text-[var(--fleet-fg)]">
      <SiteHeader />
      <main>
        <Hero />
        <Capabilities />
        <ControlSignals />
        <MetricsSimulator />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
