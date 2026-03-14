import {
  Directive, ElementRef, inject,
} from '@angular/core';
import {ClickOutside} from 'ngxtension/click-outside';
import {PopoverPosition} from './popover-position';
import {OVERLAY_REF} from '../portal/overlay-registry';

@Directive({
  selector: '[fiboPopover]',
  exportAs: 'Popover',
  hostDirectives: [
    {
      directive: PopoverPosition,
      inputs: ['placement', 'matchWidth', 'referenceElement', 'offset']
    },
    {
      directive: ClickOutside,
      outputs: ['clickOutside']
    }
  ],

  host: {
    class: 'fibo-popover-container',
    '(keydown.escape)': 'close()',
    '(clickOutside)': 'clickOutsideHandle($event)',
  },
})
export class Popover {

  element = inject(ElementRef);
  private overlayRef = inject(OVERLAY_REF);

  close() {
    this.overlayRef.close();
  }
  clickOutsideHandle(event: Event) {
    const referenceElement = this.overlayRef.referenceElement;
    if (referenceElement && !referenceElement.contains(event.target as Node)) {
      this.overlayRef.close();
    }
  }
}
