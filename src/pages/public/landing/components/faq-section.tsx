import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "../hooks/use-in-view"

type FaqItem = { q: string; a: string }

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Quanto tempo leva para configurar o gabinete?",
    a: "A configuração inicial leva menos de 15 minutos. Você cadastra os membros da equipe, define as categorias de demanda e já está pronto para receber os primeiros chamados.",
  },
  {
    q: "O sistema funciona para qualquer cargo eletivo?",
    a: "Sim. Vereadores, deputados estaduais e federais, senadores e prefeituras usam a plataforma. O fluxo é adaptável ao tamanho e perfil de cada gabinete.",
  },
  {
    q: "Os cidadãos precisam instalar algum aplicativo?",
    a: "Não. Os cidadãos abrem demandas por link público, WhatsApp ou e-mail. Não é necessário baixar nada ou criar conta.",
  },
  {
    q: "Como funciona o suporte?",
    a: "Oferecemos suporte por chat e e-mail durante horário comercial. Gabinetes nos planos avançados têm acesso a um gerente de sucesso dedicado.",
  },
  {
    q: "Os dados são seguros e privados?",
    a: "Sim. Toda a plataforma segue a LGPD. Os dados ficam em servidores no Brasil, com criptografia em trânsito e em repouso. Você tem total controle sobre os dados do seu gabinete.",
  },
  {
    q: "Existe período de teste gratuito?",
    a: "Sim, 14 dias grátis com acesso completo a todas as funcionalidades. Sem cartão de crédito exigido para começar.",
  },
]

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const { ref, visible } = useInView()

  return (
    <section className="py-16 sm:py-28 bg-muted/20" id="faq">
      <div ref={ref} className="max-w-3xl mx-auto px-5 sm:px-8">
        <div
          className={cn(
            "text-center mb-14 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1.5 mb-6 bg-background">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.1]">
            Perguntas frequentes.
          </h2>
        </div>

        <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden bg-background shadow-sm">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className={cn(
                  "w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150",
                  openIdx === i ? "bg-muted/30" : "hover:bg-muted/20",
                )}
              >
                <span className="text-sm font-medium text-foreground">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
                    openIdx === i && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200 ease-out",
                  openIdx === i ? "max-h-48" : "max-h-0",
                )}
              >
                <p className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
