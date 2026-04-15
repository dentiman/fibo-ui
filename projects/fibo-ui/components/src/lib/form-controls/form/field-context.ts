import { Directive, input } from '@angular/core';

export const FIELD_CONTEXT_INPUTS = ['density', 'labelLayout'] as const;

@Directive({
  selector: '[fiboFieldContext]',
  standalone: true,
  host: {
    '[attr.data-density]': 'density() || null',
    '[attr.data-label-layout]': 'labelLayout() || null',
  },
})
export class FieldContext {
  readonly density = input<'default' | 'compact' | null>(null);
  readonly labelLayout = input<'stacked' | 'inline' | null>(null);
}
