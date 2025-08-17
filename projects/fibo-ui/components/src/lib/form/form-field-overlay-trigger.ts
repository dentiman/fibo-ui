import {Directive, ElementRef, inject, Input, input, model, signal} from '@angular/core';
import {AbstractControl, FormControl, NgControl} from '@angular/forms';
import {OverlayTrigger} from '@spacy-ui/components';


@Directive({
  selector: '[suiFormFieldOverlayTrigger]',
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

  @Input({ required: true, alias: 'suiFormFieldOverlayTrigger' }) control!: NgControl|null;

  override open  () {
    if(!this.control?.disabled) {
      this.isOpen.set(true);
    }
  }

}
