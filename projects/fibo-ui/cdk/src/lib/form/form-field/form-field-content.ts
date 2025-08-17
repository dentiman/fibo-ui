import {computed, Directive, ElementRef, inject, input} from '@angular/core';

@Directive({ selector: '[fiboFormFieldContent]' })
export class FormFieldContent {
  element = inject(ElementRef)
}
