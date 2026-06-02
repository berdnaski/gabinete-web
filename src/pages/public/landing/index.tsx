import { LandingHeader } from "./components/landing-header"
import { HeroSection } from "./components/hero-section"
import { EcosystemSection } from "./components/ecosystem-section"
import { StatsSection } from "./components/stats-section"
import { KanbanSection } from "./components/kanban-section"
import { HowItWorksSection } from "./components/how-it-works-section"
import { FeaturesSection } from "./components/features-section"
import { TestimonialsSection } from "./components/testimonials-section"
import { CTASection } from "./components/cta-section"
import { FAQSection } from "./components/faq-section"
import { LandingFooter } from "./components/landing-footer"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <EcosystemSection />
      <StatsSection />
      <KanbanSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
      <LandingFooter />
    </div>
  )
}
