import {computed, Directive, input, model, Self} from '@angular/core';

@Directive({
  selector: '[fiboRandomId]',
  exportAs: 'RandomId',
  standalone: true,
  host: {
    '[attr.id]': 'id',
  }
})
export class RandomId {
  id = 'id-' + Math.random().toString(36).substring(2, 10);
}
