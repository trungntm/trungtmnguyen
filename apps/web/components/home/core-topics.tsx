import { TopicCard } from './topic-card';
import type { Dictionary } from '@/lib/i18n';

const topics = [
  {
    title: 'Java & Spring',
    description: 'Spring Boot, Modulith, JPA, caching, events, and backend architecture.',
  },
  {
    title: 'Next.js',
    description: 'App Router, MDX, SEO, RSC, frontend architecture, and web performance.',
  },
  {
    title: 'DevOps',
    description: 'Docker, Kubernetes, CI/CD, JVM runtime tuning, and production operations.',
  },
  {
    title: 'System Design',
    description: 'Trade-offs, boundaries, scaling patterns, and pragmatic architecture decisions.',
  },
];

type CoreTopicsProps = {
  dictionary: Dictionary;
};

export function CoreTopics({ dictionary }: CoreTopicsProps) {
  return (
    <section className="page-container px-4 md:px-6" aria-labelledby="core-topics-heading">
      <div className="space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
            {dictionary.home.topicsEyebrow}
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            id="core-topics-heading"
          >
            {dictionary.home.topicsTitle}
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {topics.map((topic) => (
            <TopicCard key={topic.title} description={topic.description} title={topic.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
