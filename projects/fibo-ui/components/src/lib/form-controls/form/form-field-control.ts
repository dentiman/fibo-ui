import { Component, ElementRef, inject, input, model, computed } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
import { provideFormValueControl } from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'fibo-form-field-control',
  standalone: true,
  imports: [LucideAngularModule],
  host: {
    class: 'block',
    '(click)': 'focusInput($event)',
  },
  providers: [provideFormValueControl(() => FormFieldControl)],
  template: `
    <div
      class="form-field-control"
      [attr.aria-disabled]="disabled() || null"
      [attr.aria-required]="required() || null"
      [attr.data-error]="hasError() || null"
      [attr.data-can-clear]="canClear() || null"
      [class.disabled]="disabled()"
    >
      @if (iconStart()) {
        <lucide-icon [name]="iconStart()" size="16" class="form-field-icon shrink-0"></lucide-icon>
      }
      <div class="form-field-body">
        @if (label()) {
          <label [for]="id()" class="form-field-label">{{ label() }}</label>
        }
        <div class="form-field-content">
          <ng-content></ng-content>
        </div>
      </div>
      @if (canClear()) {
        <lucide-icon
          name="X"
          size="16"
          class="form-field-clear-icon"
          (click)="clear()"
        ></lucide-icon>
      }
      @if (iconEnd()) {
        <lucide-icon
          [name]="iconEnd()"
          size="16"
          class="form-field-icon form-field-icon-end shrink-0"
        ></lucide-icon>
      }
    </div>
  `,
})
export class FormFieldControl implements FormValueControl<unknown> {
  private element = inject(ElementRef<HTMLElement>).nativeElement;

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

  focusInput(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('input,textarea,select')) return;
    const focusable = this.element.querySelector('input,textarea,select') as HTMLElement | null;
    focusable?.focus();
  }

  clear() {
    if (this.disabled()) return;
    this.value.set(this.clearValue());
  }
}
