type CommentAvatarProps = {
  displayName: string;
  isReply?: boolean;
};

function getInitials(displayName: string) {
  const words = displayName.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return '?';
  if (words.length === 1) return words[0]!.slice(0, 2).toLocaleUpperCase();

  return `${words[0]![0]}${words.at(-1)![0]}`.toLocaleUpperCase();
}

export function CommentAvatar({ displayName, isReply = false }: CommentAvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={
        isReply
          ? 'flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[0.625rem] font-semibold text-primary sm:size-9 sm:text-xs'
          : 'flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/15 text-xs font-semibold text-primary sm:size-10'
      }
    >
      {getInitials(displayName)}
    </div>
  );
}
