import { Directive, ElementRef, computed, inject, input, model, TemplateRef } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import {
  closeOnFocusLeave,
  closeOnOutsideClick,
  restoreTriggerFocusOnClose,
} from '../overlay/overlay-behaviors';
import { createOverlay } from '../overlay/overlay-stack';
import { connectedOverlay, menuOverlay } from '../overlay/overlay-strategy';
import type { Placement } from '@floating-ui/dom';

@Directive({
  selector: '[fiboPopoverTrigger]',
  exportAs: 'PopoverTrigger',
  host: {
    '[attr.tabindex]': 'isListItem ? null : (delegatesFocus() ? "-1" : "0")',
    '[attr.aria-expanded]': 'isOpen() || null',
    '(focus)': 'onFocus()',
  },
})
export class PopoverTrigger {
  isListItem = !!inject(DataListItem, { optional: true, self: true });
  element = inject(ElementRef<HTMLElement>).nativeElement;
  isOpen = model(false, { alias: 'open' });

  content = input<TemplateRef<any>>();
  strategyKind = model<'connected' | 'menu'>('connected');
  placement = model<Placement>('bottom');
  offset = model<number>(5);
  matchWidth = model(false);
  delegatesFocus = input(false);

  strategy = computed(() => {
    const templateRef = this.content();
    if (!templateRef) {
      return null;
    }

    const isMenu = this.strategyKind() === 'menu';
    const placement = isMenu && this.placement() === 'bottom' ? 'right-start' : this.placement();
    const offset = isMenu && this.offset() === 5 ? 1 : this.offset();

    return isMenu
      ? menuOverlay({
          templateRef,
          referenceElement: this.element,
          placement,
          offset,
        })
      : connectedOverlay({
          templateRef,
          referenceElement: this.element,
          placement: this.placement(),
          offset: this.offset(),
          matchWidth: this.matchWidth(),
        });
  });

  overlayHandle = createOverlay(
    this.isOpen,
    this.strategy,
    overlay => {
      closeOnFocusLeave(overlay);
      closeOnOutsideClick(overlay);
      restoreTriggerFocusOnClose(overlay);
    },
  );

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    if (!this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  close() {
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
}

@Directive({
  selector: '[fiboPopoverTriggerClick]',
  hostDirectives: [
    {
      directive: PopoverTrigger,
      inputs: ['content', 'strategyKind', 'placement', 'offset', 'matchWidth', 'delegatesFocus'],
    },
  ],
  host: {
    '(keydown.enter)': 'popoverTrigger.open()',
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
      inputs: ['content', 'strategyKind', 'placement', 'offset', 'matchWidth', 'delegatesFocus'],
    },
  ],
  host: {
    '(keydown.enter)': 'popoverTrigger.toggle()',
    '(click)': 'popoverTrigger.toggle()',
  },
})
export class PopoverTriggerToggle {
  popoverTrigger = inject(PopoverTrigger);
}
