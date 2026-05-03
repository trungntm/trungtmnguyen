type TopicCardProps = {
  description: string;
  title: string;
};

export function TopicCard({ description, title }: TopicCardProps) {
  return (
    <article className="glass-card rounded-[1.6rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/55">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-sm leading-7 text-muted">{description}</p>
      </div>
    </article>
  );
}
