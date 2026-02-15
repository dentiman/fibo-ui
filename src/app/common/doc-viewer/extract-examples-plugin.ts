import type MarkdownIt from 'markdown-it';

export type ExtractedBlock = { lang: string; code: string };
export type ExtractedExamples = Map<string, ExtractedBlock[]>;

/**
 * markdown-it plugin that extracts code blocks annotated with {example="name"}.
 * Extracted blocks are stored in env.examples Map and removed from rendered output.
 */
export function extractExamplesPlugin(md: MarkdownIt): void {
  const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info.trim();
    const match = info.match(/^(\w+)\s*\{example="([^"]+)"\}/);

    if (!match) {
      return defaultFence(tokens, idx, options, env, self);
    }

    const [, lang, name] = match;
    const examples: ExtractedExamples = (env.examples ??= new Map());

    if (!examples.has(name)) {
      examples.set(name, []);
    }
    examples.get(name)!.push({ lang, code: token.content });

    return '';
  };
}
