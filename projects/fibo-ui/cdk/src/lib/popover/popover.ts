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
      inputs: ['placement', 'popoverFullWidth','popoverTrigger','referenceElement','offset']
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
  dataList = inject(DataList,{self:true,optional:true});
  popoverTrigger = input.required<PopoverTrigger>()

  close() {
    this.popoverTrigger().close();
  }
  clickOutsideHandle( event: Event ) {
    if(!this.popoverTrigger().element.contains(event.target as Node)) {
      this.popoverTrigger().close();
    }
  }
  onFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    if(!relatedTarget) return;
    if (this.popoverTrigger().element.contains(relatedTarget) || this.element.nativeElement.contains(relatedTarget)) {
      return

    }
    this.popoverTrigger().close();
  }
  ngOnInit(): void {
     this.popoverTrigger().popover.set(this);
  }
  ngOnDestroy(): void {
    this.popoverTrigger().popover.set(null);
  }

}
