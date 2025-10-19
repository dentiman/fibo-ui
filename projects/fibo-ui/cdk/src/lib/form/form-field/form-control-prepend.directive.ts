import {Directive, TemplateRef, inject} from '@angular/core';

@Directive({
  selector: 'ng-template[fiboFormControlPrepend]'
})
export class FormControlPrependDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef as any);
}


