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
    FirstFormErrorPipe,
    LucideAngularModule,
  ],
  templateUrl: './form-field.html',
  styles: `

  `,
  host: {
    '[tabindex]': 'control().cva.disabled()?"-1":"0"',
     class: 'fibo-form-field group flex items-center space-x-1 text-left px-3 py-2 min-h-10 cursor-default rounded-md',
    '[class.min-h-14]': '!!control().label()',
    '[style.pointer-events]': 'cva()?.disabled() ? "none" : "auto"',
    '[attr.aria-disabled]': 'cva()?.disabled()',
    '[attr.data-error]': 'cva()?.hasError() || null',
    '[attr.aria-required]': 'cva()?.isRequired() || null',
    '(click)': 'handleClick()',
    '(focusout)': 'onFocusOut($event)',

  }
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
