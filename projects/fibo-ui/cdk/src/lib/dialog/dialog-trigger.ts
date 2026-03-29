import { Directive, ElementRef, computed, inject, input, model, TemplateRef } from '@angular/core';
import { createOverlay } from '../overlay/overlay-stack';
import { globalPosition } from '../overlay/overlay-config';
import { MODAL_SHELL_TOKEN } from '../overlay/overlay-shell-tokens';

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

  private readonly config = computed(() => {
    const templateRef = this.content();
    if (!templateRef) return null;
    return {
      templateRef,
      position: globalPosition(),
      shell: MODAL_SHELL_TOKEN,
      needsBackdrop: true,
      blockScroll: true,
      closeOnOutsideClick: true,
      trapFocus: true,
      restoreFocus: true,
      referenceElement: this.element,
    };
  });

  overlayHandle = createOverlay(this.isOpen, this.config);

  open() {
    if (!this.isOpen()) this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}
