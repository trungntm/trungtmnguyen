import type { ComponentPropsWithoutRef } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutLayout } from '@/components/about/about-layout';
import { ActivitySection } from '@/components/about/activity-section';
import { Chip } from '@/components/about/chip';
import { ProfileCard } from '@/components/about/profile-card';
import { QuickFactsCard } from '@/components/about/quick-facts-card';
import { SkillsSection } from '@/components/about/skills-section';
import { TimelineSection } from '@/components/about/timeline-section';
import { GithubCalendarSection } from '@/components/github/github-calendar-section';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import { HoverUnderlineText } from '@/components/ui/hover-underline-text';
import { getAboutPage } from '@/lib/pages';
import { cn } from '@/lib/utils';

const aboutMdxComponents = {
  h2: ({ className, children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <HoverUnderlineText
      as="h2"
      className={cn(
        'mt-12 scroll-mt-28 text-3xl font-semibold tracking-tight text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </HoverUnderlineText>
  ),
  h3: ({ className, children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <HoverUnderlineText
      as="h3"
      className={cn(
        'mt-10 scroll-mt-28 text-2xl font-semibold tracking-tight text-foreground',
        className,
      )}
      underlineClassName="mt-1.5"
      {...props}
    >
      {children}
    </HoverUnderlineText>
  ),
};

export async function generateMetadata(): Promise<Metadata> {
  const about = getAboutPage();

  if (!about) {
    return {
      title: 'About',
      description: 'About page',
    };
  }

  return {
    title: about.title,
    description: about.description,
    alternates: {
      canonical: '/about',
    },
    openGraph: {
      type: 'profile',
      title: about.title,
      description: about.description,
      url: '/about',
    },
    twitter: {
      card: 'summary_large_image',
      title: about.title,
      description: about.description,
    },
  };
}

export default function AboutPage() {
  const about = getAboutPage();

  if (!about) {
    notFound();
  }

  return (
    <AboutLayout
      description={about.description}
      eyebrow="About me"
      sidebar={
        <>
          <ProfileCard
            avatarImage={about.avatarImage}
            avatarText={about.avatarText}
            company={about.company}
            email={about.email}
            location={about.location}
            name={about.name}
            phone={about.phone}
            role={about.role}
            socials={about.socials}
          />
          <QuickFactsCard facts={about.quickFacts} />
        </>
      }
      title={about.headline}
    >
      <section className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
        <MDXRenderer code={about.mdx} components={aboutMdxComponents} />
      </section>

      <SkillsSection skills={about.skills} />
      <GithubCalendarSection user="trungntm" />
      <ActivitySection activities={about.activities} />

      {about.education?.length ? (
        <TimelineSection eyebrow="Education" items={about.education} title="Academic foundation" />
      ) : null}

      {about.languages?.length ? (
        <section className="glass-card rounded-[2rem] p-6 md:p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
                Communication
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">Languages</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {about.languages.map((language) => (
                <Chip key={language}>{language}</Chip>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {about.career?.length ? (
        <TimelineSection eyebrow="Career path" items={about.career} title="Growth and trajectory" />
      ) : null}
    </AboutLayout>
  );
}
