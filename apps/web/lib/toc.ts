import { createUniqueHeadingSlug } from './slugify';

export type TocItem = {
  id: string;
  title: string;
  depth: 2 | 3;
};

function stripInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getFenceMarker(line: string) {
  const match = line.match(/^\s*(`{3,}|~{3,})/);

  return match?.[1] ?? null;
}

export function extractTocFromMarkdown(content: string): TocItem[] {
  const items: TocItem[] = [];
  const usedSlugs = new Map<string, number>();
  const lines = content.split(/\r?\n/);
  let activeFence: string | null = null;

  for (const line of lines) {
    const fenceMarker = getFenceMarker(line);

    if (activeFence) {
      const activeFenceCharacter = activeFence.charAt(0);

      if (
        fenceMarker &&
        fenceMarker.startsWith(activeFenceCharacter) &&
        fenceMarker.length >= activeFence.length
      ) {
        activeFence = null;
      }

      continue;
    }

    if (fenceMarker) {
      activeFence = fenceMarker;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);

    if (!headingMatch) {
      continue;
    }

    const [, hashes = '', rawTitle = ''] = headingMatch;
    const depth = hashes.length;
    const title = stripInlineMarkdown(rawTitle);

    if (!title) {
      continue;
    }

    const id = createUniqueHeadingSlug(title, usedSlugs);

    if (depth === 2 || depth === 3) {
      items.push({
        id,
        title,
        depth,
      });
    }
  }

  return items;
}
