# Select

Single-value selector with Signal Forms support.

## Basic Usage

:::example select

```html {example="select"}
<fibo-select
  [formField]="registrationForm.role"
  label="User Role"
  placeholder="Select role"
  [items]="roles"
/>
```

```ts {example="select"}
@Component({
  selector: 'select-component-example',
  imports: [Select, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class SelectComponentExample {
  readonly roles: SelectItem[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Guest', value: 'guest' },
  ];

  readonly user = signal({ role: null as string | null });
  readonly registrationForm = form(this.user);
}
```

## API

### Inputs

- `items: input<SelectItem[]>` - available options
- `label: input<string>` - field label
- `placeholder: input<string>` - placeholder text
- `clearValue: input<string | number | null | undefined>` - value to clear selection
- standard form-state inputs: `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

### Types

```ts
export interface SelectItem {
  label: string;
  value: string | number | null;
}
```

## Recipe

`Select` is a compact blueprint that only composes CDK primitives — `DataList`, `SelectOne`, and the field overlay. Copy it as-is, or recompose those same primitives into your own selector.

:::example recipe

```ts {example="recipe" title="select.ts"}
import { Component, ElementRef, computed, inject, input, model, viewChild } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  FieldInteractive,
  FieldOverlay,
  FIELD_UI_STATE_INPUTS,
  FieldUiState,
  SelectOne,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { FieldShell } from '../form/field-shell';
import { Size } from '../../primitives/size';

export interface SelectItem {
  label: string;
  value: string | number | null;
  disabled?: boolean;
}

@Component({
  selector: 'fibo-select',
  hostDirectives: [
    {
      directive: FieldUiState,
      inputs: [...FIELD_UI_STATE_INPUTS],
    },
    { directive: Size, inputs: ['fiboSize'] },
  ],
  imports: [
    FieldShell,
    FieldInteractive,
    FieldOverlay,
    DataList,
    SelectOne,
    DataListItem,
  ],
  host: {
    class: 'block',
  },
  providers: [provideFormValueControl(() => Select)],
  templateUrl: './select.html',
})
export class Select implements FormValueControl<string | number | null> {
  readonly uiState = inject(FieldUiState);
  private readonly triggerButton = viewChild.required<ElementRef<HTMLButtonElement>>('triggerButton');

  readonly value = model<string | number | null>(null);

  readonly items = input<SelectItem[]>([]);
  readonly label = input('');
  readonly hint = input('');
  readonly placeholder = input('Select');
  readonly iconStart = input('');
  readonly clearValue = input<string | number | null | undefined>(undefined);

  readonly selectedItem = computed(() => {
    const currentValue = this.value();
    return this.items().find(item => item.value === currentValue) ?? null;
  });

  readonly selectedLabel = computed(() => this.selectedItem()?.label ?? null);
  readonly canClear = computed(() => this.clearValue() !== undefined && this.value() !== this.clearValue());

  focus(options?: FocusOptions) {
    this.triggerButton().nativeElement.focus(options);
  }

  clear() {
    const clearValue = this.clearValue();

    if (this.uiState.disabled() || clearValue === undefined) {
      return;
    }

    this.value.set(clearValue);
    this.uiState.touched.set(true);
  }
}
```

```html {example="recipe" title="select.html"}
<fibo-field-shell
  [label]="label()"
  [hint]="hint()"
  [iconStart]="iconStart()"
  iconEnd="chevron-down"
  [canClear]="canClear()"
  (clearRequested)="clear()"
>
  <button
    fiboFieldInteractive
    class="fibo-field-button"
    [fiboFieldOverlay]="selectTpl"
    [matchWidth]="true"
    #triggerButton
    type="button"
    role="combobox"
    [disabled]="uiState.disabled()"
    aria-haspopup="listbox"
    (blur)="uiState.touched.set(true)"
  >
    <div
      class="min-w-0 overflow-hidden whitespace-nowrap text-sm"
      [class.fibo-field-placeholder]="!selectedLabel()"
    >
      {{ selectedLabel() || placeholder() }}
    </div>
  </button>
</fibo-field-shell>

<ng-template #selectTpl let-overlay>
  <div
    role="listbox"
    [attr.id]="overlay.id"
    [keyboardSourceElement]="triggerButton"
    fiboDataList
    (itemTriggered)="overlay.close()"
    fiboSelectOne
    [(value)]="value"
  >
    @for (item of items(); track item.value) {
      <button
        type="button"
        fiboDataListItem
        role="option"
        [value]="item.value"
        [attr.aria-selected]="value() === item.value"
        class="datalist-item w-full text-left"
      >
        {{ item.label }}
      </button>
    }
  </div>
</ng-template>
```
