import {
  useAdminAddCabinetOverride,
  useAdminCabinetOverrides,
  useAdminCabinetSubscription,
  useAdminListFeatures,
  useAdminListPlans,
  useAdminRemoveCabinetOverride,
  useAdminUpsertCabinetSubscription,
} from "@/api/plans/hooks"
import type { AddOverrideRequest, CabinetOverride, OverrideSource, OverrideType } from "@/api/plans/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Loader2, PackageIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Ativo", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  TRIALING: { label: "Trial", className: "border-blue-200 bg-blue-50 text-blue-700" },
  CANCELED: { label: "Cancelado", className: "border-red-200 bg-red-50 text-red-600" },
  EXPIRED: { label: "Expirado", className: "border-zinc-200 bg-zinc-50 text-zinc-500" },
}

const SOURCE_LABELS: Record<OverrideSource, string> = {
  ADD_ON: "Add-on",
  CUSTOM_CONTRACT: "Contrato",
  TRIAL: "Trial",
  GIFT: "Presente",
  ADMIN: "Admin",
}

function AddOverrideDialog({
  cabinetId,
  existingOverrides,
}: {
  cabinetId: string
  existingOverrides: CabinetOverride[]
}) {
  const [open, setOpen] = useState(false)
  const [featureSlug, setFeatureSlug] = useState("")
  const [type, setType] = useState<OverrideType>("GRANT")
  const [source, setSource] = useState<OverrideSource>("ADMIN")
  const [notes, setNotes] = useState("")
  const [expiresAt, setExpiresAt] = useState("")

  const { data: features = [] } = useAdminListFeatures()
  const { mutate: addOverride, isPending } = useAdminAddCabinetOverride()

  const existingSlugs = new Set(existingOverrides.map((o) => o.featureSlug))
  const available = features.filter((f) => !existingSlugs.has(f.slug))

  function handleSubmit() {
    if (!featureSlug) return
    const data: AddOverrideRequest = {
      featureSlug,
      type,
      source,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      notes: notes.trim() || null,
    }
    addOverride(
      { cabinetId, data },
      {
        onSuccess: () => {
          setOpen(false)
          setFeatureSlug("")
          setType("GRANT")
          setSource("ADMIN")
          setExpiresAt("")
          setNotes("")
        },
      },
    )
  }

  return (
    <>
      <Button variant="outline" size="sm" className="gap-1.5 h-7" onClick={() => setOpen(true)}>
        <PlusIcon className="size-3.5" />
        Adicionar override
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Novo override de feature</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-1">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Feature</Label>
              <Select value={featureSlug} onValueChange={setFeatureSlug}>
                <SelectTrigger className="h-8 text-sm w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent position="popper" className="w-[--radix-select-trigger-width]">
                  {available.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">Todas as features têm override.</p>
                  ) : (
                    available.map((f) => (
                      <SelectItem key={f.slug} value={f.slug}>
                        <span className="font-mono text-xs text-muted-foreground mr-2">{f.slug}</span>
                        {f.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as OverrideType)}>
                <SelectTrigger className="h-8 text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="w-[--radix-select-trigger-width]">
                  <SelectItem value="GRANT">GRANT — conceder feature extra</SelectItem>
                  <SelectItem value="BLOCK">BLOCK — bloquear feature do plano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Origem</Label>
              <Select value={source} onValueChange={(v) => setSource(v as OverrideSource)}>
                <SelectTrigger className="h-8 text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" className="w-[--radix-select-trigger-width]">
                  <SelectItem value="ADMIN">Admin (intervenção manual)</SelectItem>
                  <SelectItem value="GIFT">Presente</SelectItem>
                  <SelectItem value="TRIAL">Trial</SelectItem>
                  <SelectItem value="ADD_ON">Add-on pago</SelectItem>
                  <SelectItem value="CUSTOM_CONTRACT">Contrato customizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Expira em (opcional)</Label>
              <input
                type="date"
                className="h-8 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Notas (opcional)</Label>
              <input
                className="h-8 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Motivo ou observação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || !featureSlug}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface Props {
  cabinetId: string
  cabinetName: string
}

export function CabinetPlansSheet({ cabinetId, cabinetName }: Props) {
  const [open, setOpen] = useState(false)
  const [removeOverrideTarget, setRemoveOverrideTarget] = useState<{ featureSlug: string; featureName: string } | null>(null)

  const { data: subscription, isLoading: loadingSub } = useAdminCabinetSubscription(open ? cabinetId : null)
  const { data: overrides = [], isLoading: loadingOverrides } = useAdminCabinetOverrides(open ? cabinetId : null)
  const { data: plans = [] } = useAdminListPlans()
  const { mutate: upsertSub, isPending: savingSub } = useAdminUpsertCabinetSubscription()
  const { mutate: removeOverride, isPending: removingOverride } = useAdminRemoveCabinetOverride()

  const [selectedPlanId, setSelectedPlanId] = useState("")

  function handleChangePlan() {
    if (!selectedPlanId) return
    upsertSub({ cabinetId, planId: selectedPlanId }, { onSuccess: () => setSelectedPlanId("") })
  }

  function handleConfirmRemoveOverride() {
    if (!removeOverrideTarget) return
    removeOverride(
      { cabinetId, featureSlug: removeOverrideTarget.featureSlug },
      { onSuccess: () => setRemoveOverrideTarget(null) },
    )
  }

  const isLoading = loadingSub || loadingOverrides

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-foreground"
          aria-label="Gerenciar plano"
        >
          <PackageIcon className="size-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col">
        <SheetHeader className="px-5 pt-5 pb-4 border-b shrink-0">
          <SheetTitle className="text-base">Planos — {cabinetName}</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-4 flex flex-col gap-6">
              {/* Subscription */}
              <section className="flex flex-col gap-3">
                <p className="text-xs font-medium text-muted-foreground">Assinatura ativa</p>

                {subscription ? (
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{subscription.plan.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{subscription.plan.tier}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("text-2xs shrink-0", STATUS_CONFIG[subscription.status]?.className)}
                      >
                        {STATUS_CONFIG[subscription.status]?.label ?? subscription.status}
                      </Badge>
                    </div>
                    <div className="px-4 py-2.5 text-xs text-muted-foreground">
                      Desde {new Date(subscription.currentPeriodStart).toLocaleDateString("pt-BR")}
                      {subscription.currentPeriodEnd && (
                        <> · até {new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}</>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground/60">Nenhum plano atribuído.</p>
                )}

                {/* Change plan */}
                <div className="flex items-center gap-2">
                  <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                    <SelectTrigger className="h-8 text-sm flex-1">
                      <SelectValue placeholder="Selecionar plano..." />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.filter((p) => p.isActive).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                          <span className="ml-2 text-xs text-muted-foreground font-mono">{p.tier}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="h-8 shrink-0"
                    disabled={!selectedPlanId || savingSub}
                    onClick={handleChangePlan}
                  >
                    {savingSub ? <Loader2 className="size-4 animate-spin" /> : "Atribuir"}
                  </Button>
                </div>
              </section>

              {/* Overrides */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Overrides de feature</p>
                  <AddOverrideDialog cabinetId={cabinetId} existingOverrides={overrides} />
                </div>

                {overrides.length === 0 ? (
                  <p className="text-sm text-muted-foreground/60">Nenhum override configurado.</p>
                ) : (
                  <div className="rounded-lg border border-border overflow-hidden divide-y divide-border/60">
                    {overrides.map((o) => {
                      const expired = !!o.expiresAt && new Date(o.expiresAt) < new Date()
                      return (
                      <div key={o.id} className={cn("flex items-start gap-2 px-4 py-3", expired && "opacity-50")}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-foreground">{o.feature.name}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-2xs",
                                expired
                                  ? "border-zinc-200 bg-zinc-50 text-zinc-400"
                                  : o.type === "GRANT"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-red-200 bg-red-50 text-red-600",
                              )}
                            >
                              {o.type}
                            </Badge>
                            <Badge variant="outline" className="text-2xs">
                              {SOURCE_LABELS[o.source] ?? o.source}
                            </Badge>
                            {expired && (
                              <Badge variant="outline" className="text-2xs border-zinc-200 bg-zinc-50 text-zinc-400">
                                Expirado
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xs font-mono text-muted-foreground mt-0.5">{o.featureSlug}</p>
                          {o.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{o.notes}</p>
                          )}
                          {o.expiresAt && (
                            <p className={cn("text-2xs mt-0.5", expired ? "text-muted-foreground/60" : "text-amber-600")}>
                              {expired ? "Expirou em" : "Expira em"}{" "}
                              {new Date(o.expiresAt).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                          onClick={() => setRemoveOverrideTarget({ featureSlug: o.featureSlug, featureName: o.feature.name })}
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    )})}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </SheetContent>

      <Dialog open={!!removeOverrideTarget} onOpenChange={(v) => !removingOverride && !v && setRemoveOverrideTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Remover override</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remover o override de{" "}
            <span className="font-medium text-foreground">{removeOverrideTarget?.featureName}</span>{" "}
            para o gabinete <span className="font-medium text-foreground">{cabinetName}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOverrideTarget(null)} disabled={removingOverride}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemoveOverride} disabled={removingOverride}>
              {removingOverride && <Loader2 className="size-4 animate-spin" />}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}
