import type { Demand } from "@/api/demands/types";
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, MapPinIcon, MessageCircle, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Gallery } from "./gallery";

export interface PostProps extends ComponentProps<"article"> {
  demand: Demand;
}

export function Post({
  demand,
  className,
  ...props
}: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const authorName = demand.reporter?.name || demand.guestEmail || "Anônimo";
  const authorInitials = demand.guestEmail
    ? "?"
    : getFirstLettersFromNames(authorName);
  const timestamp = demand.createdAt
    ? formatDistanceToNow(new Date(demand.createdAt), { addSuffix: true, locale: ptBR })
    : "";

  function handleLike() {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }

  return (
    <article
      className={cn(
        "bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden w-full",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            {demand.reporter?.avatarUrl && (
              <AvatarImage src={demand.reporter.avatarUrl} alt={authorName} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {authorInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold leading-none">{authorName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {demand.category?.name && (
                <>
                  <span>{demand.category.name}</span>
                  <span aria-hidden>·</span>
                </>
              )}
              <span>{timestamp}</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground rounded-full -mt-0.5 -mr-1 size-8"
          aria-label="Mais opções"
        >
          <MoreHorizontal />
        </Button>
      </div>

      <div className="px-4 pb-3 space-y-2">
        <p className="text-sm font-semibold">{demand.title}</p>
        <p className="text-sm leading-relaxed">{demand.description}</p>
        {demand.address && (
          <a
            href={
              demand.lat && demand.long
                ? `https://www.google.com/maps?q=${demand.lat},${demand.long}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demand.address)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-primary mt-0.5 w-fit transition-colors"
          >
            <MapPinIcon className="size-3.5 shrink-0" />
            <span className="text-xs">{demand.address}</span>
          </a>
        )}
      </div>


      {demand.evidences && demand.evidences.length > 0 && (
        <Gallery images={demand.evidences} />
      )}

      {likeCount > 0 && (
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <span className="inline-flex size-4.5 items-center justify-center rounded-full bg-primary text-[9px] ring-2 ring-card">
                <ThumbsUp className="size-3 text-white" />
              </span>
              <span className="inline-flex size-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] ring-2 ring-card">
                <Heart className="size-3 text-white" />
              </span>
            </div>
            <span>{likeCount}</span>
          </div>
        </div>
      )}

      <div className="mx-4 border-t border-border" />

      <div className="grid grid-cols-3 px-2 py-1">
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
          <span>Curtir</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="gap-2 rounded-lg font-medium h-9 text-muted-foreground"
        >
          <MessageCircle className="size-4" />
          <span>Comentar</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="gap-2 rounded-lg font-medium h-9 text-muted-foreground"
        >
          <Share2 className="size-4" />
          <span>Compartilhar</span>
        </Button>
      </div>
    </article>
  );
}
