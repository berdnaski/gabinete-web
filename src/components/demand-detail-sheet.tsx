import type { Demand } from "@/api/demands/types"
import { DemandStatusBadge } from "./demand-status-badge"
import { UpdateProgressDialog } from "./update-progress-dialog"
import { Gallery } from "./gallery"
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
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names"
import { formatDateToNow } from "@/utils/format-date-to-now"
import {
  CalendarIcon,
  ExternalLinkIcon,
  MapPinIcon,
  TagIcon,
  TrendingUp,
  UserRound,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { DemandPriority } from "@/pages/private/demands/components/demand-priority"

interface DemandDetailSheetProps {
  demand: Demand | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DemandDetailSheet({ demand, open, onOpenChange }: DemandDetailSheetProps) {
  const { user, cabinet } = useAuth()
  const [progressOpen, setProgressOpen] = useState(false)

  if (!demand) return null

  const isCabinetMember = user?.isCabinetMember ?? false
  const isMyDemand = demand.cabinetId && cabinet?.id === demand.cabinetId

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
                <p className="text-sm text-foreground/80 leading-relaxed">{demand.description}</p>
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

              {demand.reporter && (
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
                      <p className="text-sm font-medium text-foreground">{demand.reporter.name}</p>
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
              )}

              {!demand.reporter && demand.guestEmail && (
                <section>
                  <SectionLabel>Relatado por</SectionLabel>
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <UserRound className="size-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{demand.guestEmail}</p>
                  </div>
                </section>
              )}

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
                  <SectionLabel>Evidências ({demand.evidences.length})</SectionLabel>
                  <Gallery images={demand.evidences} />
                </section>
              )}

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
                    <span className="text-sm font-medium text-foreground">{demand.cabinet.name}</span>
                  </Link>
                </section>
              )}
            </div>
          </div>

          {isCabinetMember && isMyDemand && (
            <>
              <Separator />
              <div className="px-5 py-4 shrink-0 flex items-center gap-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => setProgressOpen(true)}
                >
                  <TrendingUp className="size-4" />
                  Atualizar progresso
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  asChild
                >
                  <Link to={`/comments/${demand.id}`}>Ver comentários</Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {isCabinetMember && isMyDemand && (
        <UpdateProgressDialog
          demandId={demand.id}
          demandTitle={demand.title}
          currentStatus={demand.status}
          open={progressOpen}
          onOpenChange={setProgressOpen}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
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
        <span className="text-2xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm text-foreground">{children}</span>
    </div>
  )
}
