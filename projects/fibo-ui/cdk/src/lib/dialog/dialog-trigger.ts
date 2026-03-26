import { Directive, ElementRef, computed, inject, input, model, TemplateRef } from '@angular/core';
import {
  blockScroll,
  closeOnBackdropClick,
  restoreTriggerFocusOnClose,
  trapOverlayFocus,
} from '../overlay/overlay-behaviors';
import { createOverlay } from '../overlay/overlay-stack';

@Directive({
  selector: '[fiboDialogTrigger]',
  exportAs: 'DialogTrigger',
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown.enter)': 'open()',
    '(click)': 'open()',
  },
})
export class DialogTrigger {
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  isOpen = model(false, { alias: 'open' });
  content = input<TemplateRef<any>>();

  private readonly config = computed(() => ({
    templateRef: this.content(),
    referenceElement: this.element,
    category: 'dialog' as const,
  }));

  overlayHandle = createOverlay(this.isOpen, this.config, overlay => {
    closeOnBackdropClick(overlay);
    restoreTriggerFocusOnClose(overlay);
    blockScroll(overlay);
    trapOverlayFocus(overlay);
  });

  open() {
    if (!this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  close() {
    this.isOpen.set(false);
  }
}
