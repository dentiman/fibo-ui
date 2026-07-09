# Field Shell

The presentational frame shared by every field component — label, hint, icons, a clear button, and content slots. It carries no value or validation of its own: controls like `Input`, `Select`, and `Datepicker` project their actual control into it.

## Basic Usage

An empty shell renders just the chrome. Project a control into the default slot to build a real field.

:::example field-shell

```html {example="field-shell"}
<fibo-field-shell label="Label" hint="Helper text below the field" />

<fibo-field-shell
  label="With icons"
  hint="Leading and trailing icons"
  iconStart="user"
  iconEnd="check"
/>

<fibo-field-shell
  label="Clearable"
  hint="Shows the clear button"
  iconStart="search"
  [canClear]="true"
/>
```

```ts {example="field-shell"}
@Component({
  selector: 'field-shell-example',
  imports: [FieldShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class FieldShellExample {}
```

## API

### Inputs

- `label: input<string>` - field label
- `hint: input<string>` - helper text shown below the field (hidden while an error is displayed)
- `iconStart: input<string>` - leading Lucide icon
- `iconEnd: input<string>` - trailing Lucide icon
- `canClear: input<boolean>` - show the clear button (default: `false`)

### Outputs

- `clearRequested: output<void>` - emitted when the clear button is pressed

### Content projection

- default slot - the field control (an `input`, `button`, etc.)
- `[fiboFieldEnd]` - trailing content rendered before the end icon

Field Shell also reads an optional `FieldUiState` (to surface the active error message) and an optional `FormLayout` (to switch to an external, horizontal label layout) from DI when they are present.

## Recipe

`FieldShell` is a pure presentational blueprint — no value, no validation, just the frame every field shares. Copy it as-is, or rebuild your own frame around the same slots.

:::example recipe

```ts {example="recipe" title="field-shell.ts"}
import { Component, computed, inject, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FieldAuxiliary, FieldContainer, FieldLabel, FieldShellHost, FieldUiState } from '@fibo-ui/cdk';
import { FormLayout } from './form-layout';

@Component({
  selector: 'fibo-field-shell',
  standalone: true,
  hostDirectives: [FieldShellHost],
  imports: [LucideAngularModule, FieldAuxiliary, FieldLabel, FieldContainer],
  host: {
    class: 'fibo-field-shell',
    '[attr.data-layout]': 'externalLayout()',
  },
  templateUrl: './field-shell.html',
})
export class FieldShell {
  private readonly host = inject(FieldShellHost);
  private readonly formUiState = inject(FieldUiState, { optional: true });
  private readonly formLayout = inject(FormLayout, { optional: true });

  readonly label = input('');
  readonly hint = input('');
  readonly iconStart = input('');
  readonly iconEnd = input('');
  readonly canClear = input(false);

  readonly clearRequested = output<void>();

  readonly externalLayout = computed(() => this.formLayout?.formLayout() ?? null);

  readonly errorMessage = computed(() => this.formUiState?.errorMessage() ?? null);

  idFor(suffix: string): string {
    return this.host.idFor(suffix);
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clearRequested.emit();
  }
}
```

```html {example="recipe" title="field-shell.html"}
@if (externalLayout()) {
  <label [id]="idFor('label')" class="fibo-field-shell-label">{{ label() }}</label>
}

<div fiboFieldContainer
  class="fibo-field-container"
  [attr.data-has-clear]="canClear() || null"
  [attr.aria-labelledby]="externalLayout() ? idFor('label') : null"
>
  @if (iconStart()) {
    <lucide-icon [name]="iconStart()" size="16" class="fibo-field-icon shrink-0"></lucide-icon>
  }

  <div class="fibo-field-body">
    @if (!externalLayout() && label()) {
      <label fiboFieldLabel class="fibo-field-label">{{ label() }}</label>
    }

    <div class="fibo-field-content">
      <ng-content></ng-content>
    </div>
  </div>

  @if (canClear()) {
    <button
      type="button"
      fiboFieldAuxiliary
      aria-label="Clear value"
      class="fibo-field-clear"
      (pointerdown)="$event.preventDefault()"
      (click)="onClear($event)"
    >
      <lucide-icon name="X" size="16"></lucide-icon>
    </button>
  }

  <ng-content select="[fiboFieldEnd]"></ng-content>

  @if (iconEnd()) {
    <lucide-icon
      [name]="iconEnd()"
      size="16"
      class="fibo-field-icon fibo-field-icon-end shrink-0"
    ></lucide-icon>
  }
</div>

@if (errorMessage(); as error) {
  <div [id]="idFor('error')" class="fibo-field-error">{{ error }}</div>
} @else if (hint()) {
  <div [id]="idFor('hint')" class="fibo-field-hint">{{ hint() }}</div>
}
```

```ts {example="recipe" title="form-layout.ts"}
import { Directive, input } from '@angular/core';

export type FormLayoutValue = 'vertical' | 'horizontal';

@Directive({
  selector: '[formLayout]',
  standalone: true,
})
export class FormLayout {
  readonly formLayout = input<FormLayoutValue | null>(null);
}
```
