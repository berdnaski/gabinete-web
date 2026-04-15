interface PostInfoProps {
  category: string;
  dateToNow: string;
  authorName: string;
}

export function PostInfo({ category, dateToNow, authorName }: PostInfoProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-sm font-semibold leading-none">{authorName}</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {category && (
          <>
            <span>{category}</span>
            <span aria-hidden>·</span>
          </>
        )}
        <span>{dateToNow}</span>
      </div>
    </div>
  )
}