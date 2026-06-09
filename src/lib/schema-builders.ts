/**
 * Schema.org JSON-LD builders (Google-recommended format).
 *
 * Each function returns a plain object ready to be passed to useSchema().
 * Keep these pure — no side effects.
 */

import { SITE_CONFIG } from "@/seo.config"

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gabinete Digital",
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/logo.svg`,
    description:
      "Plataforma de gestão cívica que conecta gabinetes parlamentares aos cidadãos.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: "Portuguese",
      email: "suporte@gabinete.app",
    },
    sameAs: [
      "https://instagram.com/gabineteapp",
      "https://linkedin.com/company/gabineteapp",
    ],
  }
}

// ---------------------------------------------------------------------------
// SoftwareApplication (homepage)
// ---------------------------------------------------------------------------
export function buildSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Gabinete Digital",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    url: SITE_CONFIG.domain,
    description:
      "Plataforma SaaS para gestão de mandatos parlamentares. Centralize demandas, gerencie equipe e comprove resultados com analytics em tempo real.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      description: "14 dias grátis com acesso completo. Sem cartão de crédito.",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "4200",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Gestão Kanban de demandas",
      "Analytics e KPIs de mandato",
      "Mapa de calor geolocalizado",
      "Relatórios em PDF",
      "Notificações em tempo real",
      "Gestão de equipe",
      "Canal público para cidadãos",
    ],
  }
}

// ---------------------------------------------------------------------------
// FAQ Page
// ---------------------------------------------------------------------------
export interface FaqItem {
  q: string
  a: string
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }
}

// ---------------------------------------------------------------------------
// WebSite (sitelinks searchbox signal)
// ---------------------------------------------------------------------------
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Gabinete Digital",
    url: SITE_CONFIG.domain,
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.domain}/feed?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

// ---------------------------------------------------------------------------
// BreadcrumbList — generic helper
// ---------------------------------------------------------------------------
export interface BreadcrumbItem {
  name: string
  url: string
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
