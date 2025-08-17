import {Directive, ElementRef, inject, Input, input, model, signal} from '@angular/core';
import {AbstractControl, FormControl, NgControl} from '@angular/forms';
import {OverlayTrigger} from '@fibo-ui/components';


@Directive({
  selector: '[fiboFormFieldOverlayTrigger]',
  exportAs: 'FormFieldOverlayTrigger',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown.enter)': 'open()',
    '(keydown.escape)': 'close()',
    '(click)':"open()"
  }
})
export class FormFieldOverlayTrigger extends OverlayTrigger {

  @Input({ required: true, alias: 'fiboFormFieldOverlayTrigger' }) control!: NgControl|null;

  override open  () {
    if(!this.control?.disabled) {
      this.isOpen.set(true);
    }
  }

}
