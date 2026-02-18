import { inject, Injectable, resource, Signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import MarkdownItAsync from 'markdown-it-async';
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async';
import { codeToHtml } from 'shiki';
import { httpResource } from '@angular/common/http';
import { ThemeService } from './theme.service';
import {
  extractExamplesPlugin,
  ExtractedBlock,
} from './doc-viewer/extract-examples-plugin';

export type DocRenderResult = {
  html: SafeHtml;
  examples: Map<string, { lang: string; code: string; highlighted: string }[]>;
};

@Injectable({ providedIn: 'root' })
export class ShikiHighlighterService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeService = inject(ThemeService);

  private readonly shikiPlugin = fromAsyncCodeToHtml(codeToHtml, {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: 'light-dark()',
  });

  private md = MarkdownItAsync().use(this.shikiPlugin);

  private mdDoc = MarkdownItAsync().use(this.shikiPlugin).use(extractExamplesPlugin);

  createMarkdownResource(url: Signal<string | undefined>) {
    const content = httpResource.text(() => url());

    return resource({
      params: content.value,
      loader: async ({ params }) => {
        if (!params) return null;
        const html = await this.md.renderAsync(params);
        return this.sanitizer.bypassSecurityTrustHtml(html);
      },
    });
  }

  createDocResource(url: Signal<string | undefined>) {
    const content = httpResource.text(() => url());

    return resource({
      params: content.value,
      loader: async ({ params }) => {
        if (!params) return null;
        const env: { examples?: Map<string, ExtractedBlock[]> } = {};
        const html = await this.mdDoc.renderAsync(params as string, env);

        const examples = new Map<
          string,
          { lang: string; code: string; highlighted: string }[]
        >();

        if (env.examples) {
          for (const [name, blocks] of env.examples) {
            const highlighted = await Promise.all(
              blocks.map(async block => {
                const h = await codeToHtml(block.code, {
                  lang: block.lang,
                  themes: { light: 'github-light', dark: 'github-dark' },
                  defaultColor: 'light-dark()',
                });
                return {
                  lang: block.lang,
                  code: block.code,
                  highlighted: h,
                };
              })
            );
            examples.set(name, highlighted);
          }
        }

        return {
          html: this.sanitizer.bypassSecurityTrustHtml(html),
          examples,
        };
      },
    });
  }
}
