const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g;
const IMPORT_EXPORT_PATTERN = /^\s*(?:import|export)\s.+$/gm;
const INLINE_CODE_PATTERN = /`([^`]+)`/g;
const MDX_COMPONENT_PATTERN = /<\/?[A-Z][^>\n]*\/?>/g;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const LINK_PATTERN = /!?\[([^\]]*)\]\(([^)]+)\)/g;
const MARKDOWN_SYMBOL_PATTERN = /[#>*_~|()[\]!-]+/g;
const WHITESPACE_PATTERN = /\s+/g;
const MAX_CONTENT_LENGTH = 10_000;

export function stripMdxContent(content: string): string {
  return content
    .replace(CODE_BLOCK_PATTERN, ' ')
    .replace(IMPORT_EXPORT_PATTERN, ' ')
    .replace(INLINE_CODE_PATTERN, '$1')
    .replace(MDX_COMPONENT_PATTERN, ' ')
    .replace(HTML_TAG_PATTERN, ' ')
    .replace(LINK_PATTERN, '$1 $2')
    .replace(MARKDOWN_SYMBOL_PATTERN, ' ')
    .replace(WHITESPACE_PATTERN, ' ')
    .trim()
    .slice(0, MAX_CONTENT_LENGTH);
}
