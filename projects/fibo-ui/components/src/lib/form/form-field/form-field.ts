import {Component, computed, contentChildren, inject, input, ViewEncapsulation} from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  host: {
    '(click)': 'handleClick()',
    '(focusout)': 'onFocusOut($event)',
    '[attr.aria-disabled]': 'cva()?.disabled()',
    '[attr.aria-required]': 'cva()?.isRequired() || null',
    '[attr.data-appearance]': 'control().appearance()',
    '[attr.data-error]': 'cva()?.hasError() || null',
    '[style.pointer-events]': "cva()?.disabled() ? 'none' : 'auto'",
    '[tabindex]': "control().cva.disabled()?'-1':'0'",
    '[class]': "'content-center   fibo-form-field' + (control().controlClass() ? ' ' + control().controlClass() : '')",
    '[class.min-h-14]': "!!control().label()",
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
    
    if (!relatedTarget) {
      this.control()?.cva.onTouched();
      return;
    }

    // Check if focus is moving to the popover container (rendered in portal outlet)
    const popoverElement = this.popover?.popover()?.element.nativeElement;
    const isMovingToPopover = popoverElement?.contains(relatedTarget);
    
    // Don't close if focus is moving within the control element or to the popover
    if (controlElement.contains(relatedTarget) || isMovingToPopover) {
      return;
    }

    this.popover?.close();
    this.control()?.cva.onTouched();
  }

}
