import type { Demand } from "@/api/demands/types"
import { useDeleteResult, useGetDemandResults, useUploadResultProtocol } from "@/api/results/hooks"
import type { Result, ResultType } from "@/api/results/types"
import { CreateResultDialog } from "./create-result-dialog"
import { DemandStatusBadge } from "./demand-status-badge"
import { Gallery } from "./gallery"
import { UpdateProgressDialog } from "./update-progress-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentMember } from "@/hooks/use-current-member"
import { cn } from "@/lib/utils"
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import { formatDateToNow } from "@/utils/format-date-to-now"
import {
  CalendarIcon,
  ExternalLinkIcon,
  FileTextIcon,
  Loader2,
  MapPinIcon,
  Paperclip,
  Plus,
  TagIcon,
  Trash2,
  TrendingUp,
  UserRound,
} from "lucide-react"
import { useRef, useState } from "react"

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
import { Link } from "react-router-dom"
import { DemandPriority } from "@/pages/private/demands/components/demand-priority"
import { toast } from "sonner"

const RESULT_TYPE_LABELS: Record<ResultType, string> = {
  INFRASTRUCTURE: "Infraestrutura",
  SOCIAL: "Social",
  LEGISLATIVE: "Legislativo",
  OTHER: "Outro",
}

const RESULT_TYPE_DOT: Record<ResultType, string> = {
  INFRASTRUCTURE: "bg-blue-500",
  SOCIAL: "bg-emerald-500",
  LEGISLATIVE: "bg-purple-500",
  OTHER: "bg-muted-foreground/40",
}

interface DemandDetailSheetProps {
  demand: Demand | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DemandDetailSheet({
  demand,
  open,
  onOpenChange,
}: DemandDetailSheetProps) {
  const { user, cabinet } = useAuth()
  const { currentMember } = useCurrentMember()
  const [progressOpen, setProgressOpen] = useState(false)
  const [resultOpen, setResultOpen] = useState(false)

  const { data: resultsData, isLoading: resultsLoading } = useGetDemandResults(demand?.id)
  const results = resultsData?.items ?? []

  if (!demand) return null

  const isCabinetMember = user?.isCabinetMember ?? false
  const isMyDemand = !!demand.cabinetId && cabinet?.id === demand.cabinetId
  const isAssignedMember = !!demand.assigneeMemberId && currentMember?.id === demand.assigneeMemberId
  const canManage = isCabinetMember && isMyDemand

  const mapsUrl =
    demand.lat && demand.long
      ? `https://www.google.com/maps?q=${demand.lat},${demand.long}`
      : demand.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demand.address)}`
        : null

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 gap-0 flex flex-col">
          <SheetHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
            <div className="flex items-start gap-3 pr-8">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-semibold leading-snug text-left">
                  {demand.title}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <DemandStatusBadge status={demand.status} />
                  {demand.priority && <DemandPriority variant={demand.priority} />}
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-4 flex flex-col gap-5">
              <section>
                <SectionLabel>Descrição</SectionLabel>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {demand.description}
                </p>
              </section>

              <section className="grid grid-cols-2 gap-3">
                {demand.category && (
                  <InfoItem icon={<TagIcon className="size-3.5" />} label="Categoria">
                    {demand.category.name}
                  </InfoItem>
                )}
                <InfoItem icon={<CalendarIcon className="size-3.5" />} label="Data">
                  {formatDateToNow(demand.createdAt)}
                </InfoItem>
              </section>

              {demand.reporter ? (
                <section>
                  <SectionLabel>Relatado por</SectionLabel>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src={demand.reporter.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {getFirstLettersFromNames(demand.reporter.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {demand.reporter.name}
                      </p>
                      {demand.reporterId && (
                        <Link
                          to={`/profile/${demand.reporterId}`}
                          className="text-xs text-primary hover:underline"
                          onClick={() => onOpenChange(false)}
                        >
                          Ver perfil
                        </Link>
                      )}
                    </div>
                  </div>
                </section>
              ) : demand.guestEmail ? (
                <section>
                  <SectionLabel>Relatado por</SectionLabel>
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <UserRound className="size-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{demand.guestEmail}</p>
                  </div>
                </section>
              ) : null}

              {demand.address && (
                <section>
                  <SectionLabel>Localização</SectionLabel>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 text-sm text-foreground/80">
                      <MapPinIcon className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{demand.address}</span>
                    </div>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Ver mapa
                        <ExternalLinkIcon className="size-3" />
                      </a>
                    )}
                  </div>
                </section>
              )}

              {demand.evidences && demand.evidences.length > 0 && (
                <section>
                  <SectionLabel>
                    Evidências do cidadão ({demand.evidences.length})
                  </SectionLabel>
                  <Gallery images={demand.evidences} />
                </section>
              )}

              <section>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <SectionLabel noMargin>
                    Resultados{results.length > 0 ? ` (${results.length})` : ""}
                  </SectionLabel>
                  {isAssignedMember && (
                    <button
                      onClick={() => setResultOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="size-3.5" />
                      Adicionar
                    </button>
                  )}
                </div>

                {resultsLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="size-4 text-muted-foreground animate-spin" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {results.map((result) => (
                      <ResultCard key={result.id} result={result} canDelete={canManage} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-5 text-center">
                    <p className="text-sm text-muted-foreground">
                      {isAssignedMember
                        ? "Nenhum resultado ainda. Registre o que foi feito."
                        : "Nenhum resultado registrado."}
                    </p>
                  </div>
                )}
              </section>

              {demand.cabinet && (
                <section>
                  <SectionLabel>Gabinete responsável</SectionLabel>
                  <Link
                    to={`/gabinetes/${demand.cabinet.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="size-7 shrink-0">
                      <AvatarImage src={demand.cabinet.avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xs font-bold">
                        {getFirstLettersFromNames(demand.cabinet.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      {demand.cabinet.name}
                    </span>
                  </Link>
                </section>
              )}
            </div>
          </div>

          {(isAssignedMember || canManage) && (
            <>
              <Separator />
              <div className="px-5 py-4 shrink-0 flex items-center gap-2">
                {isAssignedMember && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => setProgressOpen(true)}
                  >
                    <TrendingUp className="size-4" />
                    Atualizar progresso
                  </Button>
                )}
                <Button variant="outline" className={cn(!isAssignedMember && "flex-1")} asChild>
                  <Link to={`/comments/${demand.id}`} onClick={() => onOpenChange(false)}>
                    Ver comentários
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {isAssignedMember && (
        <UpdateProgressDialog
          demandId={demand.id}
          currentStatus={demand.status}
          hasResults={results.length > 0}
          open={progressOpen}
          onOpenChange={setProgressOpen}
          onNeedsResults={() => setResultOpen(true)}
          onSuccess={() => onOpenChange(false)}
        />
      )}

      {isAssignedMember && (
        <CreateResultDialog
          demand={demand}
          open={resultOpen}
          onOpenChange={setResultOpen}
        />
      )}
    </>
  )
}

