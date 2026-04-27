import { useUpdateDemandProgress } from "@/api/demands/hooks"
import { DemandStatus, type DemandStatus as DemandStatusType } from "@/api/demands/types"
import { DEMAND_STATUS_CONFIG } from "@/pages/private/demands/components/demand-utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  CircleDot,
  Clock,
  Loader2,
  Search,
  XCircle,
  Ban,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const STATUS_ICONS: Record<DemandStatusType, React.ElementType> = {
  [DemandStatus.SUBMITTED]: CircleDot,
  [DemandStatus.IN_ANALYSIS]: Search,
  [DemandStatus.IN_PROGRESS]: Clock,
  [DemandStatus.RESOLVED]: CheckCircle2,
  [DemandStatus.REJECTED]: XCircle,
  [DemandStatus.CANCELED]: Ban,
}

const STATUS_DESCRIPTIONS: Record<DemandStatusType, string> = {
  [DemandStatus.SUBMITTED]: "Aguardando triagem inicial",
  [DemandStatus.IN_ANALYSIS]: "Sendo avaliada pela equipe",
  [DemandStatus.IN_PROGRESS]: "Trabalho iniciado",
  [DemandStatus.RESOLVED]: "Concluída com sucesso",
  [DemandStatus.REJECTED]: "Não será atendida",
  [DemandStatus.CANCELED]: "Encerrada sem resolução",
}

const STATUS_DOT: Record<DemandStatusType, string> = {
  [DemandStatus.SUBMITTED]: "bg-slate-400",
  [DemandStatus.IN_ANALYSIS]: "bg-blue-500",
  [DemandStatus.IN_PROGRESS]: "bg-amber-500",
  [DemandStatus.RESOLVED]: "bg-emerald-500",
  [DemandStatus.REJECTED]: "bg-red-500",
  [DemandStatus.CANCELED]: "bg-zinc-400",
}

const STATUSES_REQUIRING_NOTE: DemandStatusType[] = [
  DemandStatus.REJECTED,
  DemandStatus.CANCELED,
]

interface UpdateProgressDialogProps {
  demandId: string
  demandTitle: string
  currentStatus: DemandStatusType
  defaultStatus?: DemandStatusType
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UpdateProgressDialog({
  demandId,
  demandTitle,
  currentStatus,
  defaultStatus,
  open,
  onOpenChange,
  onSuccess,
}: UpdateProgressDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<DemandStatusType>(defaultStatus ?? currentStatus)
  const [note, setNote] = useState("")

  const { mutate, isPending } = useUpdateDemandProgress()

  useEffect(() => {
    if (open) {
      setSelectedStatus(defaultStatus ?? currentStatus)
      setNote("")
    }
  }, [open, currentStatus, defaultStatus])

  const requiresNote = STATUSES_REQUIRING_NOTE.includes(selectedStatus)
  const noteIsValid = !requiresNote || note.trim().length > 0
  const hasChanges = selectedStatus !== currentStatus || note.trim().length > 0

  function handleClose() {
    if (isPending) return
    setSelectedStatus(defaultStatus ?? currentStatus)
    setNote("")
    onOpenChange(false)
  }

  function handleSubmit() {
    if (!hasChanges) {
      handleClose()
      return
    }
    if (!noteIsValid) {
      toast.error("Informe o motivo para rejeitar ou cancelar a demanda")
      return
    }
    mutate(
      { id: demandId, status: selectedStatus, note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Progresso atualizado com sucesso")
          handleClose()
          onSuccess?.()
        },
        onError: () => {
          toast.error("Erro ao atualizar progresso")
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Atualizar progresso</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 px-3.5 py-2.5">
          <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            Demanda
          </p>
          <p className="text-sm font-medium text-foreground line-clamp-2">{demandTitle}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
            Novo status
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {Object.values(DemandStatus).map((status) => {
              const config = DEMAND_STATUS_CONFIG[status]
              const Icon = STATUS_ICONS[status]
              const isSelected = selectedStatus === status
              const isCurrent = currentStatus === status
              return (
                <button
                  key={status}
                  type="button"
                  data-selected={isSelected}
                  onClick={() => setSelectedStatus(status)}
                  className={cn(
                    "flex items-center gap-3 w-full rounded-lg border px-3.5 py-2.5 text-left transition-all",
                    config.className,
                    isSelected && "ring-1 ring-inset ring-current/20",
                  )}
                >
                  <span className={cn("size-2 rounded-full shrink-0", STATUS_DOT[status])} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground">{config.label}</span>
                      {isCurrent && (
                        <span className="text-2xs font-medium text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">
                          atual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{STATUS_DESCRIPTIONS[status]}</p>
                  </div>
                  <div className={cn(
                    "size-4 rounded-full border-2 shrink-0 transition-all",
                    isSelected ? "border-current bg-current scale-110" : "border-border",
                  )}>
                    {isSelected && (
                      <div className="size-full rounded-full flex items-center justify-center">
                        <div className="size-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
            Motivo / Nota{" "}
            {requiresNote
              ? <span className="normal-case font-normal text-destructive/70">(obrigatório)</span>
              : <span className="normal-case font-normal text-muted-foreground/70">(opcional)</span>
            }
          </p>
          <Textarea
            placeholder={
              requiresNote
                ? "Descreva o motivo da rejeição ou cancelamento..."
                : "Descreva o que foi feito, decisões tomadas ou informações relevantes..."
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={3}
            className={cn(
              "resize-none text-sm",
              requiresNote && !note.trim() && "border-destructive/40 focus-visible:ring-destructive/20",
            )}
          />
          {note.length > 400 && (
            <p className="text-xs text-muted-foreground text-right">{note.length}/500</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || (hasChanges && !noteIsValid)}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {hasChanges ? "Salvar" : "Fechar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
