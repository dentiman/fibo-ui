import {Directive, input, TemplateRef, inject} from '@angular/core';

@Directive({
  selector: 'ng-template[fiboColumnHeader]',
})
export class FiboColumnHeader {
  // Column key to associate this header with
  fiboColumnHeader = input.required<string>();
  templateRef = inject<TemplateRef<unknown>>(TemplateRef)
}


