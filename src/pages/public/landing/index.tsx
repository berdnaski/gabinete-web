import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Globe,
  Lock,
  MapPin,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let t0: number | null = null
    const tick = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, start])
  return count
}

function LandingNav() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-200",
        scrolled ? "bg-[#09090B]/90 backdrop-blur-md border-b border-white/8" : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/android-chrome-192x192.png" alt="Gabinete Digital" className="size-6 rounded-md" />
          <span className="text-sm font-semibold text-white">Gabinete Digital</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Funcionalidades", href: "#funcionalidades" },
            { label: "Como funciona", href: "#como-funciona" },
            { label: "Plataforma", href: "#plataforma" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-white/40 hover:text-white/80 transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-sm text-white/40 hover:text-white/80 transition-colors duration-150 px-4 py-2"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/sign-up")}
            className="cursor-pointer bg-white text-[#09090B] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors duration-150"
          >
            Começar grátis
          </button>
        </div>
      </div>
    </nav>
  )
}

function HeroMockup() {
  const rows = [
    { title: "Buraco na Rua das Flores, n° 48", dot: "bg-amber-400", badge: "Em andamento", bc: "text-amber-600 bg-amber-50" },
    { title: "Iluminação pública – Parque Central", dot: "bg-emerald-400", badge: "Resolvida", bc: "text-emerald-600 bg-emerald-50" },
    { title: "Limpeza de terreno abandonado", dot: "bg-blue-400", badge: "Em análise", bc: "text-blue-600 bg-blue-50" },
    { title: "Reparo calçada Escola Municipal", dot: "bg-slate-300", badge: "Aberta", bc: "text-slate-500 bg-slate-50" },
  ]
  return (
    <div className="rounded-2xl overflow-hidden border border-white/12 shadow-2xl">
      <div className="bg-[#1C1C1E] px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-[#FF5F57]" />
          <div className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="size-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 mx-3">
          <div className="bg-[#2C2C2E] rounded px-3 py-1 text-2xs text-white/25 flex items-center gap-2 max-w-[220px] mx-auto">
            <div className="size-1.5 rounded-full bg-emerald-400" />
            app.gabinete.digital
          </div>
        </div>
      </div>
      <div className="bg-white flex lp-mockup-sm">
        <div className="w-12 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-4 gap-3 shrink-0">
          <div className="size-6 rounded-md bg-blue-600 flex items-center justify-center">
            <Globe className="size-3 text-white" />
          </div>
          {[ClipboardList, Users, MapPin, Bell, BarChart3].map((Icon, i) => (
            <div
              key={i}
              className={cn(
                "size-7 rounded-md flex items-center justify-center",
                i === 0 ? "bg-blue-50 text-blue-600" : "text-slate-300",
              )}
            >
              <Icon className="size-3.5" />
            </div>
          ))}
        </div>
        <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Demandas · 48 abertas</p>
              <p className="text-2xs text-slate-400 mt-0.5">Atualizado há 2 min</p>
            </div>
            <div className="h-6 px-3 rounded-lg bg-blue-50 border border-blue-100 flex items-center">
              <span className="text-2xs text-blue-600 font-semibold">Filtrar</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {rows.map((row) => (
              <div key={row.title} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2">
                <div className={cn("size-1.5 rounded-full shrink-0", row.dot)} />
                <span className="text-xs text-slate-700 flex-1 truncate">{row.title}</span>
                <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full shrink-0", row.bc)}>
                  {row.badge}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto grid grid-cols-3 gap-2">
            {[
              { label: "Abertas", val: "48", cls: "text-slate-700 bg-slate-50 border-slate-100" },
              { label: "Andamento", val: "23", cls: "text-amber-700 bg-amber-50 border-amber-100" },
              { label: "Resolvidas", val: "156", cls: "text-emerald-700 bg-emerald-50 border-emerald-100" },
            ].map(({ label, val, cls }) => (
              <div key={label} className={cn("rounded-xl px-2.5 py-2 border text-center", cls)}>
                <p className="text-sm font-bold">{val}</p>
                <p className="text-2xs opacity-60 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  const navigate = useNavigate()
  const mockupRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    const fn = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        if (mockupRef.current) {
          mockupRef.current.style.transform = `translateY(${-window.scrollY * 0.08}px)`
        }
      })
    }
    window.addEventListener("scroll", fn, { passive: true })
    return () => {
      window.removeEventListener("scroll", fn)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center bg-[#09090B] overflow-hidden">
      <div className="lp-hero-glow absolute top-1/2 right-[30%] -translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-6 w-full py-24 pt-36 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-card-enter">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3.5 py-1.5 mb-8">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-white/50 font-medium">Plataforma para gestão cívica</span>
          </div>

          <h1 className="text-[2.9rem] lg:text-[3.5rem] font-black text-white leading-[1.07] tracking-tight mb-6">
            Demandas do cidadão,{" "}
            <span className="lp-shimmer-text">resolvidas</span>{" "}
            com eficiência.
          </h1>

          <p className="text-white/40 text-[1rem] leading-relaxed mb-10 max-w-md">
            Conecte gabinetes parlamentares ao cidadão. Gerencie solicitações, acompanhe status em tempo real e construa confiança pública.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/sign-up")}
              className="cursor-pointer bg-white text-[#09090B] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-white/90 transition-colors duration-150 flex items-center gap-2"
            >
              Começar gratuitamente
              <ArrowRight className="size-4" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer border border-white/10 text-white/50 font-medium text-sm px-6 py-3 rounded-lg hover:border-white/20 hover:text-white/80 transition-colors duration-150"
            >
              Ver demonstração
            </button>
          </div>

          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/8">
            <div className="flex -space-x-2">
              {[
                ["bg-blue-500", "A"],
                ["bg-indigo-500", "M"],
                ["bg-violet-500", "R"],
                ["bg-pink-500", "S"],
              ].map(([bg, initial], i) => (
                <div
                  key={i}
                  className={cn(
                    "size-7 rounded-full border-2 border-[#09090B] flex items-center justify-center text-white text-2xs font-bold",
                    bg,
                  )}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/30 text-xs">+200 gabinetes confiam</p>
            </div>
          </div>
        </div>

        <div
          ref={mockupRef}
          className="relative hidden lg:block animate-fade-slide-in will-change-transform"
        >
          <div className="absolute -inset-8 rounded-3xl bg-blue-600/6 blur-3xl" />
          <div className="relative">
            <HeroMockup />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#FAFAFA] to-transparent" />
    </section>
  )
}

function TickerSection() {
  const items = [
    { icon: ClipboardList, text: "+12.000 demandas gerenciadas" },
    { icon: CheckCircle2, text: "87% taxa de resolução" },
    { icon: Users, text: "+200 gabinetes ativos" },
    { icon: MessageSquare, text: "+48.000 comentários" },
    { icon: MapPin, text: "24 estados cobertos" },
    { icon: Zap, text: "Resposta em menos de 24h" },
    { icon: Shield, text: "LGPD compliant" },
    { icon: BarChart3, text: "Dashboard em tempo real" },
  ]
  const doubled = [...items, ...items]
  return (
    <div className="bg-[#09090B] border-y border-white/5 py-3.5 overflow-hidden">
      <div className="lp-ticker gap-14 whitespace-nowrap">
        {doubled.map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-2.5 shrink-0">
            <Icon className="size-3.5 text-white/20 shrink-0" />
            <span className="text-sm text-white/30 font-medium">{text}</span>
            <span className="text-white/10 ml-8">·</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesSection() {
  const { ref, visible } = useReveal(0.08)
  return (
    <section id="funcionalidades" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className={cn(
            "mb-12 transition-opacity duration-500",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="inline-flex items-center gap-1.5 text-2xs font-bold text-blue-600 uppercase tracking-[0.15em] mb-4">
            <Sparkles className="size-3" />
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-[2.4rem] font-black text-slate-900 leading-[1.1] tracking-tight max-w-xl">
            Tudo que seu gabinete precisa para atender melhor
          </h2>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-500",
            visible ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDelay: "80ms" }}
        >
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between lp-bento-card lp-bento-tall cursor-default">
            <div>
              <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                <ClipboardList className="size-5 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Gestão de demandas</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Centralize solicitações com filtros, busca e priorização inteligente. Nada se perde.
              </p>
            </div>
            <div className="mt-5 space-y-2">
              {[
                { title: "Buraco na Rua das Flores, n° 48", dot: "bg-amber-400", badge: "Em andamento", bc: "text-amber-600 bg-amber-50" },
                { title: "Iluminação pública – Parque Central", dot: "bg-emerald-400", badge: "Resolvida", bc: "text-emerald-600 bg-emerald-50" },
                { title: "Limpeza de terreno abandonado", dot: "bg-slate-300", badge: "Aberta", bc: "text-slate-500 bg-slate-50" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
                  <div className={cn("size-1.5 rounded-full shrink-0", item.dot)} />
                  <span className="text-xs text-slate-700 flex-1 truncate">{item.title}</span>
                  <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full shrink-0", item.bc)}>{item.badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col lp-bento-card cursor-default">
            <div className="size-10 rounded-xl bg-violet-50 flex items-center justify-center mb-5">
              <MessageSquare className="size-5 text-violet-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Comunicação direta</h3>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              Chat integrado com histórico completo. Cidadão e gabinete na mesma página.
            </p>
            <div className="mt-5 space-y-2">
              <div className="flex gap-2 items-start">
                <div className="size-6 rounded-full bg-violet-100 shrink-0 mt-0.5 flex items-center justify-center">
                  <Users className="size-3 text-violet-500" />
                </div>
                <div className="bg-slate-50 rounded-xl rounded-tl-sm px-3 py-2">
                  <p className="text-2xs text-slate-600">Quando será resolvido?</p>
                </div>
              </div>
              <div className="flex gap-2 items-start flex-row-reverse">
                <div className="size-6 rounded-full bg-blue-100 shrink-0 mt-0.5 flex items-center justify-center">
                  <Globe className="size-3 text-blue-500" />
                </div>
                <div className="bg-blue-50 rounded-xl rounded-tr-sm px-3 py-2">
                  <p className="text-2xs text-blue-700">Prazo: até 5 dias úteis.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col lp-bento-card cursor-default">
            <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
              <MapPin className="size-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Mapa georreferenciado</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Visualize demandas no mapa. Identifique áreas críticas e priorize regiões.
            </p>
            <div className="mt-5 h-[60px] rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 lp-dot-grid opacity-30" />
              <div className="relative flex gap-3">
                {[
                  { bg: "bg-red-400", x: "-translate-x-3 translate-y-1" },
                  { bg: "bg-amber-400", x: "translate-x-1 -translate-y-2" },
                  { bg: "bg-emerald-500", x: "translate-x-4 translate-y-2" },
                ].map(({ bg, x }, i) => (
                  <div key={i} className={cn("size-3 rounded-full shadow border-2 border-white", bg, x)} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col lp-bento-card cursor-default">
            <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center mb-5">
              <Bell className="size-5 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Notificações ao vivo</h3>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              Alertas automáticos de prazo. Zero demanda esquecida.
            </p>
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2.5 bg-amber-50 rounded-xl px-3 py-2.5">
                <div className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-2xs text-amber-700 font-medium">3 demandas com prazo vencendo</p>
              </div>
              <div className="flex items-center gap-2.5 bg-blue-50 rounded-xl px-3 py-2.5">
                <div className="size-1.5 rounded-full bg-blue-400" />
                <p className="text-2xs text-blue-700 font-medium">5 novas solicitações hoje</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col lp-bento-card cursor-default">
            <div className="size-10 rounded-xl bg-rose-50 flex items-center justify-center mb-5">
              <BarChart3 className="size-5 text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Métricas e relatórios</h3>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              KPIs de desempenho, tempo médio de resolução e exportação de dados.
            </p>
            <div className="mt-5 flex items-end gap-1 h-12">
              {[38, 62, 44, 78, 52, 88, 68].map((h, i) => (
                <div
                  key={i}
                  className={cn("flex-1 rounded-sm", i === 5 ? "bg-rose-400" : "bg-rose-100")}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-3 rounded-2xl bg-[#09090B] border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 lp-bento-card lp-bento-card-dark cursor-default">
            <div className="flex items-start gap-5">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1.5">Segurança e conformidade LGPD</h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-lg">
                  Autenticação segura, logs de auditoria e controle granular de permissões. Seus dados e os dos cidadãos estão protegidos.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2.5">
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1.5">
                <div className="size-1.5 rounded-full bg-emerald-400" />
                <span className="text-2xs text-white/45 font-medium">100% LGPD</span>
              </div>
              <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1.5">
                <Lock className="size-3 text-white/30" />
                <span className="text-2xs text-white/45 font-medium">E2E Encrypt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeatmapSection() {
  const { ref, visible } = useReveal(0.1)
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div
            className={cn(
              "lg:col-span-2 transition-opacity duration-500",
              visible ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
              <MapPin className="size-5 text-emerald-600" />
            </div>
            <h2 className="text-3xl sm:text-[2rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-4">
              Mapa de calor das demandas da sua cidade
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-7">
              Visualize em tempo real onde as demandas mais urgentes estão concentradas. Priorize regiões, identifique padrões e tome decisões baseadas em dados geográficos.
            </p>
            <ul className="space-y-3">
              {[
                "Mapa de calor por urgência — Urgente, Alta, Média, Baixa",
                "Filtros por bairro, categoria e responsável",
                "Atualização em tempo real via WebSocket",
                "Modo escuro integrado ao Google Maps",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              "lg:col-span-3 transition-opacity duration-500",
              visible ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <div className="bg-[#1C1C1E] px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="size-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="size-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-3 text-center text-2xs text-white/25">
                  Mapa de demandas — Região Centro-Sul
                </div>
              </div>
              <div className="lp-heatmap-bg lp-map-preview relative overflow-hidden">
                <div className="lp-heat-blob lp-heat-red size-28 top-[18%] left-[32%]" />
                <div className="lp-heat-blob lp-heat-red size-20 top-[34%] left-[40%]" />
                <div className="lp-heat-blob lp-heat-orange size-24 top-[52%] left-[18%]" />
                <div className="lp-heat-blob lp-heat-orange size-16 top-[14%] left-[62%]" />
                <div className="lp-heat-blob lp-heat-yellow size-20 top-[62%] left-[54%]" />
                <div className="lp-heat-blob lp-heat-yellow size-14 top-[38%] left-[74%]" />
                <div className="lp-heat-blob lp-heat-green size-16 top-[72%] left-[78%]" />
                <div className="lp-heat-blob lp-heat-green size-12 top-[10%] left-[12%]" />
                <div className="absolute top-[15%] left-[31%]">
                  <div className="size-3 rounded-full bg-red-500 border-2 border-white shadow-lg" />
                </div>
                <div className="absolute top-[31%] left-[39%]">
                  <div className="size-3 rounded-full bg-red-500 border-2 border-white shadow-lg" />
                </div>
                <div className="absolute top-[50%] left-[17%]">
                  <div className="size-2.5 rounded-full bg-orange-500 border-2 border-white shadow-md" />
                </div>
                <div className="absolute top-[12%] left-[61%]">
                  <div className="size-2.5 rounded-full bg-orange-400 border-2 border-white shadow-md" />
                </div>
                <div className="absolute top-[60%] left-[53%]">
                  <div className="size-2 rounded-full bg-yellow-400 border-2 border-white shadow-md" />
                </div>
                <div className="absolute top-[70%] left-[77%]">
                  <div className="size-2 rounded-full bg-emerald-400 border-2 border-white shadow-md" />
                </div>
                <div className="absolute top-[5%] right-3 bg-[#192030]/95 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2.5">
                  <p className="text-2xs text-white/40 mb-0.5">Demandas visíveis</p>
                  <p className="text-xl font-black text-white leading-none">48</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="size-1.5 rounded-full bg-red-400" />
                    <span className="text-2xs text-white/40">12 urgentes</span>
                  </div>
                </div>
                <div className="absolute right-3 bottom-14 bg-[#192030]/90 border border-white/10 rounded-lg overflow-hidden">
                  <div className="px-2.5 py-1.5 border-b border-white/10 text-white/40 text-sm font-bold cursor-pointer hover:bg-white/5 transition-colors text-center">+</div>
                  <div className="px-2.5 py-1.5 text-white/40 text-sm font-bold cursor-pointer hover:bg-white/5 transition-colors text-center">−</div>
                </div>
                <div className="absolute bottom-3 left-3 bg-[#192030]/95 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 flex items-center gap-3">
                  {[
                    { dot: "bg-red-500", label: "Urgente" },
                    { dot: "bg-orange-500", label: "Alta" },
                    { dot: "bg-yellow-400", label: "Média" },
                    { dot: "bg-emerald-400", label: "Baixa" },
                  ].map(({ dot, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={cn("size-2 rounded-full", dot)} />
                      <span className="text-2xs text-white/50">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const { ref, visible } = useReveal(0.1)
  const steps = [
    {
      icon: Users,
      title: "Cidadão registra a demanda",
      description: "Título, descrição, localização e fotos — pelo app ou site, autenticado ou anônimo.",
    },
    {
      icon: Bell,
      title: "Gabinete categoriza e atribui",
      description: "A equipe é notificada em tempo real. Prioriza e atribui ao membro responsável.",
    },
    {
      icon: Zap,
      title: "Acompanhamento em tempo real",
      description: "Status atualizado a cada etapa. Cidadão e gabinete se comunicam pelo chat.",
    },
    {
      icon: CheckCircle2,
      title: "Resolução e avaliação",
      description: "Ao concluir, o cidadão confirma e avalia. Dados para melhoria contínua.",
    },
  ]
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref}>
          <div
            className={cn(
              "mb-16 transition-opacity duration-500",
              visible ? "opacity-100" : "opacity-0",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-2xs font-bold text-blue-600 uppercase tracking-[0.15em] mb-4">
              <ChevronRight className="size-3.5" />
              Como funciona
            </span>
            <h2 className="text-3xl sm:text-[2.4rem] font-black text-slate-900 leading-[1.1] tracking-tight max-w-2xl">
              Do registro à resolução — com rastreabilidade total
            </h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[3.25rem] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px bg-linear-to-r from-slate-100 via-blue-100 to-slate-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className={cn(
                    "flex flex-col transition-opacity duration-500",
                    visible ? "opacity-100" : "opacity-0",
                  )}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="text-2xs font-bold text-slate-300 mb-3 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="relative z-10 size-10 rounded-xl bg-blue-600 flex items-center justify-center mb-5 shadow-sm shadow-blue-200">
                    <step.icon className="size-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-2 leading-snug">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PlatformSection() {
  const { ref, visible } = useReveal(0.07)
  return (
    <section id="plataforma" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref}>
          <div
            className={cn(
              "text-center mb-12 transition-opacity duration-500",
              visible ? "opacity-100" : "opacity-0",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-2xs font-bold text-blue-600 uppercase tracking-[0.15em] mb-4">
              <Globe className="size-3" />
              Plataforma
            </span>
            <h2 className="text-3xl sm:text-[2.4rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-4">
              Interface projetada para produtividade
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Design limpo, navegação intuitiva e todas as informações no lugar certo para que sua equipe aja rápido.
            </p>
          </div>

          <div
            className={cn(
              "rounded-2xl overflow-hidden shadow-xl border border-slate-200 transition-opacity duration-500",
              visible ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: "120ms" }}
          >
            <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-[#FF5F57]" />
                <div className="size-3 rounded-full bg-[#FEBC2E]" />
                <div className="size-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1.5 flex items-center gap-2 text-xs text-slate-400 border border-slate-200 max-w-sm mx-auto">
                  <div className="size-2.5 rounded-full bg-emerald-400" />
                  app.gabinete.digital/home
                </div>
              </div>
            </div>

            <div className="flex bg-white lp-mockup-lg">
              <div className="w-52 bg-slate-50 border-r border-slate-100 p-4 gap-1 shrink-0 hidden sm:flex sm:flex-col">
                <div className="flex items-center gap-2 mb-5 px-1">
                  <div className="size-6 rounded-md bg-blue-600 flex items-center justify-center">
                    <Globe className="size-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">Gabinete Digital</span>
                </div>
                {[
                  { icon: BarChart3, label: "Dashboard", active: true },
                  { icon: ClipboardList, label: "Demandas", active: false },
                  { icon: MessageSquare, label: "Comentários", active: false },
                  { icon: MapPin, label: "Mapa", active: false },
                  { icon: Users, label: "Equipe", active: false },
                ].map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium cursor-pointer",
                      active ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Bom dia, Ana!</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Gabinete do Vereador Silva · visão geral de hoje</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Minhas tarefas", value: "14", icon: ClipboardList, cls: "text-blue-600 bg-blue-50" },
                    { label: "Urgentes abertas", value: "3", icon: Zap, cls: "text-red-600 bg-red-50" },
                    { label: "Novas (24h)", value: "7", icon: Sparkles, cls: "text-amber-600 bg-amber-50" },
                    { label: "Resolvidas este mês", value: "42", icon: CheckCircle2, cls: "text-emerald-600 bg-emerald-50" },
                  ].map(({ label, value, icon: Icon, cls }) => (
                    <div key={label} className="rounded-xl border border-slate-100 bg-white p-3 flex flex-col gap-2">
                      <div className={cn("size-7 rounded-lg flex items-center justify-center", cls)}>
                        <Icon className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-800">{value}</p>
                        <p className="text-2xs text-slate-400 mt-0.5 leading-tight">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Demandas recentes</span>
                    <span className="text-2xs text-blue-600 font-semibold cursor-pointer">Ver todas</span>
                  </div>
                  {[
                    { title: "Reparo calçada Av. Brasil", status: "Em andamento", dot: "bg-amber-400" },
                    { title: "Iluminação pública – Centro", status: "Resolvida", dot: "bg-emerald-400" },
                    { title: "Poda de árvore escola municipal", status: "Aberta", dot: "bg-slate-300" },
                  ].map((item, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center gap-3 border-b border-slate-50 last:border-0">
                      <div className={cn("size-1.5 rounded-full shrink-0", item.dot)} />
                      <span className="text-xs text-slate-700 flex-1 truncate">{item.title}</span>
                      <span className="text-2xs text-slate-400 shrink-0">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ label, suffix, target, start }: { label: string; suffix: string; target: number; start: boolean }) {
  const count = useCountUp(target, 1600, start)
  return (
    <div className="text-center">
      <p className="text-5xl font-black text-white tracking-tight tabular-nums">
        {count.toLocaleString("pt-BR")}
        <span className="text-blue-400">{suffix}</span>
      </p>
      <p className="text-white/40 text-sm mt-2 font-medium">{label}</p>
    </div>
  )
}

function StatsSection() {
  const { ref, visible } = useReveal(0.2)
  const stats = [
    { target: 12000, suffix: "+", label: "Demandas processadas" },
    { target: 200, suffix: "+", label: "Gabinetes ativos" },
    { target: 87, suffix: "%", label: "Taxa de resolução" },
    { target: 24, suffix: "h", label: "Tempo médio de resposta" },
  ]
  return (
    <section className="py-24 bg-[#09090B]">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "transition-opacity duration-500",
                visible ? "opacity-100" : "opacity-0",
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <StatItem {...s} start={visible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  const navigate = useNavigate()
  const { ref, visible } = useReveal(0.15)
  return (
    <section className="py-28 bg-[#09090B]">
      <div
        ref={ref}
        className={cn(
          "max-w-3xl mx-auto px-6 text-center transition-opacity duration-500",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3.5 py-1.5 mb-8">
          <Sparkles className="size-3.5 text-blue-400" />
          <span className="text-xs text-white/50 font-medium">Comece hoje, grátis</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.07] tracking-tight mb-5">
          Transforme o atendimento do seu gabinete hoje
        </h2>
        <p className="text-white/40 text-base leading-relaxed mb-10 max-w-xl mx-auto">
          Sem cartão de crédito, sem instalação complicada. Em minutos o seu gabinete está conectado aos cidadãos e gerenciando demandas com eficiência real.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => navigate("/sign-up")}
            className="cursor-pointer bg-white text-[#09090B] font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-white/90 transition-colors duration-150 flex items-center gap-2"
          >
            Criar conta grátis
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer border border-white/10 text-white/50 font-medium text-sm px-8 py-3.5 rounded-lg hover:border-white/20 hover:text-white/80 transition-colors duration-150"
          >
            Já tenho conta
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { icon: CheckCircle2, label: "100% LGPD" },
            { icon: CheckCircle2, label: "Grátis para começar" },
            { icon: CheckCircle2, label: "Sem cartão de crédito" },
            { icon: CheckCircle2, label: "Suporte dedicado" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 border border-white/8 bg-white/4 rounded-full px-3 py-1">
              <Icon className="size-3 text-emerald-400" />
              <span className="text-2xs text-white/40">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex -space-x-2">
            {[["bg-blue-500","A"],["bg-indigo-500","M"],["bg-violet-500","R"],["bg-pink-500","S"],["bg-rose-500","C"]].map(([bg, initial], i) => (
              <div key={i} className={cn("size-8 rounded-full border-2 border-[#09090B] flex items-center justify-center text-white text-2xs font-bold", bg)}>
                {initial}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-white/30 text-xs">+200 gabinetes confiam</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="bg-[#09090B] text-white/25 py-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/android-chrome-192x192.png" alt="Gabinete Digital" className="size-5 rounded-md opacity-70" />
            <span className="font-semibold text-white/60 text-sm">Gabinete Digital</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <a href="/termos-de-uso" className="hover:text-white/60 transition-colors duration-150">Termos de uso</a>
            <a href="/politica-de-privacidade" className="hover:text-white/60 transition-colors duration-150">Privacidade</a>
            <a href="/login" className="hover:text-white/60 transition-colors duration-150">Entrar</a>
          </div>
          <p className="text-xs text-white/20">© 2025 Gabinete Digital.</p>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <TickerSection />
      <FeaturesSection />
      <HeatmapSection />
      <HowItWorksSection />
      <PlatformSection />
      <StatsSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
