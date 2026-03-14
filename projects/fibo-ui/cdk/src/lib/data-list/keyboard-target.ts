import { Directive, signal } from '@angular/core';
import { KeydownDelegate } from './keyboard-source';

export interface KeyboardTargetHandler extends KeydownDelegate {}

@Directive({
  selector: '[fiboKeyboardTarget]',
  exportAs: 'KeyboardTarget',
  host: {
    '(keydown)': 'forwardKeydown($event)',
  },
})
export class KeyboardTarget {
  private readonly handler = signal<KeyboardTargetHandler | null>(null);

  connect(handler: KeyboardTargetHandler): () => void {
    this.handler.set(handler);
    return () => {
      if (this.handler() === handler) {
        this.handler.set(null);
      }
    };
  }

  forwardKeydown(event: KeyboardEvent): void {
    this.handler()?.onKeydown(event);
  }

  navigateNext(event: Event): void {
    this.handler()?.navigateNext?.(event);
  }
}
