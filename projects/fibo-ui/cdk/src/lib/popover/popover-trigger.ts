import { Directive, ElementRef, computed, inject, input, model, TemplateRef } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import {
  closeOnFocusLeave,
  closeOnOutsideClick,
  restoreTriggerFocusOnClose,
} from '../overlay/overlay-behaviors';
import { OverlayCategory } from '../overlay/overlay-handle';
import { createOverlay } from '../overlay/overlay-stack';

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
  overlayCategory = model<OverlayCategory>('popover');
  delegatesFocus = input(false);

  config = computed(() => ({
    templateRef: this.content(),
    referenceElement: this.element,
    category: this.overlayCategory(),
  }));

  overlayHandle = createOverlay(
    this.isOpen,
    this.config,
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
