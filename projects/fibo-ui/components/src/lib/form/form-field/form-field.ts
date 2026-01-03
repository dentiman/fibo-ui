import {Component, computed, contentChild, contentChildren, ElementRef, forwardRef, inject, input, model, ViewEncapsulation} from '@angular/core';
import { IsEmptyPipe} from '@fibo-ui/cdk';
import {PopoverTrigger} from '@fibo-ui/cdk';
import { NgTemplateOutlet} from '@angular/common';
import {
  FiboInput,
} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';
import {FormValueControl, ValidationError, WithOptionalField} from '@angular/forms/signals';

export type FormFieldAppearance = 'basic' | 'secondary' | 'clear';

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
  value = model<unknown>()
  required = input(false)
  disabled = input(false)
  touched = input(false)
  invalid = input(false)
  dirty = input(false)
  errors = input<readonly WithOptionalField<ValidationError>[]>([])

  appearance = input<FormFieldAppearance>('basic');
  clearTo = input<unknown>()

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
    const clearTo = this.clearTo();
    if (clearTo === undefined) return;
    this.value.set(clearTo as any);
  }


}
