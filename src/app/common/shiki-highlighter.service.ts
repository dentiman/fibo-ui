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
import {
  headingAnchorPlugin,
  TocEntry,
} from './doc-viewer/heading-anchor-plugin';

export type DocRenderResult = {
  html: SafeHtml;
  examples: Map<string, { lang: string; code: string; highlighted: string }[]>;
  toc: TocEntry[];
};

@Injectable()
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

  private md = this.withBaseHrefImages(MarkdownItAsync().use(this.shikiPlugin));

  private mdDoc = this.withBaseHrefImages(
    MarkdownItAsync()
      .use(this.shikiPlugin)
      .use(extractExamplesPlugin)
      .use(headingAnchorPlugin)
  );

  /**
   * Resolves a doc/asset URL against the app's <base href> so fetching works
   * both locally (base "/") and when served from a sub-path such as GitHub
   * Pages ("/fibo-ui/"). Root-relative URLs ("/documentation/...") would
   * otherwise ignore the base href and 404 on a sub-path deployment.
   */
  private resolveAssetUrl(url: string | undefined): string | undefined {
    if (!url) return url;
    return new URL(url.replace(/^\//, ''), document.baseURI).toString();
  }

  /**
   * Image srcs inside rendered markdown are resolved by the browser, not by
   * httpResource, so they need the same base-href normalization as the doc
   * fetch itself — otherwise "/documentation/x.png" 404s on a sub-path deploy.
   */
  private withBaseHrefImages<T extends ReturnType<typeof MarkdownItAsync>>(
    md: T
  ): T {
    const defaultRender =
      md.renderer.rules.image ??
      ((tokens, idx, options, _env, self) =>
        self.renderToken(tokens, idx, options));

    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const src = tokens[idx].attrGet('src');
      if (src) {
        tokens[idx].attrSet('src', this.resolveAssetUrl(src)!);
      }
      return defaultRender(tokens, idx, options, env, self);
    };

    return md;
  }

  createMarkdownResource(url: Signal<string | undefined>) {
    const content = httpResource.text(() => this.resolveAssetUrl(url()));

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
    const content = httpResource.text(() => this.resolveAssetUrl(url()));

    return resource({
      params: content.value,
      loader: async ({ params }) => {
        if (!params) return null;
        const env: { examples?: Map<string, ExtractedBlock[]>; toc?: TocEntry[] } = {};
        const html = await this.mdDoc.renderAsync(params as string, env);

        const examples = new Map<
          string,
          { lang: string; code: string; highlighted: string; title?: string }[]
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
                  title: block.title,
                };
              })
            );
            examples.set(name, highlighted);
          }
        }

        return {
          html: this.sanitizer.bypassSecurityTrustHtml(html),
          examples,
          toc: env.toc ?? [],
        };
      },
    });
  }
}
