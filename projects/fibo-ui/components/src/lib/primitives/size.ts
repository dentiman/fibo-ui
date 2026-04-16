import { Directive, input } from '@angular/core';

/**
 * Primitive directive that sets a `data-size` attribute on the host element.
 * Use as a `hostDirective` in components that support size variants.
 *
 * CSS reacts to the attribute:
 * ```css
 * :host([data-size="sm"]) { --component-height: 28px; }
 * :host([data-size="lg"]) { --component-height: 48px; }
 * ```
 */
@Directive({
  selector: '[fiboSize]',
  standalone: true,
  host: {
    '[attr.data-size]': 'fiboSize() || null',
  },
})
export class Size {
  readonly fiboSize = input<'sm' | 'md' | 'lg' | null>(null);
}

