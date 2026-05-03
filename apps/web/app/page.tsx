import { CoreTopics } from '@/components/home/core-topics';
import { EngineeringPhilosophy } from '@/components/home/engineering-philosophy';
import { HomeHero } from '@/components/home/home-hero';
import { LatestNotes } from '@/components/home/latest-notes';
import { getPublishedBlogs } from '@/lib/blogs';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  description:
    'Practical notes about software architecture, Java, Spring Boot, Next.js, DevOps, and modern engineering.',
  path: '/',
});

export default function HomePage() {
  const latestBlogs = getPublishedBlogs().slice(0, 3);

  return (
    <div className="page-shell">
      <div className="glow-background pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-background pointer-events-none absolute inset-0 -z-10" />

      <div className="space-y-16 pb-20 pt-6 md:space-y-24 md:pb-24 md:pt-8">
        <HomeHero />
        <LatestNotes blogs={latestBlogs} />
        <CoreTopics />
        <EngineeringPhilosophy />
      </div>
    </div>
  );
}
