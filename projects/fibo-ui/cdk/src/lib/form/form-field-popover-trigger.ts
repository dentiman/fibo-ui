import {Directive, ElementRef, inject, Input, input, model, signal} from '@angular/core';
import {AbstractControl, FormControl, NgControl} from '@angular/forms';
import {PopoverTrigger} from '../popover/popover-trigger';


@Directive({
  selector: '[fiboFormFieldPopoverTrigger]',
  exportAs: 'FormFieldPopoverTrigger',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown.enter)': 'open()',
    '(keydown.escape)': 'close()',
    '(click)':"open()"
  }
})
export class FormFieldPopoverTrigger extends PopoverTrigger {

  @Input({ required: true, alias: 'fiboFormFieldPopoverTrigger' }) control!: NgControl|null;

  override open  () {
    if(!this.control?.disabled) {
      this.isOpen.set(true);
    }
  }

}
