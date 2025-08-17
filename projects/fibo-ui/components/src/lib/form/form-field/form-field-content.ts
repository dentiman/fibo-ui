import {computed, Directive, ElementRef, inject, input} from '@angular/core';
import {PrimitiveValueAccessor} from '@fibo-ui/components';

@Directive({ selector: '[fiboFormFieldContent]' })
export class FormFieldContent {
  element = inject(ElementRef)
}

