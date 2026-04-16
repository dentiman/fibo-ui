import { Directive, input } from '@angular/core';

/**
 * Primitive directive that sets a `data-appearance` attribute on the host element.
 * Use as a `hostDirective` in components that support visual appearance variants
 * (e.g. Button: "solid" | "outline" | "ghost").
 *
 * CSS reacts to the attribute:
 * ```css
 * :host([data-appearance="outline"]) { ... }
 * ```
 */
@Directive({
  selector: '[fiboAppearance]',
  standalone: true,
  host: {
    '[attr.data-appearance]': 'fiboAppearance() || null',
  },
})
export class Appearance {
  readonly fiboAppearance = input<string | null>(null);
}

