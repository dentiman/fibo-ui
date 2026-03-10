import { Directive, ElementRef, effect, inject, input, model, signal, TemplateRef } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { OverlayCategory, OverlayRegistry } from '../portal/overlay-registry';

export interface KeydownDelegate {
  onKeydown(e: KeyboardEvent): void;
  navigateNext?(e: Event): void;
}

@Directive({
  selector: '[fiboPopoverTrigger]',
  exportAs: 'PopoverTrigger',
  host: {
    '[attr.tabindex]': 'isListItem ? null : (delegatesFocus() ? "-1" : "0")',
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown)': 'onKeydown($event)',
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

  keydownDelegate = signal<KeydownDelegate | null>(null);

  private portalRegistry = inject(OverlayRegistry);
  private portalId = 'portal-' + Math.random().toString(36).substring(2, 10);

  constructor() {
    effect(onCleanup => {
      const template = this.content();
      if (this.isOpen() && template) {
        this.portalRegistry.register(
          this.portalId,
          template,
          { $implicit: this },
          this.overlayCategory(),
          () => this.close(),
          this.element
        );
        onCleanup(() => this.portalRegistry.unregister(this.portalId));
      }
    });
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (!this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  close() {
    if (this.isOpen()) {
      const activeEl = document.activeElement as HTMLElement | null;
      const shouldRestoreFocus =
        !activeEl ||
        activeEl === document.body ||
        !!activeEl.closest(`[data-portal-id="${this.portalId}"]`);

      this.isOpen.set(false);

      if (shouldRestoreFocus) {
        this.element.focus();
      }
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

  onKeydown(event: KeyboardEvent): void {
    if (!this.isListItem) {
      this.keydownDelegate()?.onKeydown(event);
    }
  }

  onFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    if (!relatedTarget) return;

    const relatedElement =
      relatedTarget instanceof Element ? relatedTarget : relatedTarget.parentElement;
    const isMovingToOwnPortal = !!relatedElement?.closest(
      `[data-portal-id="${this.portalId}"]`
    );

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
