import {inject, Injectable, resource, Signal} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import MarkdownItAsync from 'markdown-it-async';
import {fromAsyncCodeToHtml} from '@shikijs/markdown-it/async';
import {codeToHtml} from 'shiki';
import {httpResource} from '@angular/common/http';
import {ThemeService} from './theme.service';


@Injectable({providedIn: 'root'})

export class ShikiHighlighterService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeService = inject(ThemeService);

  private md = MarkdownItAsync().use(
    fromAsyncCodeToHtml(
      codeToHtml,
      {
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        defaultColor: 'light-dark()',
      }
    )
  );

  createMarkdownResource(url: Signal<string|undefined>) {
    const content = httpResource.text(() =>url());

    return resource({
      params:  content.value,
      loader: async ({params, abortSignal}) => {
        if (!params) return null;
        const html = await this.md.renderAsync(params);
        return this.sanitizer.bypassSecurityTrustHtml(html);
      },
    });
  }

}


