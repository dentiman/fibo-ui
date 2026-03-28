import { Directive, ElementRef, computed, inject, input, model, TemplateRef } from '@angular/core';
import { restoreTriggerFocusOnClose, trapOverlayFocus } from '../overlay/overlay-behaviors';
import { createOverlay } from '../overlay/overlay-stack';
import { modalOverlay } from '../overlay/overlay-strategy';

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

  private readonly strategy = computed(() => {
    const templateRef = this.content();
    if (!templateRef) {
      return null;
    }

    return modalOverlay({
      templateRef,
      referenceElement: this.element,
    });
  });

  overlayHandle = createOverlay(this.isOpen, this.strategy, overlay => {
    restoreTriggerFocusOnClose(overlay);
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
