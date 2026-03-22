import { Directive } from '@angular/core';

@Directive({
  selector: '[fiboFieldAction]',
  standalone: true,
  host: {
    'data-field-action': 'true',
  },
})
export class FieldActionDirective {}
