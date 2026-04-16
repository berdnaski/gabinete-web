import { UserAvatar } from "@/components/user-avatar";
import { formatDateToNow } from "@/utils/format-date-to-now";
import type { DemandComments } from "@/api/demands/types";

interface CommentItemProps {
  comment: DemandComments;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3 px-4">
      <UserAvatar
        size="default"
        name={comment.authorName}
        avatarUrl={comment.authorAvatarUrl}
      />

      <div className="flex-1 min-w-0">
        <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
          <p className="text-xs font-semibold text-foreground leading-none mb-1">
            {comment.authorName}
          </p>
          <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>
        </div>
        <span className="text-[11px] text-muted-foreground block mt-1">
          {formatDateToNow(comment.createdAt)}
        </span>
      </div>
    </div>
  );
}
