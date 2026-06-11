import { useMemo } from "react"
import { useSeo } from "@/hooks/use-seo"
import { useSchema } from "@/hooks/use-schema"
import { getPageSeo } from "@/seo.config"
import {
  buildSoftwareApplicationSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildFaqSchema,
} from "@/lib/schema-builders"
import { LandingHeader } from "./components/landing-header"
import { HeroSection } from "./components/hero-section"
import { EcosystemSection } from "./components/ecosystem-section"
import { StatsSection } from "./components/stats-section"
import { KanbanSection } from "./components/kanban-section"
import { HowItWorksSection } from "./components/how-it-works-section"
import { FeaturesSection } from "./components/features-section"
import { TestimonialsSection } from "./components/testimonials-section"
import { CTASection } from "./components/cta-section"
import { FAQSection, FAQ_ITEMS } from "./components/faq-section"
import { LandingFooter } from "./components/landing-footer"

export function LandingPage() {
  useSeo(getPageSeo("home"))

  const softwareSchema = useMemo(() => buildSoftwareApplicationSchema(), [])
  const orgSchema = useMemo(() => buildOrganizationSchema(), [])
  const websiteSchema = useMemo(() => buildWebSiteSchema(), [])
  const faqSchema = useMemo(() => buildFaqSchema(FAQ_ITEMS), [])

  useSchema(softwareSchema)
  useSchema(orgSchema)
  useSchema(websiteSchema)
  useSchema(faqSchema)

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main id="inicio">
        <HeroSection />
        <EcosystemSection />
        <StatsSection />
        <KanbanSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  )
}
