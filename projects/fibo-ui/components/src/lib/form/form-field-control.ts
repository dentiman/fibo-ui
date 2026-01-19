import { Component, input, model, computed } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'fibo-form-field-control,button[fiboFormFieldControl]',
  standalone: true,
  imports: [LucideAngularModule],
  host: {
    'class': 'form-field-control flex items-center gap-2',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-required]': 'required() || null',
    '[attr.data-error]': 'hasError() || null',
    '[attr.data-can-clear]': 'canClear() || null',
    '[class.disabled]': 'disabled()',
  },
  template: `
    @if (iconStart()) {
      <lucide-icon [name]="iconStart()" size="16" class="form-field-icon shrink-0"></lucide-icon>
    }
    <div class="flex flex-col justify-center flex-1 min-w-0 gap-0 ">
      @if (label()) {
        <label [for]="id()" class="form-field-label mt-1">{{ label() }}</label>
      }
      <ng-content></ng-content>
    </div>
    @if (canClear()) {
      <lucide-icon name="X" size="16" class="form-field-clear-icon" (click)="clear()"></lucide-icon>
    }
    @if (iconEnd()) {
      <lucide-icon [name]="iconEnd()" size="16" class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>
    }
  `
})
export class FormFieldControl implements FormValueControl<unknown> {
  id = input<string>('');
  value = model<unknown>();

  required = input(false);
  disabled = input(false);
  touched = model(false);
  invalid = input(false);
  dirty = input(false);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  label = input<string>('');
  iconStart = input<string>('');
  iconEnd = input<string>('');

  clearValue = input<unknown>(undefined);

  hasError = computed(() => this.invalid() && this.touched());
  canClear = computed(() => this.clearValue() !== undefined && this.value() !== this.clearValue());

  clear() {
    if (this.disabled()) return;
    this.value.set(this.clearValue());
  }
}
