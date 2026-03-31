import { Directive, ElementRef, inject, input, model, signal, TemplateRef } from '@angular/core';
import { createOverlay } from '../overlay/overlay-stack';
import { globalPosition } from '../overlay/overlay-config';
import type { OverlayBehaviorConfig } from '../overlay/overlay-config';
import { DRAWER_SHELL_TOKEN } from '../overlay/overlay-shell-tokens';
import { trapOverlayFocus, restoreTriggerFocusOnClose } from '../overlay/overlay-behaviors';

@Directive({
  selector: '[fiboDrawerTrigger]',
  exportAs: 'DrawerTrigger',
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown.enter)': 'open()',
    '(click)': 'open()',
  },
})
export class DrawerTrigger {
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  isOpen = model(false, { alias: 'open' });
  content = input.required<TemplateRef<unknown>>();

  private readonly behavior: OverlayBehaviorConfig = {
    shell: DRAWER_SHELL_TOKEN,
    needsBackdrop: true,
    blockScroll: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
  };
  private readonly position = signal(globalPosition());

  overlayHandle = createOverlay(this.isOpen, this.behavior, this.position, this.content, session => {
    trapOverlayFocus(session, { guard: true });
    restoreTriggerFocusOnClose(session, () => this.element);
  });

  open() {
    if (!this.isOpen()) this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}
