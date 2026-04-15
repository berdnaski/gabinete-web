import { useCreateDemandComment, useGetDemandById, useListDemandComments } from "@/api/demands/hooks";
import type { DemandComments } from "@/api/demands/types";
import { Loading } from "@/components/loading";
import { Post } from "@/components/post";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CommentEmptyState } from "./components/comments-empty-state";
import { UserAvatar } from "@/components/user-avatar";
import { CommentItem } from "./components/comment-item";

export function DemandComments() {
  const { demandId } = useParams() as { demandId: string };
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: createComment, isPending: isSubmitting } = useCreateDemandComment();
  const { data: demand, isLoading: isLoadingDemand } = useGetDemandById({ id: demandId });
  const { data: comments, isLoading: isLoadingComments } = useListDemandComments({ demandId, page: 1, limit: 50 });

  function handleSubmit() {
    const content = message.trim();
    if (!content || !demandId) return;

    createComment(
      { demandId, content },
      {
        onSuccess: () => {
          setMessage("");
          inputRef.current?.focus();
        },
      }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  if (isLoadingDemand || !demand) return <Loading />;

  return (
    <section className="max-w-3xl mx-auto">
      <Post demand={demand} hideComment>
        <div>
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Comentários
              {(comments?.items.length ?? 0) > 0 && (
                <span className="ml-2 text-primary font-bold">{comments?.items.length}</span>
              )}
            </p>
          </div>

          {isLoadingComments ? (
            <div className="flex justify-center py-10">
              <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : comments?.items.length === 0 ? (
            <CommentEmptyState />
          ) : (
            <div className="max-h-50 overflow-y-auto space-y-4 pb-2">
              {comments?.items.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}

          <Separator />

          <div className="px-4 py-4">
            <div className="flex items-center gap-2">
              <UserAvatar
                size="default"
                name={user?.name}
                avatarUrl={user?.avatarUrl}
              />


              <Textarea
                rows={1}
                ref={inputRef}
                value={message}
                onKeyDown={handleKeyDown}
                placeholder="Escreva sua mensagem..."
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 resize-none rounded-2xl text-sm min-h-10.5 max-h-32 py-2.5"
                onInput={(e) => {
                  const target = e.currentTarget;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                }}
              />

              <Button
                size="icon"
                onClick={handleSubmit}
                aria-label="Enviar comentário"
                disabled={!message.trim() || isSubmitting}
                className="rounded-full shrink-0 size-9"
              >
                {isSubmitting ? (
                  <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Post>
    </section>
  );
}
