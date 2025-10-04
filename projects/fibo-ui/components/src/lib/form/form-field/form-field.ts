import {Component, computed, contentChildren, inject, input} from '@angular/core';
import {IsEmptyPipe} from '@fibo-ui/cdk';
import {PopoverTrigger} from '@fibo-ui/cdk';
import {NgTemplateOutlet} from '@angular/common';
import {FormFieldControl, FirstFormErrorPipe} from '@fibo-ui/cdk';
import {FormFieldContent} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';


@Component({
  selector: 'fibo-form-field',
  imports: [
    IsEmptyPipe,
    NgTemplateOutlet,
    LucideAngularModule,
  ],
  templateUrl: './form-field.html',
  host: {
    '(click)': 'handleClick()',
    '(focusout)': 'onFocusOut($event)',
    '[attr.aria-disabled]': 'cva()?.disabled()',
    '[attr.aria-required]': 'cva()?.isRequired() || null',
    '[attr.data-appearance]': 'control().appearance()',
    '[attr.data-error]': 'cva()?.hasError() || null',
    '[style.pointer-events]': "cva()?.disabled() ? 'none' : 'auto'",
    '[tabindex]': "control().cva.disabled()?'-1':'0'",
    'class': `  cursor-default  relative block fibo-form-field`,
  },
})

export class FormField<T> {
  control = input.required<FormFieldControl<T>>()
  prependIcon = input<string>()
  appendIcon = input<string>()
  cva = computed(() => this.control()?.cva)
  inputs = contentChildren<FormFieldContent>(FormFieldContent)
  popover = inject(PopoverTrigger, {optional: true, self: true})
  showErrors = true;

  handleClick() {
    if (this.control().cva.disabled()) return;
    setTimeout(() => {
      if (this.inputs().length) {
        this.inputs()[0].element.nativeElement.focus();
      } else if (this.control()?.inputs().length) {
        // @ts-ignore
        this.control()?.inputs()[0].element.nativeElement.focus();
      }
    }, 0);
  }

  onFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    const controlElement = this.control().element.nativeElement;
    if (!relatedTarget || !controlElement.contains(relatedTarget)) {

      this.popover?.close();
      this.control()?.cva.onTouched()
    }
  }

}
