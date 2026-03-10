import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

export type TocEntry = { id: string; text: string; level: number };

/**
 * markdown-it plugin that adds `id` attributes to h2/h3 headings
 * and collects TOC entries into `env.toc`.
 */
export function headingAnchorPlugin(md: MarkdownIt): void {
  md.core.ruler.push('heading_anchors', state => {
    const toc: TocEntry[] = [];
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type !== 'heading_open') continue;

      const level = parseInt(token.tag.slice(1), 10);
      if (level < 2 || level > 3) continue;

      const inline = tokens[i + 1];
      if (!inline || inline.type !== 'inline') continue;

      const text = extractText(inline.children ?? []);
      const id = slugify(text);

      token.attrSet('id', id);
      toc.push({ id, text, level });
    }

    (state.env as { toc?: TocEntry[] }).toc = toc;
  });
}

function extractText(tokens: Token[]): string {
  return tokens
    .filter(t => t.type === 'text' || t.type === 'code_inline')
    .map(t => t.content)
    .join('');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