function ResultCard({ result, canDelete }: { result: Result; canDelete?: boolean }) {
  const { mutate: deleteResult, isPending: isDeleting } = useDeleteResult(result.demandId)
  const { mutate: uploadProtocol, isPending: isUploadingProtocol } = useUploadResultProtocol(result.demandId)
  const protocolInputRef = useRef<HTMLInputElement>(null)
  const [confirming, setConfirming] = useState(false)

  function handleDelete() {
    deleteResult(result.id, {
      onError: () => toast.error("Erro ao excluir resultado"),
    })
  }

  function handleProtocolFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 20MB.")
      return
    }
    uploadProtocol(
      { id: result.id, file },
      {
        onSuccess: () => toast.success("Protocolo anexado com sucesso"),
        onError: () => toast.error("Erro ao anexar protocolo"),
      },
    )
    e.target.value = ""
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={cn("size-1.5 rounded-full shrink-0", RESULT_TYPE_DOT[result.type])} />
          <span className="text-xs font-medium text-muted-foreground">
            {RESULT_TYPE_LABELS[result.type]}
          </span>
        </div>

        {canDelete ? (
          confirming ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setConfirming(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-destructive font-medium hover:text-destructive/70 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDateToNow(result.createdAt)}
              </span>
              <button
                onClick={() => setConfirming(true)}
                className="text-muted-foreground/30 hover:text-destructive transition-colors"
                title="Excluir resultado"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          )
        ) : (
          <span className="text-xs text-muted-foreground shrink-0">
            {formatDateToNow(result.createdAt)}
          </span>
        )}
      </div>

      <p className="text-sm font-medium text-foreground leading-snug">{result.title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {result.description}
      </p>

      {result.images && result.images.length > 0 && (
        <div className="grid grid-cols-4 gap-1 mt-1">
          {result.images.map((img) => (
            <a
              key={img.id}
              href={img.url}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-md overflow-hidden border border-border bg-muted block"
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            </a>
          ))}
        </div>
      )}

      {result.protocolFileUrl ? (
        <a
          href={result.protocolFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 hover:bg-primary/10 transition-colors group mt-0.5"
        >
          <div className="size-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <FileTextIcon className="size-3.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary truncate">
              {result.protocolFileName ?? "Protocolo oficial"}
            </p>
            {result.protocolFileSize && (
              <p className="text-2xs text-primary/60">{formatBytes(result.protocolFileSize)} · clique para abrir</p>
            )}
          </div>
          <ExternalLinkIcon className="size-3 text-primary/40 shrink-0 group-hover:text-primary/70 transition-colors" />
        </a>
      ) : canDelete ? (
        <>
          <button
            type="button"
            onClick={() => protocolInputRef.current?.click()}
            disabled={isUploadingProtocol}
            className="flex items-center gap-2 rounded-lg border border-dashed border-border/60 px-3 py-2 hover:border-border hover:bg-muted/20 transition-all text-left mt-0.5 disabled:opacity-50"
          >
            {isUploadingProtocol ? (
              <Loader2 className="size-3.5 text-muted-foreground animate-spin shrink-0" />
            ) : (
              <Paperclip className="size-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="text-xs text-muted-foreground">
              {isUploadingProtocol ? "Enviando protocolo..." : "Anexar protocolo oficial"}
            </span>
          </button>
          <input
            ref={protocolInputRef}
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            className="hidden"
            onChange={handleProtocolFile}
          />
        </>
      ) : null}
    </div>
  )
}

function SectionLabel({
  children,
  noMargin = false,
}: {
  children: React.ReactNode
  noMargin?: boolean
}) {
  return (
    <p className={cn("text-xs font-medium text-muted-foreground", !noMargin && "mb-2")}>
      {children}
    </p>
  )
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-sm text-foreground">{children}</span>
    </div>
  )
}
