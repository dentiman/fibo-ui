import {computed, Directive, ElementRef, inject, input} from '@angular/core';

@Directive({ 
  selector: '[fiboFormFieldContent]',
  host: {
    class: 'fibo-input'
  }
})
export class FormFieldContent {
  element = inject(ElementRef)
}
