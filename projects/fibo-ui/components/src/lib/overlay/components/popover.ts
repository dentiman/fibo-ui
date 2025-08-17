import {
  Directive, ElementRef, inject,
  input, OnDestroy, OnInit,
} from '@angular/core';
import {ClickOutside} from 'ngxtension/click-outside';
import {OverlayPosition} from '../overlay-position';
import {OverlayTrigger} from '../overlay-trigger';
import {DataList} from '../../data-list/data-list';

@Directive({
  selector: '[suiPopover]',
  standalone: true,
  hostDirectives: [
    {
      directive:  OverlayPosition,
      inputs: ['placement', 'fullOverlayWidth','overlayTrigger','referenceElement','offset']
    },
    {
      directive:  ClickOutside,
      outputs: ['clickOutside']
    }
  ],

  host: {
    class: 'spacy-popover',
    '(clickOutside)': 'clickOutsideHandle($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class Popover implements OnInit, OnDestroy {

  element = inject(ElementRef);
  dataList = inject(DataList,{self:true,optional:true});
  overlayTrigger = input.required<OverlayTrigger>()

  close() {
    this.overlayTrigger().close();
  }
  clickOutsideHandle( event: Event ) {
    if(!this.overlayTrigger().element.contains(event.target as Node)) {
      this.overlayTrigger().close();
    }
  }
  onFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    if(!relatedTarget) return;
    if (this.overlayTrigger().element.contains(relatedTarget) || this.element.nativeElement.contains(relatedTarget)) {
      return

    }
    this.overlayTrigger().close();
  }
  ngOnInit(): void {
     this.overlayTrigger().popover.set(this);
  }
  ngOnDestroy(): void {
    this.overlayTrigger().popover.set(null);
  }

}
