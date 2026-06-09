import logo from "@/assets/logo.png"

type FooterLink = { label: string; href: string }

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Produto: [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Gabinetes", href: "#gabinetes" },
    { label: "FAQ", href: "#faq" },
  ],
  Empresa: [
    { label: "Sobre nÃ³s", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Imprensa", href: "#" },
    { label: "Contato", href: "#" },
  ],
  Legal: [
    { label: "Termos de Uso", href: "/termos-de-uso" },
    { label: "Privacidade", href: "/politica-de-privacidade" },
    { label: "LGPD", href: "/politica-de-privacidade" },
  ],
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          <div className="col-span-2 flex flex-col gap-4">
            <img
              src={logo}
              alt="Gabinete App"
              className="h-6 w-auto max-w-32.5 object-contain object-left"
            />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-50">
              A plataforma de gestÃ£o de mandato feita para o gestor pÃºblico moderno.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Todos os sistemas operando</span>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-4">
              <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                {title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Â© {new Date().getFullYear()} Gabinete App. Todos os direitos reservados.
          </span>
          <span className="text-xs text-muted-foreground">
            Feito com cuidado no Brasil.
          </span>
        </div>
      </div>
    </footer>
  )
}

