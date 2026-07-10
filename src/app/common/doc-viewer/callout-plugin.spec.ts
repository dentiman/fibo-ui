import MarkdownIt from 'markdown-it';
import { calloutPlugin } from './callout-plugin';

describe('calloutPlugin', () => {
  let md: MarkdownIt;

  beforeEach(() => {
    md = new MarkdownIt().use(calloutPlugin);
  });

  it('converts a [!NOTE] blockquote into a callout div', () => {
    const html = md.render('> [!NOTE]\n> Something useful.');

    expect(html).toContain('<div class="doc-callout" data-type="note">');
    expect(html).toContain('Something useful.');
    expect(html).not.toContain('<blockquote>');
    expect(html).not.toContain('[!NOTE]');
  });

  it('renders a title row with the type label and an icon', () => {
    const html = md.render('> [!WARNING]\n> Careful.');

    expect(html).toContain('class="doc-callout-title"');
    expect(html).toContain('Warning');
    expect(html).toContain('<svg');
  });

  it('supports all five GitHub alert types', () => {
    for (const type of ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']) {
      const html = md.render(`> [!${type}]\n> Text.`);
      expect(html)
        .withContext(type)
        .toContain(`data-type="${type.toLowerCase()}"`);
    }
  });

  it('leaves regular blockquotes untouched', () => {
    const html = md.render('> Just a quote.');

    expect(html).toContain('<blockquote>');
    expect(html).not.toContain('doc-callout');
  });

  it('does not convert when the marker is followed by text on the same line', () => {
    const html = md.render('> [!NOTE] inline text');

    expect(html).toContain('<blockquote>');
    expect(html).not.toContain('doc-callout');
  });

  it('keeps inline markdown inside the callout body', () => {
    const html = md.render('> [!TIP]\n> Use `createOverlay` for **this**.');

    expect(html).toContain('<code>createOverlay</code>');
    expect(html).toContain('<strong>this</strong>');
  });

  it('preserves multiple paragraphs inside the callout', () => {
    const html = md.render('> [!NOTE]\n> First.\n>\n> Second.');

    expect(html).toContain('First.');
    expect(html).toContain('Second.');
    expect(html).toContain('doc-callout');
  });
});
