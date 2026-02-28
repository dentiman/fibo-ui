import { Directive, ElementRef, effect, inject, input, signal, TemplateRef } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { Popover } from './popover';
import { PortalRegistry } from '../portal/portal-registry';

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
  }
})
export class PopoverTrigger {
  isListItem = !!inject(DataListItem, { optional: true, self: true });
  element = inject(ElementRef<HTMLElement>).nativeElement;
  isOpen = signal(false);

  contentTemplate = input<TemplateRef<any>>();

  //set when popover is open
  popover = signal<Popover | null>(null);

  keydownDelegate = signal<KeydownDelegate | null>(null);

  private portalRegistry = inject(PortalRegistry);
  private portalId = 'portal-' + Math.random().toString(36).substring(2, 10);

  constructor() {
    effect(onCleanup => {
      const template = this.contentTemplate();
      if (this.isOpen() && template) {
        this.portalRegistry.register(this.portalId, template, { $implicit: this });
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
    const controlElement = this.element;

    if (!relatedTarget) {
      return;
    }

    // Check if focus is moving to the popover container (rendered in portal outlet)
    const popoverElement = this.popover()?.element.nativeElement;
    const isMovingToPopover = popoverElement?.contains(relatedTarget);
    const relatedElement =
      relatedTarget instanceof Element ? relatedTarget : relatedTarget.parentElement;
    const isMovingToAnyPopover = !!relatedElement?.closest('.fibo-popover-container');

    // Don't close if focus is moving within the control element or to the popover
    if (controlElement.contains(relatedTarget) || isMovingToPopover || isMovingToAnyPopover) {
      return;
    }

    this.popover()?.close();
  }
}

@Directive({
  selector: '[fiboPopoverTriggerClick]',
  hostDirectives: [{
    directive: PopoverTrigger,
    inputs: ['contentTemplate'],
  }],
  host: {
    '(keydown.enter)': 'popoverTrigger.open()',
    '(keydown.escape)': 'popoverTrigger.close()',
    '(click)': "popoverTrigger.open()"
  }
})
export class PopoverTriggerClick {
  popoverTrigger = inject(PopoverTrigger);
}

@Directive({
  selector: '[fiboPopoverTriggerToggle]',
  hostDirectives: [{
    directive: PopoverTrigger,
    inputs: ['contentTemplate'],
  }],
  host: {
    '(keydown.escape)': 'popoverTrigger.close()',
    '(click)': "popoverTrigger.toggle()"
  }
})
export class PopoverTriggerToggle {
  popoverTrigger = inject(PopoverTrigger);
}
