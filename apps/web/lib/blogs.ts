import { type Locale, defaultLocale } from '@/lib/i18n';
import { slugifyHeading } from '@/lib/slugify';

const legacyBlogRedirects = new Map<string, string>([
  ['cicd/github-actions/java/publish-maven-package-to-github-package-part-1', '/vi/blog/publish-maven-package-to-github-package-part-1'],
  ['devops/kubernetes-jvm-memory', '/vi/blog/kubernetes-jvm-memory'],
  ['java/sdkman/install-java-using-sdkman', '/vi/blog/install-java-using-sdkman'],
  ['multiple-git-profiles', '/vi/blog/multiple-git-profiles'],
  ['nextjs/typed-mdx-blog', '/vi/blog/typed-mdx-blog'],
  ['spring-modulith/module-boundaries', '/vi/blog/module-boundaries'],
]);

const blogDateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  vi: new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
  en: new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
};

export function normalizeTag(tag: string) {
  return slugifyHeading(tag);
}

export function formatBlogDate(date: string, locale: Locale = defaultLocale) {
  return blogDateFormatters[locale].format(new Date(date));
}

export function getLocalizedBlogUrl(locale: Locale, slug: string) {
  return `/${locale}/blog/${slug}` as const;
}

export function getTagUrl(locale: Locale, tag: string) {
  return `/${locale}/tags/${normalizeTag(tag)}` as const;
}

export function getLegacyBlogRedirect(legacySlug: string) {
  const normalizedSlug = legacySlug.replace(/^\/+|\/+$/g, '');
  return legacyBlogRedirects.get(normalizedSlug) ?? null;
}
