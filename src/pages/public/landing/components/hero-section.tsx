import { useNavigate } from "react-router-dom"
import { ArrowRight, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const TRUST_STATS = [
  { value: "200+", label: "gabinetes ativos" },
  { value: "12k+", label: "demandas gerenciadas" },
  { value: "87%", label: "taxa de resolução" },
]

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative pt-16 overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-140 bg-linear-to-b from-primary/[0.07] to-transparent pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-16 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1.5 mb-8 bg-background">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
            A nova era da gestão pública
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight leading-[1.1] text-foreground mb-5">
          A gestão do seu mandato,{" "}
          <span className="text-primary">transformada.</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
          Centralize demandas, conecte cidadãos e comprove resultado.
          Uma plataforma feita para o gestor público moderno.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <Button size="lg" onClick={() => navigate("/sign-up")}>
            Começar grátis
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById("funcionalidades")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ver funcionalidades
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mb-10">
          Sem cartão de crédito · Configuração em minutos
        </p>

        <div className="flex items-center gap-px">
          {TRUST_STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={cn(
                "flex flex-col items-center gap-0.5 px-6 sm:px-8",
                i > 0 && "border-l border-border",
              )}
            >
              <span className="text-sm font-bold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-16">
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-lg bg-zinc-900">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <button className="group cursor-pointer size-16 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all duration-200">
              <Play className="size-6 text-white fill-white ml-0.5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <p className="text-xs font-medium text-white/40 tracking-wide">
              Ver demo da plataforma
            </p>
          </div>
        </div>

        <div className="absolute inset-x-5 sm:inset-x-8 bottom-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none rounded-b-2xl" />
      </div>
    </section>
  )
}
