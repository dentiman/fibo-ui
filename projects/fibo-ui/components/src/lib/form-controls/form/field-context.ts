import { Directive, input } from '@angular/core';

export const FIELD_CONTEXT_INPUTS = ['labelLayout'] as const;

@Directive({
  selector: '[fiboFieldContext]',
  standalone: true,
  host: {
    '[attr.data-label-layout]': 'labelLayout() || null',
  },
})
export class FieldContext {
  readonly labelLayout = input<'stacked' | 'inline' | null>(null);
}
