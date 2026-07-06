import readingTime from 'reading-time';

export type ReadingTime = {
  text: string;
  minutes: number;
  time: number;
  words: number;
};

const CODE_BLOCK_PATTERN = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;
const INLINE_CODE_PATTERN = /`([^`]+)`/g;
const IMAGE_PATTERN = /!\[([^\]]*)\]\([^)]+\)/g;
const LINK_PATTERN = /\[([^\]]+)\]\([^)]+\)/g;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const SETEXT_HEADING_UNDERLINE_PATTERN = /^[=-]{2,}\s*$/gm;
const TABLE_ALIGNMENT_PATTERN = /\|?[\s:-]+\|[\s|:-]*/g;
const MARKDOWN_SYMBOL_PATTERN = /[#>*_~|()[\]!-]+/g;
const WHITESPACE_PATTERN = /\s+/g;

function stripMarkdown(content: string) {
  return content
    .replace(CODE_BLOCK_PATTERN, ' ')
    .replace(INLINE_CODE_PATTERN, '$1')
    .replace(IMAGE_PATTERN, '$1')
    .replace(LINK_PATTERN, '$1')
    .replace(HTML_TAG_PATTERN, ' ')
    .replace(SETEXT_HEADING_UNDERLINE_PATTERN, ' ')
    .replace(TABLE_ALIGNMENT_PATTERN, ' ')
    .replace(MARKDOWN_SYMBOL_PATTERN, ' ')
    .replace(WHITESPACE_PATTERN, ' ')
    .trim();
}

export function calculateReadingTime(content: string, wordsPerMinute = 200): ReadingTime {
  const plainText = stripMarkdown(content);
  const stats = readingTime(plainText, { wordsPerMinute });
  const minutes = Math.max(1, Math.ceil(stats.minutes));

  return {
    text: stats.text,
    minutes,
    time: stats.time,
    words: stats.words,
  };
}
