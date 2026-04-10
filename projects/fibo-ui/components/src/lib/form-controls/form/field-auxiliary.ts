import { Directive } from '@angular/core';

@Directive({
  selector: '[fiboFieldAuxiliary]',
  standalone: true,
  host: {
    'data-field-auxiliary': 'true',
  },
})
export class FieldAuxiliaryDirective {}
