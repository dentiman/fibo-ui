import {Directive, ElementRef, inject, Input, input, model, signal} from '@angular/core';
import {ListItem} from '../data-list/list-item';
import {Popover} from './popover';


@Directive({
  selector: '[fiboPopoverTrigger]',
  exportAs: 'PopoverTrigger',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown)': 'onKeydown($event)',
  }
})
export class PopoverTrigger {
  isListItem = !!inject(ListItem,{optional:true,self:true} );
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
