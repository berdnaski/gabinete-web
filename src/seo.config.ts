/**
 * Central SEO configuration for gabineteapp.com.br
 *
 * All metadata is defined here — never hardcoded in individual components.
 * Usage: import { SEO_CONFIG, getPageSeo } from "@/seo.config"
 */

export const SITE_CONFIG = {
  name: "Gabinete Digital",
  domain: "https://gabineteapp.com.br",
  defaultOgImage: "/og-default.png",
  locale: "pt_BR",
  twitterHandle: "@gabineteapp",
  themeColor: "#2563EB",
} as const

export interface PageSeoConfig {
  title: string
  description: string
  canonical: string
  ogImage?: string
  ogType?: "website" | "article"
  noindex?: boolean
  keywords?: string
}

export const SEO_CONFIG: Record<string, PageSeoConfig> = {
  home: {
    title: "Gabinete Digital — Gestão de Mandato para Parlamentares",
    description:
      "Centralize demandas, conecte cidadãos e comprove resultados. A plataforma de gestão cívica feita para vereadores, deputados e senadores. Comece grátis.",
    canonical: "https://gabineteapp.com.br/",
    ogImage: "/og-default.png",
    ogType: "website",
    keywords:
      "gestão de mandato, gabinete parlamentar, demandas cidadãos, vereador, deputado, gestão pública, plataforma cívica",
  },
  termsOfUse: {
    title: "Termos de Uso — Gabinete Digital",
    description:
      "Leia os Termos de Uso da plataforma Gabinete Digital. Condições de uso, responsabilidades e diretrizes para gabinetes e cidadãos.",
    canonical: "https://gabineteapp.com.br/termos-de-uso",
    ogType: "website",
    noindex: true,
  },
  privacyPolicy: {
    title: "Política de Privacidade (LGPD) — Gabinete Digital",
    description:
      "Saiba como o Gabinete Digital coleta, usa e protege seus dados pessoais em conformidade com a LGPD — Lei nº 13.709/2018.",
    canonical: "https://gabineteapp.com.br/politica-de-privacidade",
    ogType: "website",
    noindex: true,
  },
  login: {
    title: "Entrar — Gabinete Digital",
    description: "Acesse sua conta no Gabinete Digital e gerencie as demandas do seu mandato.",
    canonical: "https://gabineteapp.com.br/login",
    ogType: "website",
    noindex: true,
  },
  signUp: {
    title: "Criar conta grátis — Gabinete Digital",
    description:
      "Cadastre-se gratuitamente e comece a centralizar demandas do seu gabinete parlamentar hoje. Sem cartão de crédito.",
    canonical: "https://gabineteapp.com.br/sign-up",
    ogType: "website",
    noindex: true,
  },
}

/**
 * Returns the SEO config for a given page key, falling back to the homepage config.
 */
export function getPageSeo(key: keyof typeof SEO_CONFIG): PageSeoConfig {
  return SEO_CONFIG[key] ?? SEO_CONFIG.home
}

/**
 * Builds the full `<title>` string applying the site suffix.
 * If the title already ends with the site name, returns it unchanged.
 */
export function buildTitle(title: string): string {
  const suffix = ` — ${SITE_CONFIG.name}`
  return title.endsWith(SITE_CONFIG.name) ? title : title.replace(suffix, "") + suffix
}
