import { Component, ElementRef, inject, input, model, signal, computed, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { FieldAuxiliary, FieldInput, FIELD_UI_STATE_INPUTS, FieldUiState, provideFormValueControl } from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { FieldShell } from '../form/field-shell';
import { Size } from '../../primitives/size';

@Component({
  selector: 'fibo-password-field',
  standalone: true,
  hostDirectives: [
    {
      directive: FieldUiState,
      inputs: [...FIELD_UI_STATE_INPUTS],
    },
    { directive: Size, inputs: ['fiboSize'] },
  ],
  imports: [FieldShell, FieldInput, FieldAuxiliary, LucideAngularModule],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => PasswordField)],
  template: `
    <fibo-field-shell
      [label]="label()"
      [hint]="hint()"
      [iconStart]="iconStart()"
      [canClear]="value() !== ''"
      (clearRequested)="clear()"
    >
      <input
        fiboFieldInput
        class="fibo-field-input"
        #inputElement
        [type]="inputType()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="uiState.disabled()"
        [readOnly]="uiState.readonly()"
        [required]="uiState.required()"
        [attr.name]="uiState.name() || null"
        [attr.aria-required]="uiState.required() || null"
        [attr.minlength]="uiState.minLength() ?? null"
        [attr.maxlength]="uiState.maxLength() ?? null"
        [attr.data-invalid]="(uiState.invalid() && uiState.touched()) || null"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />

      <button
        fiboFieldEnd
        fiboFieldAuxiliary
        type="button"
        class="fibo-field-toggle"
        [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
        [disabled]="uiState.disabled()"
        (pointerdown)="$event.preventDefault()"
        (click)="toggleVisibility()"
      >
        <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'" size="16"></lucide-icon>
      </button>
    </fibo-field-shell>
  `,
})
export class PasswordField implements FormValueControl<string> {
  readonly uiState = inject(FieldUiState);
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  readonly value = model<string>('');
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly placeholder = input<string>('');
  readonly iconStart = input<string>('');

  readonly showPassword = signal(false);
  readonly inputType = computed(() => (this.showPassword() ? 'text' : 'password'));

  toggleVisibility() {
    if (this.uiState.disabled()) return;
    this.showPassword.update(v => !v);
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur() {
    this.uiState.touched.set(true);
  }

  focus(options?: FocusOptions) {
    this.inputElement().nativeElement.focus(options);
  }

  clear() {
    if (this.uiState.disabled()) return;
    this.value.set('');
    this.uiState.touched.set(true);
  }
}
