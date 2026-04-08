import { Globe, Heart, MessageCircle, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export interface PostProps extends ComponentProps<"article"> {
  author?: {
    name: string;
    initials: string;
    avatarUrl?: string;
  };
  timestamp?: string;
  content?: string;
  imageUrl?: string;
  reactions?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export function Post({
  author = {
    name: "Ronaldo Filho",
    initials: "RF",
  },
  timestamp = "Há 20 minutos",
  content = "Olha o absurdo que encontramos hoje",
  imageUrl,
  reactions = {
    likes: 128,
    comments: 24,
    shares: 8,
  },
  className,
  ...props
}: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reactions.likes);

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
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            {author.avatarUrl && (
              <AvatarImage src={author.avatarUrl} alt={author.name} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {author.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold leading-none">{author.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{timestamp}</span>
              <span aria-hidden>·</span>
              <Globe className="size-3" />
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

      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed">{content}</p>
      </div>

      {imageUrl && (
        <div className="w-full border-y border-border">
          <img
            src={imageUrl}
            alt="Imagem do post"
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {(likeCount > 0 || reactions.comments > 0 || reactions.shares > 0) && (
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
          {likeCount > 0 && (
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
          )}

          <div className="flex gap-3 ml-auto">
            {reactions.comments > 0 && (
              <button
                type="button"
                className="hover:underline cursor-pointer"
              >
                {reactions.comments} comentários
              </button>
            )}
            {reactions.shares > 0 && (
              <span>{reactions.shares} compartilhamentos</span>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mx-4 border-t border-border" />

      {/* Action buttons */}
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
          variant="ghost"
          size="sm"
          className="gap-2 rounded-lg font-medium h-9 text-muted-foreground"
        >
          <MessageCircle className="size-4" />
          <span>Comentar</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-lg font-medium h-9 text-muted-foreground"
        >
          <Share2 className="size-4" />
          <span>Compartilhar</span>
        </Button>
      </div>
    </article>
  );
}
