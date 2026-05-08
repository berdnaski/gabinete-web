import type { Demand } from "@/api/demands/types"
import { DemandDetailSheet } from "@/components/demand-detail-sheet"
import { UpdateProgressDialog } from "@/components/update-progress-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Row } from "@tanstack/react-table"
import {
  ExternalLinkIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PanelRightIcon,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function ActionsCell({ row }: { row: Row<Demand> }) {
  const demand = row.original
  const navigate = useNavigate()
  const [progressOpen, setProgressOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate(`/comments/${demand.id}`)}>
            <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
            Abrir demanda
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDetailOpen(true)}>
            <PanelRightIcon className="size-3.5 text-muted-foreground" />
            Ver no painel lateral
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProgressOpen(true)}>
            <TrendingUp className="size-3.5 text-muted-foreground" />
            Atualizar progresso
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/comments/${demand.id}`)}>
            <MessageSquareIcon className="size-3.5 text-muted-foreground" />
            Comentar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateProgressDialog
        demandId={demand.id}
        currentStatus={demand.status}
        open={progressOpen}
        onOpenChange={setProgressOpen}
      />
      <DemandDetailSheet demand={demand} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  )
}
