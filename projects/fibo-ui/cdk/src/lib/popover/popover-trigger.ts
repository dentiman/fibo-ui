import { Directive, ElementRef, inject, input, model, signal, TemplateRef } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { OverlayCategory, OverlayCloseContext, createOverlay } from '../portal/overlay-registry';

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
  isOpen = signal(false);

  content = input<TemplateRef<any>>();
  overlayCategory = model<OverlayCategory>('popover');
  delegatesFocus = input(false);

  overlayRef = createOverlay({
    isOpen: this.isOpen,
    content: this.content,
    category: this.overlayCategory,
    referenceElement: this.element,
    context: {},
    onCloseRequest: ctx => this.restoreFocus(ctx),
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
      ref.close({ reason: 'programmatic' });
    }
  }

  /**
   * Восстанавливает фокус на триггер-элемент (a11y).
   * Фокус возвращается, только если он находится «нигде» (body) или
   * внутри закрываемого портала. Если пользователь уже кликнул за
   * пределами портала — фокус остаётся на новом элементе.
   */
  private restoreFocus(ctx: OverlayCloseContext) {
    const portalId = this.overlayRef()?.id;
    const shouldRestore =
      !ctx.activeElement ||
      ctx.activeElement === document.body ||
      (portalId && !!ctx.activeElement.closest(`[data-portal-id="${portalId}"]`));

    if (shouldRestore) {
      this.element.focus();
    }
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

    const relatedElement =
      relatedTarget instanceof Element ? relatedTarget : relatedTarget.parentElement;
    const portalId = this.overlayRef()?.id;
    const isMovingToOwnPortal =
      portalId && !!relatedElement?.closest(`[data-portal-id="${portalId}"]`);

    if (this.element.contains(relatedTarget) || isMovingToOwnPortal) {
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
