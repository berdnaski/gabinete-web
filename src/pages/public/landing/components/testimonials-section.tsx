import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useInView } from "../hooks/use-in-view"

type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
  stars: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Em três meses nossa taxa de resolução subiu de 61% para 89%. A equipe ficou mais produtiva e os cidadãos mais satisfeitos.",
    name: "Vereador Carlos Mendes",
    role: "Câmara Municipal de Campinas",
    initials: "CM",
    stars: 5,
  },
  {
    quote:
      "Antes tínhamos demandas perdidas em e-mail e WhatsApp. Agora tudo é centralizado, rastreado e respondido com agilidade.",
    name: "Deputada Fernanda Rocha",
    role: "Assembleia Legislativa — RS",
    initials: "FR",
    stars: 5,
  },
  {
    quote:
      "O mapa de calor foi um divisor de águas. Consegui mostrar para a imprensa exatamente onde meu mandato está atuando.",
    name: "Vereador Paulo Andrade",
    role: "Câmara Municipal de Recife",
    initials: "PA",
    stars: 5,
  },
]

export function TestimonialsSection() {
  const { ref, visible } = useInView()

  return (
    <section className="py-16 sm:py-28 bg-background" id="gabinetes">
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
              Gabinetes
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]">
            Quem já usa,<br className="hidden sm:block" /> recomenda.
          </h2>
          <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Mais de 200 gabinetes em todo o Brasil confiam na plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={cn(
                "rounded-2xl border border-border bg-background p-6 flex flex-col gap-5 shadow-sm",
                "transition-all duration-700",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
