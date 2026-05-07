import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Globe,
  MapPin,
  MessageSquare,
  Shield,
  Users,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

function FadeIn({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
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
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300",
        scrolled ? "bg-white/96 backdrop-blur-md border-b border-zinc-200/70" : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/android-chrome-192x192.png" alt="Gabinete Digital" className="size-6 rounded-md" />
          <span className="text-sm font-semibold text-zinc-900">Gabinete Digital</span>
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
              className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-sm text-zinc-400 hover:text-zinc-900 transition-colors px-4 py-2"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/sign-up")}
            className="cursor-pointer bg-zinc-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors duration-150"
          >
            Começar grátis
          </button>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative bg-white overflow-hidden pt-14">
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,rgba(0,88,243,0.07),transparent)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-zinc-400 font-medium tracking-wide">Gestão cívica digital</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.06 }}
        >
          <h1 className="text-[3.8rem] sm:text-[5rem] lg:text-[6.5rem] font-black leading-[0.95] tracking-[-0.03em] mb-0">
            <span className="text-zinc-900 block">Conecte seu</span>
            <span className="text-zinc-900 block">gabinete</span>
            <span className="text-zinc-300 block">aos cidadãos.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.18 }}
          className="text-zinc-500 text-lg leading-relaxed max-w-sm mx-auto mt-10 mb-10"
        >
          Gerencie demandas públicas, acompanhe status em tempo real e construa confiança com seus cidadãos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.26 }}
          className="flex items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate("/sign-up")}
            className="cursor-pointer bg-[#0058F3] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Começar gratuitamente
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-zinc-400 font-medium text-sm hover:text-zinc-900 transition-colors flex items-center gap-1"
          >
            Ver demonstração
            <ChevronRight className="size-4" />
          </button>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.38 }}
          className="rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl shadow-zinc-900/10"
        >
          <div className="bg-zinc-100 px-4 py-2.5 flex items-center gap-2 border-b border-zinc-200">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-[#FF5F57]" />
              <div className="size-3 rounded-full bg-[#FEBC2E]" />
              <div className="size-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center gap-2 text-xs text-zinc-400 border border-zinc-200 max-w-xs mx-auto">
                <div className="size-2 rounded-full bg-emerald-400" />
                app.gabinete.digital/home
              </div>
            </div>
          </div>

          <div className="flex bg-white lp-hero-mockup">
            <div className="w-44 bg-zinc-50 border-r border-zinc-100 p-3.5 shrink-0 hidden sm:flex flex-col gap-0.5">
              <div className="flex items-center gap-2 mb-4 px-1">
                <div className="size-5 rounded bg-[#0058F3] flex items-center justify-center">
                  <Globe className="size-3 text-white" />
                </div>
                <span className="text-xs font-bold text-zinc-800">Gabinete Digital</span>
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
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium",
                    active ? "bg-zinc-900 text-white" : "text-zinc-400",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-800">Bom dia, Ana.</p>
                  <p className="text-2xs text-zinc-400 mt-0.5">Vereador Silva · hoje</p>
                </div>
                <span className="text-2xs text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 font-medium">Exportar</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Tarefas", value: "14", color: "text-zinc-900" },
                  { label: "Urgentes", value: "3", color: "text-red-600" },
                  { label: "Novas hoje", value: "7", color: "text-zinc-900" },
                  { label: "Resolvidas", value: "42", color: "text-emerald-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl border border-zinc-100 p-3">
                    <p className={cn("text-xl font-extrabold", color)}>{value}</p>
                    <p className="text-2xs text-zinc-400 mt-0.5 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-zinc-100 overflow-hidden">
                <div className="px-3.5 py-2 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                  <span className="text-xs font-bold text-zinc-700">Demandas recentes</span>
                  <span className="text-2xs text-[#0058F3] font-semibold">Ver todas →</span>
                </div>
                {[
                  { title: "Reparo calçada Av. Brasil, n° 120", status: "Em andamento", dot: "bg-amber-400", bc: "text-amber-700 bg-amber-50" },
                  { title: "Iluminação pública – Parque Central", status: "Resolvida", dot: "bg-emerald-400", bc: "text-emerald-700 bg-emerald-50" },
                  { title: "Poda de árvore – Escola Municipal", status: "Aberta", dot: "bg-zinc-300", bc: "text-zinc-500 bg-zinc-50" },
                ].map((item, i) => (
                  <div key={i} className="px-3.5 py-2.5 flex items-center gap-3 border-b border-zinc-50 last:border-0">
                    <div className={cn("size-1.5 rounded-full shrink-0", item.dot)} />
                    <span className="text-xs text-zinc-700 flex-1 truncate">{item.title}</span>
                    <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full shrink-0", item.bc)}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-20 bg-linear-to-b from-transparent to-zinc-50" />
    </section>
  )
}

function TickerSection() {
  return (
    <div className="bg-zinc-50 border-y border-zinc-100 py-14">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-200">
          {[
            { value: "12.000+", label: "demandas gerenciadas" },
            { value: "200+", label: "gabinetes ativos" },
            { value: "87%", label: "taxa de resolução" },
            { value: "< 24h", label: "tempo médio de resposta" },
          ].map(({ value, label }, i) => (
            <div key={label} className={cn("text-center px-8", i >= 2 && "mt-8 lg:mt-0")}>
              <p className="text-4xl font-black text-zinc-900 tracking-tight">{value}</p>
              <p className="text-sm text-zinc-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-16">
          <p className="text-xs font-bold text-[#0058F3] uppercase tracking-[0.14em] mb-4">Funcionalidades</p>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-[1.05] tracking-tight max-w-xl">
            Tudo que seu gabinete precisa em um só lugar.
          </h2>
        </FadeIn>

        {/* Primary feature — 2-col split */}
        <FadeIn className="mb-4">
          <div className="rounded-2xl border border-zinc-100 overflow-hidden">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-2 p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-zinc-100">
                <ClipboardList className="size-7 text-zinc-900 mb-6" />
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Gestão de demandas</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-7">
                  Centralize solicitações com filtros avançados, priorização e atribuição de tarefas para toda a equipe.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Filtros por status, prioridade e responsável",
                    "Histórico completo de cada solicitação",
                    "Atribuição e reatribuição em tempo real",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-500">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3 bg-zinc-50 p-6 flex flex-col justify-center">
                <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                  <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-700">Demandas · 48 abertas</span>
                    <span className="text-2xs text-zinc-400">há 2 min</span>
                  </div>
                  <div className="divide-y divide-zinc-50">
                    {[
                      { title: "Buraco na Rua das Flores, n° 48", dot: "bg-amber-400", badge: "Em andamento", bc: "text-amber-700 bg-amber-50" },
                      { title: "Iluminação pública – Parque Central", dot: "bg-emerald-400", badge: "Resolvida", bc: "text-emerald-700 bg-emerald-50" },
                      { title: "Limpeza de terreno abandonado", dot: "bg-blue-400", badge: "Em análise", bc: "text-blue-700 bg-blue-50" },
                      { title: "Reparo calçada Escola Municipal", dot: "bg-zinc-200", badge: "Aberta", bc: "text-zinc-500 bg-zinc-50" },
                    ].map((row) => (
                      <div key={row.title} className="px-4 py-2.5 flex items-center gap-3">
                        <div className={cn("size-1.5 rounded-full shrink-0", row.dot)} />
                        <span className="text-xs text-zinc-700 flex-1 truncate">{row.title}</span>
                        <span className={cn("text-2xs font-semibold px-2 py-0.5 rounded-full shrink-0", row.bc)}>{row.badge}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-zinc-100 grid grid-cols-3 gap-2">
                    {[
                      { label: "Abertas", val: "48", color: "text-zinc-900" },
                      { label: "Andamento", val: "23", color: "text-amber-600" },
                      { label: "Resolvidas", val: "156", color: "text-emerald-600" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="text-center">
                        <p className={cn("text-sm font-extrabold", color)}>{val}</p>
                        <p className="text-2xs text-zinc-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Secondary features — 3 col */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {[
            {
              icon: MessageSquare,
              title: "Chat integrado",
              desc: "Comunicação direta entre gabinete e cidadão, com histórico completo e notificações de resposta.",
            },
            {
              icon: Bell,
              title: "Notificações ao vivo",
              desc: "Alertas automáticos de prazos, novas demandas e atualizações de status. Zero demanda esquecida.",
            },
            {
              icon: BarChart3,
              title: "Métricas e relatórios",
              desc: "KPIs de desempenho, tempo médio de resolução e exportação para análise externa.",
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 0.06}>
              <div className="rounded-2xl border border-zinc-100 p-8 h-full hover:border-zinc-200 hover:bg-zinc-50/50 transition-colors duration-200">
                <Icon className="size-6 text-zinc-400 mb-5" />
                <h3 className="text-sm font-bold text-zinc-900 mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* LGPD — full width dark */}
        <FadeIn>
          <div className="rounded-2xl bg-zinc-900 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <Shield className="size-6 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Segurança e conformidade LGPD</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                  Autenticação segura, logs de auditoria completos e controle granular de permissões por membro da equipe.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400 border border-zinc-700 rounded-lg px-3 py-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                100% LGPD
              </span>
              <span className="text-xs text-zinc-400 border border-zinc-700 rounded-lg px-3 py-1.5">
                E2E Encrypt
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function HeatmapSection() {
  return (
    <section className="py-28 bg-zinc-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          <FadeIn className="lg:col-span-2">
            <MapPin className="size-7 text-zinc-900 mb-6" />
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 leading-[1.1] tracking-tight mb-5">
              Mapa de calor das demandas da sua cidade
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-7">
              Visualize em tempo real onde as demandas mais urgentes estão concentradas. Priorize regiões, identifique padrões e tome decisões baseadas em dados geográficos.
            </p>
            <ul className="space-y-3">
              {[
                "Mapa de calor por urgência e prioridade",
                "Filtros por bairro, categoria e responsável",
                "Atualização em tempo real via WebSocket",
                "Modo escuro integrado ao Google Maps",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-500">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
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
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Users,
      title: "Cidadão registra a demanda",
      description: "Formulário simples com localização, fotos e descrição — pelo app ou web, autenticado ou anônimo.",
    },
    {
      icon: Bell,
      title: "Gabinete categoriza e atribui",
      description: "Notificação imediata para a equipe. A demanda é priorizada e atribuída ao responsável.",
    },
    {
      icon: Zap,
      title: "Acompanhamento em tempo real",
      description: "Status atualizado a cada etapa. Chat direto entre cidadão e gabinete durante todo o processo.",
    },
    {
      icon: CheckCircle2,
      title: "Resolução e avaliação",
      description: "O cidadão confirma a conclusão e avalia o atendimento. Dados para melhoria contínua.",
    },
  ]

  return (
    <section id="como-funciona" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-20">
          <p className="text-xs font-bold text-[#0058F3] uppercase tracking-[0.14em] mb-4">Como funciona</p>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-[1.05] tracking-tight max-w-xl">
            Do registro à resolução, com rastreabilidade total.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.07}>
              <div>
                <p className="text-[5.5rem] font-black text-zinc-100 leading-none mb-5 select-none tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <step.icon className="size-5 text-[#0058F3] mb-4" />
                <h3 className="font-bold text-zinc-900 text-sm leading-snug mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlatformSection() {
  return (
    <section id="plataforma" className="py-28 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-12">
          <p className="text-xs font-bold text-[#0058F3] uppercase tracking-[0.14em] mb-4">Plataforma</p>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-[1.05] tracking-tight max-w-xl">
            Interface projetada para produtividade.
          </h2>
          <p className="text-zinc-500 text-base mt-4 max-w-md leading-relaxed">
            Design limpo, navegação intuitiva — sua equipe age rápido sem precisar de treinamento.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-xl">
            <div className="bg-zinc-100 px-4 py-3 flex items-center gap-2 border-b border-zinc-200">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-[#FF5F57]" />
                <div className="size-3 rounded-full bg-[#FEBC2E]" />
                <div className="size-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1.5 flex items-center gap-2 text-xs text-zinc-400 border border-zinc-200 max-w-sm mx-auto">
                  <div className="size-2.5 rounded-full bg-emerald-400" />
                  app.gabinete.digital/home
                </div>
              </div>
            </div>

            <div className="flex bg-white lp-mockup-lg">
              <div className="w-48 bg-zinc-50 border-r border-zinc-100 p-3.5 gap-0.5 shrink-0 hidden sm:flex sm:flex-col">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div className="size-5 rounded bg-[#0058F3] flex items-center justify-center">
                    <Globe className="size-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-zinc-800">Gabinete Digital</span>
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
                      "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
                      active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100",
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
                <div>
                  <h2 className="text-base font-bold text-zinc-800">Bom dia, Ana!</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Gabinete do Vereador Silva · visão geral de hoje</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Minhas tarefas", value: "14", icon: ClipboardList },
                    { label: "Urgentes abertas", value: "3", icon: Zap },
                    { label: "Novas (24h)", value: "7", icon: Bell },
                    { label: "Resolvidas este mês", value: "42", icon: CheckCircle2 },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 flex flex-col gap-2">
                      <Icon className="size-3.5 text-zinc-400" />
                      <div>
                        <p className="text-xl font-extrabold text-zinc-800">{value}</p>
                        <p className="text-2xs text-zinc-400 mt-0.5 leading-tight">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-zinc-100 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                    <span className="text-xs font-bold text-zinc-700">Demandas recentes</span>
                    <span className="text-2xs text-[#0058F3] font-semibold cursor-pointer">Ver todas</span>
                  </div>
                  {[
                    { title: "Reparo calçada Av. Brasil", status: "Em andamento", dot: "bg-amber-400" },
                    { title: "Iluminação pública – Centro", status: "Resolvida", dot: "bg-emerald-400" },
                    { title: "Poda de árvore escola municipal", status: "Aberta", dot: "bg-zinc-300" },
                  ].map((item, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center gap-3 border-b border-zinc-50 last:border-0">
                      <div className={cn("size-1.5 rounded-full shrink-0", item.dot)} />
                      <span className="text-xs text-zinc-700 flex-1 truncate">{item.title}</span>
                      <span className="text-2xs text-zinc-400 shrink-0">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function StatItem({ label, suffix, target, start }: { label: string; suffix: string; target: number; start: boolean }) {
  const count = useCountUp(target, 1600, start)
  return (
    <div className="text-center">
      <p className="text-5xl font-black text-zinc-900 tracking-tight tabular-nums">
        {count.toLocaleString("pt-BR")}
        <span className="text-[#0058F3]">{suffix}</span>
      </p>
      <p className="text-zinc-400 text-sm mt-2">{label}</p>
    </div>
  )
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const stats = [
    { target: 12000, suffix: "+", label: "Demandas processadas" },
    { target: 200, suffix: "+", label: "Gabinetes ativos" },
    { target: 87, suffix: "%", label: "Taxa de resolução" },
    { target: 24, suffix: "h", label: "Tempo médio de resposta" },
  ]
  return (
    <section className="py-24 bg-white border-y border-zinc-100">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.55, ease, delay: i * 0.08 }}
            >
              <StatItem {...s} start={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  const navigate = useNavigate()
  return (
    <section className="py-32 bg-zinc-950">
      <FadeIn className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-[-0.03em] mb-8">
          <span className="text-white block">Transforme o</span>
          <span className="text-white block">atendimento do seu</span>
          <span className="text-zinc-600 block">gabinete hoje.</span>
        </h2>

        <p className="text-zinc-500 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          Sem cartão de crédito. Sem instalação. Em minutos o seu gabinete está conectado.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => navigate("/sign-up")}
            className="cursor-pointer bg-white text-zinc-900 font-bold text-sm px-8 py-4 rounded-xl hover:bg-zinc-100 transition-colors flex items-center gap-2"
          >
            Criar conta grátis
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer border border-zinc-800 text-zinc-500 font-medium text-sm px-8 py-4 rounded-xl hover:border-zinc-700 hover:text-zinc-300 transition-colors"
          >
            Já tenho conta
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-600">
          {["100% LGPD", "Grátis para começar", "Sem cartão de crédito", "Suporte dedicado"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-zinc-700" />
              {item}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/android-chrome-192x192.png" alt="Gabinete Digital" className="size-5 rounded-md opacity-50" />
            <span className="font-semibold text-zinc-500 text-sm">Gabinete Digital</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <a href="/termos-de-uso" className="hover:text-zinc-400 transition-colors">Termos de uso</a>
            <a href="/politica-de-privacidade" className="hover:text-zinc-400 transition-colors">Privacidade</a>
            <a href="/login" className="hover:text-zinc-400 transition-colors">Entrar</a>
          </div>
          <p className="text-xs text-zinc-700">© 2025 Gabinete Digital.</p>
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
