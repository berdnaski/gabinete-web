import { BarChart3, ClipboardList, MapPin, Users, Bell, Filter, Plus, Tag, Calendar, Zap, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import logo from "@/assets/logo.png"

type Priority = { label: string; cls: string; urgent: boolean }

type KanbanCard = {
  id: string
  title: string
  priority: Priority | null
  category: string
  date: string
  initials: string
}

type KanbanColumn = {
  label: string
  dot: string
  cards: KanbanCard[]
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    label: "Enviada",
    dot: "bg-slate-400",
    cards: [
      { id: "k1", title: "Semáforo quebrado na Av. Cel. Xavier", priority: { label: "URGENTE", cls: "border-red-200 bg-red-50 text-red-600", urgent: true }, category: "Infraestrutura", date: "Há 20 dias", initials: "AL" },
      { id: "k2", title: "Ponto de ônibus sem cobertura na praça central", priority: null, category: "Transporte", date: "Ontem", initials: "MC" },
      { id: "k3", title: "Esgoto transbordando na Vila São Jorge", priority: { label: "ALTO", cls: "border-orange-200 bg-orange-50 text-orange-600", urgent: false }, category: "Saneamento", date: "Há 4 dias", initials: "RB" },
    ],
  },
  {
    label: "Em análise",
    dot: "bg-blue-500",
    cards: [
      { id: "k4", title: "Falta de medicamentos na UPA Norte", priority: { label: "ALTO", cls: "border-orange-200 bg-orange-50 text-orange-600", urgent: false }, category: "Saúde", date: "Há 2 dias", initials: "LR" },
      { id: "k5", title: "Buraco na calçada da Escola Municipal", priority: { label: "MÉDIO", cls: "border-blue-200 bg-blue-50 text-blue-600", urgent: false }, category: "Infraestrutura", date: "Há 6 dias", initials: "JM" },
    ],
  },
  {
    label: "Em progresso",
    dot: "bg-amber-500",
    cards: [
      { id: "k6", title: "Recapeamento da Av. Principal, trecho 2", priority: { label: "MÉDIO", cls: "border-blue-200 bg-blue-50 text-blue-600", urgent: false }, category: "Obras", date: "Há 3 dias", initials: "CS" },
    ],
  },
  {
    label: "Resolvida",
    dot: "bg-emerald-500",
    cards: [
      { id: "k7", title: "Iluminação pública no Parque Central", priority: { label: "BAIXO", cls: "border-zinc-200 bg-zinc-50 text-zinc-600", urgent: false }, category: "Infraestrutura", date: "Há 5 dias", initials: "ED" },
    ],
  },
]

const KANBAN_SIDEBAR = [
  { icon: BarChart3, label: "Dashboard", active: false },
  { icon: ClipboardList, label: "Minhas Tarefas", active: true },
  { icon: MapPin, label: "Mapa", active: false },
  { icon: Users, label: "Equipe", active: false },
  { icon: Bell, label: "Notificações", active: false },
]

const DETAIL_COMMENTS = [
  { initial: "A", text: "Encaminhado para a Secretaria de Infraestrutura.", time: "2d" },
  { initial: "C", text: "Aguardando retorno do órgão responsável.", time: "1d" },
]

