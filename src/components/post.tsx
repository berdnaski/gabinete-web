import { useLikeDemand } from "@/api/demands/hooks";
import type { Demand } from "@/api/demands/types";
import { ExternalLinkIcon, MapPinIcon, MessageCircle, MoreHorizontal, ThumbsUp } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Gallery } from "./gallery";
import { UserAvatar } from "./user-avatar";
import { Separator } from "./ui/separator";
import { PostInfo } from "./post-info";
import { formatDateToNow } from "@/utils/format-date-to-now";
import { Button } from "./ui/button";
import { AuthRequiredModal } from "./auth-required-modal";

export interface PostProps extends ComponentProps<"article"> {
  demand: Demand;
  hideComment?: boolean;
}

export function Post({
  demand,
  className,
  hideComment = false,
  children,
  ...props
}: PostProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalVariant, setAuthModalVariant] = useState<"like" | "comment">("like");

  const { mutate: likeDemand } = useLikeDemand();

  const liked = demand.isLiked;
  const likeCount = demand.likesCount;
  const authorName = demand.reporter?.name || demand.guestEmail as string;

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthModalVariant("like");
      setShowAuthModal(true);
      return;
    }
    likeDemand(demand.id);
  }

  function handleComment(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthModalVariant("comment");
      setShowAuthModal(true);
      return;
    }
    navigate(`/comments/${demand.id}`);
  }

  const mapsUrl =
    demand.lat && demand.long
      ? `https://www.google.com/maps?q=${demand.lat},${demand.long}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demand.address ?? "")}`;

  return (
    <article
      className={cn(
        "bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden w-full cursor-pointer",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            name={authorName}
            avatarUrl={demand?.reporter?.avatarUrl}
          />
          <PostInfo
            authorName={authorName}
            category={demand?.category?.name}
            dateToNow={formatDateToNow(demand.createdAt)}
          />
        </div>

        <Button
          size="icon"
          variant="ghost"
          aria-label="Mais opções"
          className="text-muted-foreground rounded-full -mt-0.5 -mr-1 size-8"
        >
          <MoreHorizontal />
        </Button>
      </div>

      <div className="px-4 pb-4 space-y-2">
        <p className="text-sm font-semibold">{demand.title}</p>
        <p className="text-sm leading-relaxed">{demand.description}</p>
      </div>

      {demand.evidences && demand.evidences.length > 0 && (
        <Gallery images={demand.evidences} />
      )}

      {demand.address && (
        <div className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Localização Geográfica
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <MapPinIcon className="size-4 text-primary shrink-0" />
              <span>{demand.address}</span>
            </div>
            <Link
              to={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="link">
                Ver no mapa
                <ExternalLinkIcon className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {(likeCount > 0 || demand.commentsCount > 0) && (
        <div className="flex items-center justify-between px-4 pb-4">
          {likeCount > 0 ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex size-4.5 items-center justify-center rounded-full bg-primary ring-2 ring-card">
                <ThumbsUp className="size-3 text-white" />
              </span>
              <span>{likeCount}</span>
            </div>
          ) : <span />}

          {demand.commentsCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {demand.commentsCount} {demand.commentsCount === 1 ? "comentário" : "comentários"}
            </span>
          )}
        </div>
      )}

      <Separator />

      <div className={cn("grid grid-cols-2 px-2 py-1", { 'grid-cols-1': hideComment })}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 rounded-lg font-medium h-9 text-muted-foreground",
            liked && "text-primary",
          )}
          onClick={handleLike}
        >
          <ThumbsUp
            className={cn("size-4 transition-all", liked && "fill-primary")}
          />
          <span>Apoiar</span>
        </Button>

        {!hideComment && (
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 rounded-lg font-medium h-9 text-muted-foreground"
            onClick={handleComment}
          >
            <MessageCircle className="size-4" />
            <span>Comentar</span>
          </Button>
        )}
      </div>

      {children && (
        <>
          <Separator />
          {children}
        </>
      )}

      <AuthRequiredModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        variant={authModalVariant}
      />
    </article>
  );
}
