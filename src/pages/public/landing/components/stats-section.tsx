import { useState, useEffect, useRef } from "react"
import { TrendingUp, CheckCircle2, Star } from "lucide-react"
import { cn } from "@/lib/utils"

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const t0 = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.floor(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, active])
  return value
}

export function StatsSection() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.15 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const demands = useCountUp(1245, 1800, active)
  const rate = useCountUp(88, 1400, active)
  const satisfaction = useCountUp(48, 1200, active)

  return (
    <section ref={ref} className="py-28 bg-muted/20" id="impacto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1.5 mb-6 bg-background">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Impacto em números
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]">
            Prova de que funciona.
          </h2>
          <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Dados reais de gabinetes que usam a plataforma hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={cn(
              "rounded-2xl border border-border bg-background p-8 flex flex-col gap-6 shadow-sm transition-all duration-700",
              active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <div className="flex items-start justify-between">
              <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                Demandas Resolvidas
              </p>
              <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                <TrendingUp className="size-3" />
                +12%
              </span>
            </div>
            <div className="flex items-end gap-2 leading-none">
              <span className="text-6xl font-bold text-foreground tabular-nums">
                {demands.toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-[1800ms] ease-out"
                  style={{ width: active ? "82%" : "0%" }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Meta anual</span>
                <span className="font-semibold text-foreground">82% concluída</span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "rounded-2xl border border-border bg-background p-8 flex flex-col gap-6 shadow-sm transition-all duration-700 delay-100",
              active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <div className="flex items-start justify-between">
              <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                Taxa de Resolução
              </p>
              <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                <CheckCircle2 className="size-3" />
                Meta
              </span>
            </div>
            <div className="flex items-end gap-1.5 leading-none">
              <span className="text-6xl font-bold text-foreground tabular-nums">{rate}</span>
              <span className="text-2xl font-semibold text-muted-foreground mb-1">%</span>
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24 shrink-0">Plataforma</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-[1400ms] ease-out"
                    style={{ width: active ? "88%" : "0%" }}
                  />
                </div>
                <span className="text-xs font-bold text-foreground w-8 text-right">88%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24 shrink-0">Média do setor</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-muted-foreground/40 transition-all duration-[1200ms] ease-out"
                    style={{ width: active ? "71%" : "0%" }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground w-8 text-right">71%</span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "rounded-2xl border border-border bg-background p-8 flex flex-col gap-6 shadow-sm transition-all duration-700 delay-200",
              active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <div className="flex items-start justify-between">
              <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                Satisfação Cidadã
              </p>
              <span className="text-xs text-muted-foreground">4.2k avaliações</span>
            </div>
            <div className="flex items-end gap-1.5 leading-none">
              <span className="text-6xl font-bold text-foreground tabular-nums">
                {(satisfaction / 10).toFixed(1)}
              </span>
              <span className="text-2xl font-semibold text-muted-foreground mb-1">/5</span>
            </div>
            <div className="flex items-center gap-1 mt-auto">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "size-7 text-amber-400 fill-amber-400 transition-opacity duration-300",
                    !active && "opacity-0",
                    active && star === 5 && "opacity-55",
                  )}
                  style={{ transitionDelay: `${700 + (star - 1) * 80}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">
            Dados coletados dos gabinetes ativos na plataforma
          </span>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Ao vivo</span>
          </div>
        </div>
      </div>
    </section>
  )
}
