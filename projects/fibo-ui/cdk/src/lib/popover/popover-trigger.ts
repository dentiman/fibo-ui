import { Directive, ElementRef, inject, input, model, signal, TemplateRef } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { isFocusInsideHostOrOverlay, restoreOverlayFocus } from '../portal/overlay-focus';
import { OverlayCategory, createOverlay } from '../portal/overlay-registry';

@Directive({
  selector: '[fiboPopoverTrigger]',
  exportAs: 'PopoverTrigger',
  host: {
    '[attr.tabindex]': 'isListItem ? null : (delegatesFocus() ? "-1" : "0")',
    '[attr.aria-expanded]': 'isOpen() || null',
    '(focus)': 'onFocus()',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class PopoverTrigger {
  isListItem = !!inject(DataListItem, { optional: true, self: true });
  element = inject(ElementRef<HTMLElement>).nativeElement;
  isOpen = model(false, { alias: 'open' });


  content = input<TemplateRef<any>>();
  overlayCategory = model<OverlayCategory>('popover');
  delegatesFocus = input(false);

  overlayRef = createOverlay({
    isOpen: this.isOpen,
    content: this.content,
    category: this.overlayCategory,
    referenceElement: this.element,
    context: {},
    onCloseRequest: (ctx, overlay) => restoreOverlayFocus(ctx, overlay),
  });

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    if (!this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  /**
   * Закрывает попап через overlayRef.close(), что запускает:
   * 1. onCloseRequest — восстановление фокуса
   * 2. isOpen.set(false) — автоматически через createOverlay
   * 3. unregister — через effect cleanup
   */
  close() {
    const ref = this.overlayRef();
    if (ref) {
      ref.close();
      return;
    }

    this.isOpen.set(false);
  }

  onFocus() {
    if (this.delegatesFocus()) {
      const focusable = this.element.querySelector(
        'input,textarea,select,button,[tabindex="0"]'
      ) as HTMLElement | null;
      focusable?.focus();
    }
  }

  onFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    if (!relatedTarget) return;

    const portalId = this.overlayRef()?.id;

    if (isFocusInsideHostOrOverlay(relatedTarget, this.element, portalId)) {
      return;
    }

    this.close();
  }
}

@Directive({
  selector: '[fiboPopoverTriggerClick]',
  hostDirectives: [
    {
      directive: PopoverTrigger,
      inputs: ['content', 'overlayCategory', 'delegatesFocus'],
    },
  ],
  host: {
    '(keydown.enter)': 'popoverTrigger.open()',
    '(keydown.escape)': 'popoverTrigger.close()',
    '(click)': 'popoverTrigger.open()',
  },
})
export class PopoverTriggerClick {
  popoverTrigger = inject(PopoverTrigger);
}

@Directive({
  selector: '[fiboPopoverTriggerToggle]',
  hostDirectives: [
    {
      directive: PopoverTrigger,
      inputs: ['content', 'overlayCategory', 'delegatesFocus'],
    },
  ],
  host: {
    '(keydown.enter)': 'popoverTrigger.toggle()',
    '(keydown.escape)': 'popoverTrigger.close()',
    '(click)': 'popoverTrigger.toggle()',
  },
})
export class PopoverTriggerToggle {
  popoverTrigger = inject(PopoverTrigger);
}
