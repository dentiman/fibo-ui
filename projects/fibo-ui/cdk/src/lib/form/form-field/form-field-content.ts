import {Directive, ElementRef, inject} from '@angular/core';

@Directive({ 
  selector: '[fiboInput]',
  host: {
    class: 'fibo-input'
  }
})
export class FiboInput {
  element = inject(ElementRef)
}
