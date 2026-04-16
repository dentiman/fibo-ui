import { Directive } from '@angular/core';
import { Appearance } from '../primitives/appearance';
import { Size } from '../primitives/size';

@Directive({
  selector: '[fiboButton]',
  standalone: true,
  hostDirectives: [
    { directive: Appearance, inputs: ['fiboAppearance'] },
    { directive: Size, inputs: ['fiboSize'] },
  ],
  host: {
    class: 'fibo-btn',
  },
})
export class Button {}
