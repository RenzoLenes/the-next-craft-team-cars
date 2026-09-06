import { Hero } from "@/components/landing/hero";
import { Integrations } from "@/components/landing/integrations";
import { MetricsSimulator } from "@/components/landing/metrics-simulator";
import { Readings } from "@/components/landing/readings";
import { FinalCta, SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function LandingPage() {
  return (
    <div className="fleet-landing flex flex-1 flex-col bg-[var(--fleet-bg)] text-[var(--fleet-fg)]">
      <SiteHeader />
      <main>
        <Hero />
        <Readings />
        <Integrations />
        <MetricsSimulator />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
