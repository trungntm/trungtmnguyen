import GithubSlugger from 'github-slugger';

function createSlugger() {
  return new GithubSlugger();
}

export function slugifyHeading(text: string): string {
  const slug = createSlugger().slug(text.trim());

  return slug || 'section';
}

export function createUniqueHeadingSlug(text: string, used: Map<string, number>): string {
  const baseSlug = slugifyHeading(text);
  const duplicateCount = used.get(baseSlug) ?? 0;

  used.set(baseSlug, duplicateCount + 1);

  return duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount}`;
}
