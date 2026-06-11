import { useState, useEffect } from "react"
import { MessageCircle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@/assets/logo.png"
import { APP_URL, WHATSAPP_URL } from "../constants"
import { trackWhatsappClick } from "@/lib/analytics"

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Gabinetes", href: "#gabinetes" },
  { label: "FAQ", href: "#faq" },
]

export function LandingHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm transition-shadow duration-200",
        scrolled ? "shadow-sm" : "border-b border-border",
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <img src={logo} alt="Gabinete App" className="h-7 sm:h-8 w-auto shrink-0" />

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <a
            href={`${APP_URL}/login`}
            className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
          >
            Entrar
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsappClick("header")}
            className="cursor-pointer inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <MessageCircle className="size-4 text-muted-foreground" />
            Falar com o CEO
          </a>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <a
            href={`${APP_URL}/login`}
            className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
          >
            Entrar
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-5 py-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-3 border-b border-border/40 last:border-0 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 pb-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { setOpen(false); trackWhatsappClick("header_mobile") }}
                className="cursor-pointer w-full inline-flex items-center justify-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <MessageCircle className="size-4 text-muted-foreground" />
                Falar com o CEO
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

