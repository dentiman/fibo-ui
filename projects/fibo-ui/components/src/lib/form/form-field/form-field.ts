import {Component, computed, contentChildren, inject, input} from '@angular/core';
import {IsEmptyPipe, OverlayTrigger} from '@fibo-ui/components';
import {NgTemplateOutlet} from '@angular/common';
import {FormFieldDirective} from './form-field-directive';
import {FormFieldContent} from './form-field-content';
import {FirstFormErrorPipe} from '../form-error/form-error-pipes';
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
  host: {
    '[tabindex]': 'control().cva.disabled()?"-1":"0"',
    class: `
     px-3 flex items-center space-x-1 group py-2
     min-h-10 cursor-default rounded-md bg-white text-left text-gray-900 sm:text-sm sm:leading-6

  disabled:bg-gray-200  aria-disabled:bg-gray-200 data-error:outline-red-300

  outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-1 focus-within:-outline-offset-1 focus-within:outline-primary-600 aria-disabled:focus-within:bg-gray-200
     `,
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
  control = input.required<FormFieldDirective<T>>()
  prependIcon = input<string>()
  appendIcon = input<string>()
  cva = computed(() => this.control()?.cva)
  inputs = contentChildren<FormFieldContent>(FormFieldContent)
  overlay = inject(OverlayTrigger, {optional: true, self: true})
  showErrors = true;

  handleClick() {
    if (this.control().cva.disabled()) return;
    setTimeout(() => {
      if (this.inputs().length) {
        this.inputs()[0].element.nativeElement.focus();
      } else if (this.control()?.inputs().length) {
        this.control()?.inputs()[0].element.nativeElement.focus();
      }
    }, 0);
  }

  onFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    const controlElement = this.control().element.nativeElement;
    if (!relatedTarget || !controlElement.contains(relatedTarget)) {

      this.overlay?.close();
      this.control()?.cva.onTouched()
    }
  }

}
