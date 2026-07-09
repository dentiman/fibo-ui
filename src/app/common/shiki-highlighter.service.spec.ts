import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShikiHighlighterService } from './shiki-highlighter.service';

type RendersMarkdown = {
  mdDoc: { renderAsync(src: string): Promise<string> };
  md: { renderAsync(src: string): Promise<string> };
};

describe('ShikiHighlighterService', () => {
  let service: ShikiHighlighterService;
  let internals: RendersMarkdown;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ShikiHighlighterService],
    });
    service = TestBed.inject(ShikiHighlighterService);
    internals = service as unknown as RendersMarkdown;
  });

  it('rewrites root-relative image srcs against the base href', async () => {
    const html = await internals.mdDoc.renderAsync(
      '![diagram](/documentation/getting-started/select-composition.png)'
    );

    const expected = new URL(
      'documentation/getting-started/select-composition.png',
      document.baseURI
    ).toString();
    expect(html).toContain(`src="${expected}"`);
  });

  it('rewrites image srcs in the plain markdown renderer too', async () => {
    const html = await internals.md.renderAsync('![x](/documentation/a.png)');

    const expected = new URL('documentation/a.png', document.baseURI).toString();
    expect(html).toContain(`src="${expected}"`);
  });

  it('leaves absolute external image srcs untouched', async () => {
    const html = await internals.mdDoc.renderAsync(
      '![x](https://example.com/a.png)'
    );

    expect(html).toContain('src="https://example.com/a.png"');
  });
});
