import type MarkdownIt from 'markdown-it';

export type ExtractedBlock = { lang: string; code: string; title?: string };
export type ExtractedExamples = Map<string, ExtractedBlock[]>;
const EXAMPLE_DIRECTIVE_RE = /^:::example\s+([A-Za-z0-9_-]+)\s*$/;

/**
 * markdown-it plugin that extracts code blocks annotated with {example="name"}.
 * Extracted blocks are stored in env.examples Map and removed from rendered output.
 */
export function extractExamplesPlugin(md: MarkdownIt): void {
  md.block.ruler.before(
    'paragraph',
    'docs_example',
    (state, startLine, _endLine, silent) => {
      const pos = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];
      const line = state.src.slice(pos, max).trim();
      const match = line.match(EXAMPLE_DIRECTIVE_RE);

      if (!match) return false;
      if (silent) return true;

      const token = state.push('docs_example', 'docs-example', 0);
      token.meta = { name: match[1] };
      token.block = true;
      token.map = [startLine, startLine + 1];
      state.line = startLine + 1;
      return true;
    }
  );

  md.renderer.rules['docs_example'] = (tokens, idx) => {
    const name = (tokens[idx].meta as { name?: string } | undefined)?.name;
    if (!name) return '';
    return `<docs-example name="${md.utils.escapeHtml(name)}"></docs-example>`;
  };

  const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info.trim();
    const match = info.match(/^(\w+)\s*\{([^}]+)\}/);

    if (!match) {
      return defaultFence(tokens, idx, options, env, self);
    }

    const [, lang, attrs] = match;
    const exampleMatch = attrs.match(/example="([^"]+)"/);
    if (!exampleMatch) {
      return defaultFence(tokens, idx, options, env, self);
    }

    const name = exampleMatch[1];
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const title = titleMatch?.[1];

    const examples: ExtractedExamples = (env.examples ??= new Map());

    if (!examples.has(name)) {
      examples.set(name, []);
    }
    examples.get(name)!.push({ lang, code: token.content, title });

    return '';
  };
}
