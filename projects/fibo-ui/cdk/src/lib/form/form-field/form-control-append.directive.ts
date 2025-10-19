import {Directive, TemplateRef, inject} from '@angular/core';

@Directive({
  selector: 'ng-template[fiboFormControlAppend]'
})
export class FormControlAppendDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef as any);
}


