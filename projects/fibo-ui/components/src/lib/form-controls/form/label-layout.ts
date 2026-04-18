import { Directive, input } from '@angular/core';

@Directive({
  selector: '[labelLayout]',
  standalone: true,
  host: {
    '[attr.data-label-layout]': 'labelLayout() || null',
  },
})
export class LabelLayout {
  readonly labelLayout = input<'stacked' | 'inline' | null>(null);
}
