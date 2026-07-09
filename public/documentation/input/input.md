# Input

Text input component with Signal Forms support.

## Basic Usage

:::example input

```html {example="input"}
<fibo-text-field
  [formField]="userForm.username"
  label="Username"
  iconStart="user"
  placeholder="Enter username"
/>

<fibo-text-field
  [formField]="userForm.email"
  label="Email"
  type="email"
  iconStart="mail"
  placeholder="Enter email"
/>

<fibo-text-field
  [formField]="userForm.password"
  label="Password"
  type="password"
  iconStart="lock"
  placeholder="Enter password"
/>
```

```ts {example="input"}
@Component({
  selector: 'input-component-example',
  imports: [FormField, TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class InputComponentExample {
  readonly user = signal({ username: '', email: '', password: '' });
  readonly userForm = form(this.user);
}
```

## API

### Inputs

- `type: input<string>` - input type (default: 'text')
- `label: input<string>` - field label
- `hint: input<string>` - helper text
- `placeholder: input<string>` - placeholder text
- `iconStart: input<string>` - leading Lucide icon
- `iconEnd: input<string>` - trailing Lucide icon
- standard form-state inputs: `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

## Recipe

`TextField` is a small, readable blueprint (~90 lines). Copy it as-is, or use it as a starting point to build your own field.

:::example recipe

```ts {example="recipe" title="text-field.ts"}
import { Component, ElementRef, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { FieldInput, FIELD_UI_STATE_INPUTS, FieldUiState, provideFormValueControl } from '@fibo-ui/cdk';
import { FieldShell } from '../form/field-shell';
import { Size } from '../../primitives/size';

@Component({
  selector: 'fibo-text-field',
  standalone: true,
  hostDirectives: [
    {
      directive: FieldUiState,
      inputs: [...FIELD_UI_STATE_INPUTS],
    },
    { directive: Size, inputs: ['fiboSize'] },
  ],
  imports: [FieldShell, FieldInput],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => TextField)],
  templateUrl: './text-field.html',
})
export class TextField implements FormValueControl<string> {
  readonly uiState = inject(FieldUiState);
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
```

```html {example="recipe" title="text-field.html"}
<fibo-field-shell
  [label]="label()"
  [hint]="hint()"
  [iconStart]="iconStart()"
  [iconEnd]="iconEnd()"
  [canClear]="value() !== ''"
  (clearRequested)="clear()"
>
  <input
    fiboFieldInput
    class="fibo-field-input"
    #inputElement
    [type]="type()"
    [value]="value()"
    [placeholder]="placeholder()"
    [disabled]="uiState.disabled()"
    [readOnly]="uiState.readonly()"
    [required]="uiState.required()"
    [attr.name]="uiState.name() || null"
    [attr.aria-required]="uiState.required() || null"
    [attr.min]="uiState.min() ?? null"
    [attr.max]="uiState.max() ?? null"
    [attr.minlength]="uiState.minLength() ?? null"
    [attr.maxlength]="uiState.maxLength() ?? null"
    [attr.data-invalid]="(uiState.invalid() && uiState.touched()) || null"
    (input)="onInput($event)"
    (blur)="onBlur()"
  />
</fibo-field-shell>
```
