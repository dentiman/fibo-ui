import { Directive, input } from '@angular/core';

export type LabelLayoutValue = 'stacked' | 'inline' | null;

@Directive({
  selector: '[labelLayout]',
  standalone: true,
  host: {
    '[attr.data-label-layout]': 'labelLayout() || null',
  },
})
export class LabelLayout {
  readonly labelLayout = input<LabelLayoutValue>(null);
}
