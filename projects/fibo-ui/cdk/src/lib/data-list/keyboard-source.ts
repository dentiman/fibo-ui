import { Directive, signal } from '@angular/core';

export interface KeydownDelegate {
  onKeydown(event: KeyboardEvent): void;
  navigateNext?(event: Event): void;
}

@Directive({
  selector: '[fiboKeyboardSource]',
  exportAs: 'KeyboardSource',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class KeyboardSource {
  readonly delegate = signal<KeydownDelegate | null>(null);

  onKeydown(event: KeyboardEvent): void {
    this.delegate()?.onKeydown(event);
  }
}
