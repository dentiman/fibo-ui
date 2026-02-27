import {Directive, ElementRef, inject, signal} from '@angular/core';
import {DataListItem} from '../data-list/data-list-item.directive';
import {Popover} from './popover';

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
  isListItem = !!inject(DataListItem, {optional: true, self: true});
  element = inject(ElementRef<HTMLElement>).nativeElement;
  isOpen = signal(false);

  //set when popover is open
  popover = signal<Popover | null>(null);

  keydownDelegate = signal<KeydownDelegate | null>(null);

  toggle  () {
    if(this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open  () {
    if(!this.isOpen()) {
      this.isOpen.set(true);
    //  console.log('PopoverTrigger open');
    }

  }
  close () {
    if(this.isOpen()) {
      this.isOpen.set(false);
   //   console.log('PopoverTrigger close');
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
  standalone: true,
  hostDirectives: [PopoverTrigger],
  host: {
    '(keydown.enter)': 'popoverTrigger.open()',
    '(keydown.escape)': 'popoverTrigger.close()',
    '(click)': "popoverTrigger.open()"
  }
})
export class PopoverTriggerClick  {
  popoverTrigger = inject(PopoverTrigger);
}

@Directive({
  selector: '[fiboPopoverTriggerToggle]',
  standalone: true,
  hostDirectives: [PopoverTrigger],
  host: {
    '(keydown.escape)': 'popoverTrigger.close()',
    '(click)': "popoverTrigger.toggle()"
  }
})
export class PopoverTriggerToggle  {
  popoverTrigger = inject(PopoverTrigger);
}
