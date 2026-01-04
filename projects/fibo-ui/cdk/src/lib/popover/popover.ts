import {
  Directive, ElementRef, inject,
  input, OnDestroy, OnInit,
} from '@angular/core';
import {ClickOutside} from 'ngxtension/click-outside';
import {PopoverPosition} from './popover-position';
import {PopoverTrigger} from './popover-trigger';
import {DataList} from '../data-list/data-list';

@Directive({
  selector: '[fiboPopover]',
  standalone: true,
  hostDirectives: [
    {
      directive:  PopoverPosition,
      inputs: ['placement', 'matchWidth','popoverTrigger','referenceElement','offset']
    },
    {
      directive:  ClickOutside,
      outputs: ['clickOutside']
    }
  ],

  host: {
     class: 'fibo-popover-container',
    '(clickOutside)': 'clickOutsideHandle($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class Popover implements OnInit, OnDestroy {

  element = inject(ElementRef);
  // call by trigger for navigate
  dataList = inject(DataList,{self:true,optional:true});
  trigger = input.required<PopoverTrigger>()

  close() {
    this.trigger().close();
  }
  clickOutsideHandle( event: Event ) {
    if(!this.trigger().element.contains(event.target as Node)) {
      this.trigger().close();
    }
  }
  onFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    if(!relatedTarget) return;
    if (this.trigger().element.contains(relatedTarget) || this.element.nativeElement.contains(relatedTarget)) {
      return

    }
    this.trigger().close();
  }
  ngOnInit(): void {
     this.trigger().popover.set(this);
  }
  ngOnDestroy(): void {
    this.trigger().popover.set(null);
  }

}
