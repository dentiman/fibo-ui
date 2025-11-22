import {Component, computed, contentChild, contentChildren, ElementRef, forwardRef, inject, input, model, ViewEncapsulation} from '@angular/core';
import {FormErrorPipe, IsEmptyPipe} from '@fibo-ui/cdk';
import {PopoverTrigger} from '@fibo-ui/cdk';
import {JsonPipe, NgTemplateOutlet} from '@angular/common';
import {
  FormFieldAppearance,
  FiboInput,
  FormControlAppendDirective,
  FormControlPrependDirective,
  PrimitiveValueAccessor
} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';
import {FormValueControl, ValidationError, WithOptionalField} from '@angular/forms/signals';
import {FieldLabel} from './field-label';


@Component({
  selector: 'fibo-form-field',
  imports: [
    IsEmptyPipe,
    NgTemplateOutlet,
    LucideAngularModule,
  ],
  templateUrl: './form-field.html',
  encapsulation: ViewEncapsulation.None,
  viewProviders: [{ provide: FormField, useExisting: forwardRef(() => FormField) }],
  host: {
    '(click)': 'handleClick()',
    '(focusout)': 'onFocusOut($event)',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-required]': 'required() || null',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-error]': 'hasErrors() || null',
    '[style.pointer-events]': "disabled() ? 'none' : 'auto'",
    '[tabindex]': "disabled() ? '-1' : '0'",
    'class': "group content-center fibo-form-field",
  },
})

export class FormField implements FormValueControl<any> {
  value = model()
  required = input(false)
  disabled = input(false)
  touched = input(false)
  invalid = input(false)
  dirty = input(false)
  errors = input<readonly WithOptionalField<ValidationError>[]>([])

  appearance = input<FormFieldAppearance>('basic');

  // Computed and injected properties
  hasErrors = computed(() => this.errors().length > 0 &&  this.touched());

  element = inject(ElementRef);
  inputs = contentChildren<FiboInput>(FiboInput);

  prependIcon = input<string>()
  appendIcon = input<string>()
  popover = inject(PopoverTrigger, {optional: true, self: true})

  handleClick() {
    if (this.disabled()) return;
    setTimeout(() => {
      if (this.inputs().length) {
        this.inputs()[0].element.nativeElement.focus();
      }
    }, 0);
    this.popover?.open()
  }

  reset(event: Event) {
    event.preventDefault();
    this.value.set(null);
  }

  onFocusOut(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Node;
    const controlElement = this.element.nativeElement;

    if (!relatedTarget) {
      this.touched();
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
    this.touched();
  }

}
