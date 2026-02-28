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
    '[attr.tabindex]': 'isListItem ? null : "0"',
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown)': 'onKeydown($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class PopoverTrigger {
  isListItem = !!inject(DataListItem, { optional: true, self: true });
  element = inject(ElementRef<HTMLElement>).nativeElement;
  isOpen = signal(false);

  content = input<TemplateRef<any>>();
  overlayCategory = model<OverlayCategory>('popover');

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
      this.isOpen.set(false);
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
    const isMovingToPortal = !!relatedElement?.closest('fibo-overlay-outlet');

    if (this.element.contains(relatedTarget) || isMovingToPortal) {
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
      inputs: ['content', 'overlayCategory'],
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
      inputs: ['content', 'overlayCategory'],
    },
  ],
  host: {
    '(keydown.escape)': 'popoverTrigger.close()',
    '(click)': 'popoverTrigger.toggle()',
  },
})
export class PopoverTriggerToggle {
  popoverTrigger = inject(PopoverTrigger);
}
