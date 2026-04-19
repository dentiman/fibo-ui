import { Directive, input } from '@angular/core';

export type FormLayoutValue = 'vertical' | 'horizontal';

@Directive({
  selector: '[formLayout]',
  standalone: true,
})
export class FormLayout {
  readonly formLayout = input<FormLayoutValue | null>(null);
}