export function KanbanSection() {
  return (
    <section className="py-16 sm:py-28 bg-background" id="gestao">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-3.5 py-1.5 mb-6 bg-background">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
              Gestão de tarefas
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]">
            Organize o fluxo<br className="hidden sm:block" /> da sua equipe.
          </h2>
          <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Quadro kanban integrado às demandas — atribua, acompanhe e resolva em tempo real.
          </p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden shadow-lg">
          <div className="bg-muted/50 px-4 py-2.5 flex items-center gap-2 border-b border-border shrink-0">
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-border" />
              <div className="size-2.5 rounded-full bg-border" />
              <div className="size-2.5 rounded-full bg-border" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-background rounded-md px-3 py-1 flex items-center gap-2 text-xs text-muted-foreground border border-border max-w-xs mx-auto">
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                app.gabineteapp.com.br/minhas-tarefas
              </div>
            </div>
          </div>

          <div className="flex h-125 overflow-hidden">
            <div className="hidden sm:flex w-44 border-r border-border flex-col p-3.5 gap-0.5 bg-background shrink-0">
              <div className="px-1 mb-5">
                <img src={logo} alt="" className="h-5 w-auto" />
              </div>
              {KANBAN_SIDEBAR.map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-background shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Minhas Tarefas</p>
                    <p className="text-xs text-muted-foreground">Gabinete Anderson Lima</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 h-7">
                    <Filter className="size-3.5" />
                    <span className="hidden sm:inline">Filtrar</span>
                  </Button>
                  <Button size="sm" className="gap-1.5 h-7">
                    <Plus className="size-3.5" />
                    Nova
                  </Button>
                </div>
              </div>

              <div className="flex-1 relative overflow-x-auto sm:overflow-hidden overflow-y-hidden bg-background">
                <div className="flex gap-3 p-4 h-full">
                  {KANBAN_COLUMNS.map((col) => (
                    <div
                      key={col.label}
                      className="flex flex-col min-w-52 w-52 rounded-lg border border-border bg-muted/20 shrink-0"
                    >
                      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-border/40">
                        <span className={cn("size-1.5 rounded-full shrink-0", col.dot)} />
                        <span className="text-xs font-medium text-muted-foreground flex-1 truncate">{col.label}</span>
                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-md text-xs tabular-nums font-medium bg-muted text-muted-foreground">
                          {col.cards.length}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 p-2.5">
                        {col.cards.map((card) => (
                          <div
                            key={card.id}
                            className={cn(
                              "bg-card rounded-lg border p-3 select-none cursor-default transition-colors",
                              card.id === "k1"
                                ? "border-primary/40 ring-1 ring-primary/20 shadow-sm"
                                : "border-border hover:bg-muted/30",
                            )}
                          >
                            {card.priority && (
                              <div className="mb-2">
                                <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", card.priority.cls)}>
                                  {card.priority.urgent && <Zap className="size-2.5 animate-pulse" />}
                                  {card.priority.label}
                                </span>
                              </div>
                            )}
                            <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 mb-2.5">{card.title}</p>
                            <div className="flex items-center gap-1 mb-2">
                              <Tag className="size-3 text-muted-foreground/50 shrink-0" />
                              <span className="text-xs text-muted-foreground truncate">{card.category}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-2xs font-bold text-primary">
                                  {card.initials.charAt(0)}
                                </div>
                                <span className="text-xs text-muted-foreground truncate">{card.initials}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Calendar className="size-3 text-muted-foreground/50" />
                                <span className="text-xs text-muted-foreground/70">{card.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:flex absolute right-3 top-3 bottom-3 w-64 flex-col rounded-xl border border-border bg-background shadow-xl overflow-hidden z-10">
                  <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium border-red-200 bg-red-50 text-red-600">
                          <Zap className="size-2.5 animate-pulse" />
                          URGENTE
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold border-slate-200 bg-slate-50 text-slate-600">
                          Enviada
                        </span>
                      </div>
                      <button className="shrink-0 p-1 rounded-md hover:bg-muted transition-colors">
                        <X className="size-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      Semáforo quebrado na Av. Cel. Xavier
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Cruzamento perigoso sem sinalização. Risco alto de acidentes nos horários de pico na região central.
                    </p>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-muted-foreground/60 shrink-0" />
                      <span className="text-xs text-muted-foreground">Av. Cel. Xavier, nº 110</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">Responsável</p>
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-2xs font-bold text-primary shrink-0">A</div>
                        <span className="text-xs font-medium text-foreground">Ana Lima</span>
                      </div>
                    </div>
                    <div className="border-t border-border pt-3 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">Comentários</p>
                        <span className="inline-flex items-center justify-center size-4 rounded-full bg-muted text-2xs font-bold text-muted-foreground">3</span>
                      </div>
                      {DETAIL_COMMENTS.map((c, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="size-5 rounded-full bg-muted flex items-center justify-center text-2xs font-bold text-muted-foreground shrink-0">{c.initial}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-foreground leading-snug">{c.text}</p>
                            <p className="text-2xs text-muted-foreground mt-0.5">{c.time} atrás</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent pointer-events-none z-20" />
                <div className="absolute right-0 top-0 bottom-0 w-10 bg-linear-to-l from-background to-transparent pointer-events-none z-20 hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
