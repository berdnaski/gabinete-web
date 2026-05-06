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
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const STATUS_DOT: Record<DemandStatusType, string> = {
  [DemandStatus.SUBMITTED]: "bg-slate-400",
  [DemandStatus.IN_ANALYSIS]: "bg-blue-500",
  [DemandStatus.IN_PROGRESS]: "bg-amber-500",
  [DemandStatus.RESOLVED]: "bg-emerald-500",
  [DemandStatus.REJECTED]: "bg-red-500",
  [DemandStatus.CANCELED]: "bg-zinc-400",
}

const STATUS_DESCRIPTIONS: Record<DemandStatusType, string> = {
  [DemandStatus.SUBMITTED]: "Aguardando triagem inicial",
  [DemandStatus.IN_ANALYSIS]: "Sendo avaliada pela equipe",
  [DemandStatus.IN_PROGRESS]: "Trabalho iniciado",
  [DemandStatus.RESOLVED]: "Concluída com sucesso",
  [DemandStatus.REJECTED]: "Não será atendida",
  [DemandStatus.CANCELED]: "Encerrada sem resolução",
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
          <p className="text-xs text-muted-foreground mb-0.5">Demanda</p>
          <p className="text-sm font-medium text-foreground line-clamp-2">{demandTitle}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <div className="flex flex-col gap-1">
            {Object.values(DemandStatus).map((status) => {
              const config = DEMAND_STATUS_CONFIG[status]
              const isSelected = selectedStatus === status
              const isCurrent = currentStatus === status
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={cn(
                    "flex items-center gap-3 w-full rounded-lg border px-3.5 py-2.5 text-left transition-colors",
                    isSelected
                      ? "border-foreground/20 bg-muted"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full shrink-0", STATUS_DOT[status])} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground">{config.label}</span>
                      {isCurrent && (
                        <span className="text-2xs font-medium text-muted-foreground bg-background rounded px-1.5 py-0.5 border border-border/60">
                          atual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-none mt-0.5">
                      {STATUS_DESCRIPTIONS[status]}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "size-3.5 rounded-full border shrink-0 flex items-center justify-center transition-all",
                      isSelected ? "border-foreground/30" : "border-border",
                    )}
                  >
                    {isSelected && <div className="size-1.5 rounded-full bg-foreground/60" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">Nota</p>
            {requiresNote ? (
              <span className="text-xs text-destructive/70">(obrigatório)</span>
            ) : (
              <span className="text-xs text-muted-foreground/60">(opcional)</span>
            )}
          </div>
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
            <p className="text-xs text-muted-foreground text-right tabular-nums">{note.length}/500</p>
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
