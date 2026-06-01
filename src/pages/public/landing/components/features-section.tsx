import { ClipboardList, BarChart3, MapPin, FileText, Bell, Users, ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "../hooks/use-in-view"

type Feature = {
  id: string
  icon: LucideIcon
  title: string
  description: string
  highlight: boolean
}

const FEATURES: Feature[] = [
  {
    id: "kanban",
    icon: ClipboardList,
    title: "Gestão Kanban",
    description: "Visualize e mova demandas entre etapas. Equipe alinhada em tempo real, sem e-mail, sem planilha.",
    highlight: true,
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics & KPIs",
    description: "Dashboards com métricas do seu mandato. Produtividade da equipe e satisfação do cidadão.",
    highlight: false,
  },
  {
    id: "map",
    icon: MapPin,
    title: "Mapa de Calor",
    description: "Visualize onde as demandas se concentram. Priorize com dados, não com intuição.",
    highlight: false,
  },
  {
    id: "reports",
    icon: FileText,
    title: "Relatórios em PDF",
    description: "Exporte relatórios prontos para prestação de contas e assessoria de imprensa.",
    highlight: false,
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notificações em Tempo Real",
    description: "Cidadão e equipe avisados automaticamente a cada mudança de status.",
    highlight: false,
  },
  {
    id: "team",
    icon: Users,
    title: "Gestão de Equipe",
    description: "Atribua responsáveis, defina permissões e acompanhe a produtividade de cada assessor.",
    highlight: false,
  },
]

export function FeaturesSection() {
  const { ref, visible } = useInView()

  return (
    <section className="py-28 bg-muted/30" id="funcionalidades">
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
              Funcionalidades
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]">
            Tudo que o seu gabinete<br className="hidden sm:block" /> precisa, em um lugar.
          </h2>
          <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Ferramentas pensadas para o dia a dia da gestão pública moderna.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.id}
              className={cn(
                "group rounded-2xl border bg-background p-6 flex flex-col gap-4 shadow-sm",
                "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
                feature.highlight ? "border-primary/25 bg-primary/[0.025]" : "border-border",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center",
                  feature.highlight ? "bg-primary/10" : "bg-muted",
                )}
              >
                <feature.icon
                  className={cn("size-5", feature.highlight ? "text-primary" : "text-foreground")}
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Saiba mais
                <ArrowRight className="size-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
