import { Mail, MapPin, BarChart3, FileText, Zap, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "../hooks/use-in-view"
import logo from "@/assets/logo.png"

const HUB_CENTER: [number, number] = [100, 50]

const HUB_NODES = [
  {
    id: "analytics",
    label: "Analytics",
    sub: "Dashboards & KPIs",
    Icon: BarChart3,
    posCls: "left-[62%] top-[44%]",
    svgTo: [142, 50] as [number, number],
    delay: 0,
    dur: "2.8s",
    begin: "0s",
  },
  {
    id: "reports",
    label: "RelatÃ³rios",
    sub: "PDF & ExportaÃ§Ãµes",
    Icon: FileText,
    posCls: "left-[52%] top-[78%]",
    svgTo: [122, 84] as [number, number],
    delay: 80,
    dur: "3.2s",
    begin: "0.5s",
  },
  {
    id: "geo",
    label: "GeolocalizaÃ§Ã£o",
    sub: "Mapas & territÃ³rios",
    Icon: MapPin,
    posCls: "left-[22%] top-[78%]",
    svgTo: [80, 84] as [number, number],
    delay: 160,
    dur: "2.6s",
    begin: "1s",
  },
  {
    id: "api",
    label: "API Aberta",
    sub: "IntegraÃ§Ãµes custom",
    Icon: Zap,
    posCls: "left-[12%] top-[44%]",
    svgTo: [58, 50] as [number, number],
    delay: 240,
    dur: "3.5s",
    begin: "1.5s",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    sub: "Mensagens diretas",
    Icon: MessageCircle,
    posCls: "left-[22%] top-[9%]",
    svgTo: [80, 15] as [number, number],
    delay: 320,
    dur: "2.9s",
    begin: "2s",
  },
  {
    id: "email",
    label: "E-mail",
    sub: "Alertas automÃ¡ticos",
    Icon: Mail,
    posCls: "left-[52%] top-[9%]",
    svgTo: [122, 15] as [number, number],
    delay: 400,
    dur: "3.1s",
    begin: "2.5s",
  },
]

export function EcosystemSection() {
  const { ref, visible } = useInView()

  return (
    <section className="py-16 sm:py-28 bg-background" id="ecossistema">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1.5 mb-6 bg-background">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Ecossistema integrado
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]">
            Tudo conectado,{" "}
            <br className="hidden sm:block" />
            tudo no controle.
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            O Gabinete App centraliza todos os canais e fontes de dados
            do seu mandato em uma plataforma Ãºnica.
          </p>
        </div>

        <div className="md:hidden grid grid-cols-2 gap-3">
          {HUB_NODES.map((node) => (
            <div key={node.id} className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-background shadow-sm">
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <node.Icon className="size-4 text-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{node.label}</p>
                <p className="text-2xs text-muted-foreground mt-0.5">{node.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={ref}
          className="hidden md:block relative h-120 rounded-2xl border border-border overflow-hidden bg-muted/30"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
          >
            <circle cx="100" cy="50" r="22" fill="var(--primary)" opacity="0.04" />
            <circle cx="100" cy="50" r="14" fill="var(--primary)" opacity="0.06" />

            {HUB_NODES.map((node) => (
              <line
                key={node.id}
                x1={HUB_CENTER[0]} y1={HUB_CENTER[1]}
                x2={node.svgTo[0]} y2={node.svgTo[1]}
                stroke="var(--primary)"
                strokeWidth="0.4"
                style={{
                  opacity: visible ? 0.18 : 0,
                  transition: `opacity 0.9s ease ${node.delay}ms`,
                }}
              />
            ))}

            {visible && HUB_NODES.map((node) => (
              <circle key={node.id} r="1.5" fill="var(--primary)" opacity="0.65">
                <animateMotion
                  path={`M ${HUB_CENTER[0]} ${HUB_CENTER[1]} L ${node.svgTo[0]} ${node.svgTo[1]}`}
                  dur={node.dur}
                  repeatCount="indefinite"
                  begin={node.begin}
                />
              </circle>
            ))}
          </svg>

          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
              "transition-all duration-700",
              visible ? "opacity-100 scale-100" : "opacity-0 scale-75",
            )}
          >
            <div className="absolute -inset-5 rounded-full bg-primary/[0.08] animate-pulse" />
            <div className="absolute -inset-2.5 rounded-full bg-primary/[0.12]" />
            <div className="relative size-20 rounded-full bg-primary shadow-lg flex flex-col items-center justify-center gap-1.5">
              <img src={logo} alt="Gabinete App" className="h-6 w-auto brightness-0 invert" />
            </div>
          </div>

          {HUB_NODES.map((node) => (
            <div
              key={node.id}
              className={cn(
                "absolute flex items-center gap-2.5 px-3 py-2.5 rounded-xl",
                "border border-border bg-background shadow-sm",
                "transition-all duration-500",
                node.posCls,
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              )}
              style={{ transitionDelay: `${node.delay}ms`, minWidth: "160px" }}
            >
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <node.Icon className="size-4 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground leading-tight">{node.label}</p>
                <p className="text-2xs text-muted-foreground mt-0.5 truncate">{node.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

