import {
  Directive, inject,
} from '@angular/core';
import {PopoverPosition} from './popover-position';
import {OVERLAY_REF} from '../portal/overlay-registry';

@Directive({
  selector: '[fiboPopover]',
  exportAs: 'Popover',
  hostDirectives: [
    {
      directive: PopoverPosition,
      inputs: ['placement', 'matchWidth', 'referenceElement', 'offset']
    }
  ],

  host: {
    class: 'fibo-popover-container',
    '(keydown.escape)': 'close()',
  },
})
export class Popover {
  private overlayRef = inject(OVERLAY_REF);

  close() {
    this.overlayRef.close();
  }
}
