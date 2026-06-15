import enDictionary from '@/locales/en.json';
import viDictionary from '@/locales/vi.json';

export const locales = ['vi', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

const dictionaries = {
  vi: viDictionary,
  en: enDictionary,
} satisfies Record<Locale, typeof viDictionary>;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function getTagCountLabel(
  dictionary: Dictionary,
  count: number,
  tagLabel: string,
) {
  return formatMessage(
    count === 1 ? dictionary.tagsPage.countLabelOne : dictionary.tagsPage.countLabelOther,
    {
      count,
      tagLabel,
    },
  );
}

function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function stripLocaleFromPathname(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '/';
  }

  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    const strippedPathname = `/${segments.slice(1).join('/')}`;
    return strippedPathname === '/' ? '/' : strippedPathname.replace(/\/+$/, '') || '/';
  }

  return normalizedPathname.replace(/\/+$/, '') || '/';
}

export function getLocalizedPath(locale: Locale, pathname: string = '/') {
  const strippedPathname = stripLocaleFromPathname(pathname);

  if (strippedPathname === '/') {
    return `/${locale}`;
  }

  return `/${locale}${strippedPathname}`;
}
