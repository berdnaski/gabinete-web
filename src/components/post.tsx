import { useLikeDemand, useUnlinkDemand } from "@/api/demands/hooks";
import type { Demand } from "@/api/demands/types";
import { Building2, ExternalLinkIcon, MapPinIcon, MessageCircle, MoreHorizontal, ThumbsUp, Unlink, UserCheck } from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
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
import { DemandStatusBadge } from "./demand-status-badge";
import { ClaimDemandFlow } from "./claim-demand-flow";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AssignMemberDialog } from "@/pages/private/demands/components/assign-member-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

export interface PostProps extends ComponentProps<"article"> {
  demand: Demand;
  hideComment?: boolean;
  showStatus?: boolean;
}

export function Post({
  demand,
  className,
  hideComment = false,
  showStatus = false,
  children,
  ...props
}: PostProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, cabinet } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalVariant, setAuthModalVariant] = useState<"like" | "comment">("like");
  const [showClaimFlow, setShowClaimFlow] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);

  const isCabinetMember = user?.isCabinetMember ?? false;
  const isUnlinked = !demand.cabinetId;
  const userOwnsDemand = isCabinetMember && !!demand.cabinetId && cabinet?.id === demand.cabinetId;

  const { mutate: likeDemand } = useLikeDemand();
  const { mutate: unlinkDemand, isPending: isUnlinking } = useUnlinkDemand();

  const [liked, setLiked] = useState(demand.isLiked);
  const [likeCount, setLikeCount] = useState(demand.likesCount);

  useEffect(() => {
    setLiked(demand.isLiked);
    setLikeCount(demand.likesCount);
  }, [demand.isLiked, demand.likesCount]);

  const authorName = demand.reporter?.name || demand.guestEmail as string;
  const profilePath = demand.reporterId ? `/profile/${demand.reporterId}` : null;

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthModalVariant("like");
      setShowAuthModal(true);
      return;
    }
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => wasLiked ? c - 1 : c + 1);
    likeDemand(demand.id, {
      onError: () => {
        setLiked(wasLiked);
        setLikeCount(demand.likesCount);
      },
    });
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

  function handleUnlink() {
    unlinkDemand(demand.id, {
      onSuccess: () => {
        toast.success("Demanda desvinculada do gabinete");
        setShowUnlinkDialog(false);
      },
      onError: () => {
        toast.error("Erro ao desvincular demanda");
      },
    });
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
        <div
          className="flex items-center gap-3 min-w-0 flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          {profilePath ? (
            <Link to={profilePath} className="shrink-0">
              <UserAvatar size="lg" name={authorName} avatarUrl={demand?.reporter?.avatarUrl} />
            </Link>
          ) : (
            <UserAvatar size="lg" name={authorName} avatarUrl={demand?.reporter?.avatarUrl} />
          )}

          {profilePath ? (
            <Link to={profilePath} className="min-w-0">
              <PostInfo
                authorName={authorName}
                category={demand?.category?.name}
                dateToNow={formatDateToNow(demand.createdAt)}
              />
            </Link>
          ) : (
            <PostInfo
              authorName={authorName}
              category={demand?.category?.name}
              dateToNow={formatDateToNow(demand.createdAt)}
            />
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {showStatus && <DemandStatusBadge status={demand.status} />}

          {demand.cabinet && (
            <Link
              to={`/gabinetes/${demand.cabinet.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold leading-none bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors"
            >
              <Avatar className="size-3.5 shrink-0">
                <AvatarImage src={demand.cabinet.avatarUrl ?? undefined} />
                <AvatarFallback className="text-2xs bg-primary/10 text-primary">
                  {getFirstLettersFromNames(demand.cabinet.name)}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-24 truncate">{demand.cabinet.name}</span>
            </Link>
          )}

          {userOwnsDemand && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Mais opções"
                  className="text-muted-foreground rounded-full -mt-0.5 -mr-1 size-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                  <UserCheck className="size-4" />
                  Alterar responsável
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowUnlinkDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Unlink className="size-4" />
                  Desvincular demanda
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
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
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
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
              onClick={(e) => e.stopPropagation()}
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

      <div className={cn(
        "grid px-2 py-1",
        hideComment
          ? "grid-cols-1"
          : (isCabinetMember && isUnlinked ? "grid-cols-3" : "grid-cols-2"),
      )}>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2 rounded-lg font-medium h-9 text-muted-foreground", liked && "text-primary")}
          onClick={handleLike}
        >
          <ThumbsUp className={cn("size-4 transition-all", liked && "fill-primary")} />
          <span>Apoiar</span>
        </Button>

        {isCabinetMember && isUnlinked && !hideComment && (
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 rounded-lg font-medium h-9 text-muted-foreground"
            onClick={(e) => { e.stopPropagation(); setShowClaimFlow(true); }}
          >
            <Building2 className="size-4" />
            <span>Vincular</span>
          </Button>
        )}

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

      {isCabinetMember && (
        <ClaimDemandFlow
          demand={demand}
          open={showClaimFlow}
          onOpenChange={setShowClaimFlow}
        />
      )}

      {userOwnsDemand && (
        <>
          <AssignMemberDialog
            demand={demand}
            open={showAssignDialog}
            onOpenChange={setShowAssignDialog}
          />

          <Dialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Unlink className="size-4 text-destructive" />
                  Desvincular demanda
                </DialogTitle>
                <DialogDescription>
                  A demanda será desvinculada do gabinete e o responsável será removido. Esta ação pode ser desfeita vinculando novamente.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Demanda</p>
                <p className="text-sm font-semibold text-foreground line-clamp-2">{demand.title}</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUnlinkDialog(false)} disabled={isUnlinking}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleUnlink} disabled={isUnlinking}>
                  Desvincular
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </article>
  );
}
