import { useCreateDemandComment, useGetDemandById, useListDemandComments } from "@/api/demands/hooks"
import { Post } from "@/components/post"
import { UpdateProgressDialog } from "@/components/update-progress-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Building2, MessageCircle, Send, TrendingUp } from "lucide-react"
import { useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { UserAvatar } from "@/components/user-avatar"
import { CommentItem } from "./components/comment-item"
import { Loading } from "@/components/loading"

export function DemandComments() {
  const { demandId } = useParams() as { demandId: string }
  const { user, cabinet } = useAuth()

  const [message, setMessage] = useState("")
  const [progressOpen, setProgressOpen] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { mutate: createComment, isPending: isSubmitting } = useCreateDemandComment()
  const { data: demand, isLoading: isLoadingDemand } = useGetDemandById({ id: demandId })
  const { data: comments, isLoading: isLoadingComments } = useListDemandComments({
    demandId,
    page: 1,
    limit: 50,
  })

  const isCabinetMember = user?.isCabinetMember ?? false
  const isMyDemand = isCabinetMember && demand?.cabinetId && cabinet?.id === demand.cabinetId

  function handleSubmit() {
    const content = message.trim()
    if (!content || !demandId) return

    createComment(
      { demandId, content },
      {
        onSuccess: () => {
          setMessage("")
          inputRef.current?.focus()
        },
      },
    )
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (isLoadingDemand || !demand) return <Loading />

  const commentList = comments?.items ?? []
  const totalComments = commentList.length

  return (
    <section className="max-w-3xl mx-auto">
      <Post demand={demand} hideComment showStatus>
        <div>
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Atividade
              </p>
              {totalComments > 0 && (
                <span className="inline-flex items-center justify-center size-4.5 rounded-full bg-primary/10 text-primary text-2xs font-bold leading-none">
                  {totalComments}
                </span>
              )}
            </div>

            {isMyDemand && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 text-xs"
                onClick={() => setProgressOpen(true)}
              >
                <TrendingUp className="size-3.5" />
                Atualizar progresso
              </Button>
            )}
          </div>

          {isLoadingComments ? (
            <div className="flex justify-center py-10">
              <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : totalComments === 0 ? (
            <EmptyActivity />
          ) : (
            <div className="relative pb-2">
              <div
                className="absolute left-8 top-0 bottom-0 w-px bg-border"
                aria-hidden
              />
              <div className="flex flex-col gap-1">
                {[...commentList].reverse().map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="px-4 py-3.5">
            <div className="flex items-end gap-2.5">
              <UserAvatar
                size="default"
                name={user?.name}
                avatarUrl={user?.avatarUrl}
              />

              <div className="flex-1 relative">
                <Textarea
                  rows={1}
                  ref={inputRef}
                  value={message}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isCabinetMember
                      ? "Responda como gabinete (Enter para enviar)..."
                      : "Escreva um comentário..."
                  }
                  onChange={(e) => setMessage(e.target.value)}
                  className={cn(
                    "resize-none rounded-2xl text-sm min-h-10 max-h-32 py-2.5 pr-10",
                    isCabinetMember && "border-primary/30 focus-visible:ring-primary/20",
                  )}
                  onInput={(e) => {
                    const t = e.currentTarget
                    t.style.height = "auto"
                    t.style.height = `${Math.min(t.scrollHeight, 128)}px`
                  }}
                />
                {isCabinetMember && (
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40"
                    title="Você está respondendo como membro do gabinete"
                  >
                    <Building2 className="size-3.5" />
                  </div>
                )}
              </div>

              <Button
                size="icon"
                onClick={handleSubmit}
                aria-label="Enviar comentário"
                disabled={!message.trim() || isSubmitting}
                className="rounded-full shrink-0 size-9 mb-0.5"
              >
                {isSubmitting ? (
                  <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>

            {isCabinetMember && message.trim().length > 0 && (
              <p className="text-2xs text-primary/60 mt-1.5 pl-11">
                Este comentário será marcado como resposta oficial do gabinete.
              </p>
            )}
          </div>
        </div>
      </Post>

      {isMyDemand && (
        <UpdateProgressDialog
          demandId={demand.id}
          demandTitle={demand.title}
          currentStatus={demand.status}
          open={progressOpen}
          onOpenChange={setProgressOpen}
        />
      )}
    </section>
  )
}

function EmptyActivity() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center px-6">
      <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-2.5">
        <MessageCircle className="size-4 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">Nenhuma atividade ainda</p>
      <p className="text-xs text-muted-foreground mt-0.5">
        Comentários e atualizações de status aparecerão aqui.
      </p>
    </div>
  )
}
