import { Building2, Inbox, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "../hooks/use-in-view"

const STEPS = [
  {
    icon: Building2,
    title: "Configure seu gabinete",
    description:
      "Em minutos, cadastre sua equipe, defina categorias de demandas e personalize o fluxo de trabalho para o perfil do seu mandato.",
  },
  {
    icon: Inbox,
    title: "Receba e distribua demandas",
    description:
      "Cidadãos abrem chamados por qualquer canal. A plataforma centraliza, prioriza automaticamente e distribui para o responsável certo.",
  },
  {
    icon: FileCheck,
    title: "Comprove o resultado",
    description:
      "Relatórios automáticos mostram o impacto real do seu mandato. Transparência para seus eleitores com um clique.",
  },
]

export function HowItWorksSection() {
  const { ref, visible } = useInView()

  return (
    <section className="py-16 sm:py-28 bg-muted/20" id="como-funciona">
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1.5 mb-6 bg-background">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Como funciona
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]">
            Do zero ao impacto<br className="hidden sm:block" /> em três passos.
          </h2>
          <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Configure em minutos. Comece a resolver no mesmo dia.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+2.5rem)] right-[calc(16.66%+2.5rem)] h-px bg-border" />

          {STEPS.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={cn(
                "relative flex flex-col items-center text-center gap-5 transition-all duration-700",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="relative">
                <div className="size-20 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm">
                  <Icon className="size-8 text-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 size-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <span className="text-2xs font-bold text-primary-foreground leading-none">{i + 1}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 max-w-xs">
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
