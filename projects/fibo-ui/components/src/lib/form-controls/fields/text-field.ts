import { Component, ElementRef, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { provideFormValueControl } from '@fibo-ui/cdk';
import { FieldShell } from '../form/field-shell';
import { FieldInteractiveDirective } from '../form/field-interactive';
import { FORM_UI_STATE_INPUTS, FormUiState } from '../form/form-ui-state';

@Component({
  selector: 'fibo-text-field',
  standalone: true,
  hostDirectives: [
    {
      directive: FormUiState,
      inputs: [...FORM_UI_STATE_INPUTS],
    },
  ],
  imports: [FieldShell, FieldInteractiveDirective],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => TextField)],
  template: `
    <fibo-field-shell
      [label]="label()"
      [hint]="hint()"
      [iconStart]="iconStart()"
      [iconEnd]="iconEnd()"
      [canClear]="value() !== ''"
      (clearRequested)="clear()"
    >
      <input
        fiboFieldInteractive
        #inputElement
        [type]="type()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="uiState.disabled()"
        [readOnly]="uiState.readonly()"
        [required]="uiState.required()"
        [attr.name]="uiState.name() || null"
        [attr.aria-required]="uiState.required() || null"
        [attr.aria-invalid]="uiState.invalid() || null"
        [attr.min]="uiState.min() ?? null"
        [attr.max]="uiState.max() ?? null"
        [attr.minlength]="uiState.minLength() ?? null"
        [attr.maxlength]="uiState.maxLength() ?? null"
        [attr.data-error]="(uiState.invalid() && uiState.touched()) || null"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="text-field-input"
      />
    </fibo-field-shell>
  `,
})
export class TextField implements FormValueControl<string> {
  readonly uiState = inject(FormUiState);
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  readonly value = model<string>('');
  readonly type = input<string>('text');
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly placeholder = input<string>('');
  readonly iconStart = input<string>('');
  readonly iconEnd = input<string>('');

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
    if (this.uiState.disabled()) {
      return;
    }

    this.value.set('');
    this.uiState.touched.set(true);
  }
}
