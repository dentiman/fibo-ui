import {Directive, ElementRef, inject, Input, input, model, signal} from '@angular/core';
import {Option} from '../data-list/option.directive';
import {Popover} from './popover';


@Directive({
  selector: '[fiboPopoverTrigger]',
  exportAs: 'PopoverTrigger',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown)': 'onKeydown($event)',
    '(focusout)': 'onFocusOut($event)',
  }
})
export class PopoverTrigger {
  isListItem = !!inject(Option,{optional:true,self:true} );
  element = inject(ElementRef<HTMLElement>).nativeElement;
  isOpen = signal(false);

  //set  when popover is open
  popover = signal<Popover|null>(null)

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

  onKeydown(event: KeyboardEvent): void  {
    if(!this.isListItem) {
      this.popover()?.dataList?.onKeydown(event)
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

    // Don't close if focus is moving within the control element or to the popover
    if (controlElement.contains(relatedTarget) || isMovingToPopover) {
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
