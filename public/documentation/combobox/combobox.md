# Combobox

Editable combobox with restricted selection.

The form value changes only after the user explicitly selects an option from the popup. If the input loses focus without a selection, the typed text is reset.

## Basic Usage

:::example combobox

```html {example="combobox"}
<fibo-combobox
  [formField]="userForm.assignee"
  label="Assignee"
  placeholder="Search assignee"
  [items]="assignees"
/>
```

```ts {example="combobox"}
@Component({
  selector: 'combobox-component-example',
  imports: [Combobox, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class ComboboxComponentExample {
  readonly assignees = [
    'Ada Lovelace',
    'Alan Turing',
    'Barbara Liskov',
    'Grace Hopper',
    'Linus Torvalds',
    'Margaret Hamilton',
  ];

  readonly user = signal({ assignee: null as string | null });
  readonly userForm = form(this.user);
}
```

## Behavior

- The input text is local draft state and is not written to the form value while the user types.
- Only explicit option selection commits a new value.
- Blur restores the last selected option label, or clears the input if nothing is selected.
- Custom values are not allowed in this variant.

## API

### Inputs

- `items: input<ComboboxItem[]>` - available options
- `label: input<string>` - field label
- `placeholder: input<string>` - placeholder text
- `iconStart: input<string>` - start icon name
- `clearValue: input<string | number | null | undefined>` - value to clear selection
- standard form-state inputs: `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

### Types

```ts
export interface ComboboxItem {
  label: string;
  value: string | number | null;
}
```

## Recipe

`Combobox` composes CDK primitives (`DataList`, `SelectOne`, overlay) and keeps its editable-input behavior in a few focused directives and DI tokens. Copy the whole set as-is, or recompose these blocks into your own combobox.

:::example recipe

```ts {example="recipe" title="combobox.ts"}
import {
  Component,
  ElementRef,
  TemplateRef,
  computed,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  DataList,
  DataListItem,
  FieldInput,
  FieldShellHost,
  FIELD_UI_STATE_INPUTS,
  FieldUiState,
  SelectOne,
  createOverlay,
  provideFormValueControl,
} from '@fibo-ui/cdk';
import { type ComboboxControl, provideComboboxControl } from './combobox-control-token';
import { ComboboxInput } from './combobox-input';
import { ComboboxList } from './combobox-list';
import { FieldShell } from '../form/field-shell';
import { Size } from '../../primitives/size';

@Component({
  selector: 'fibo-combobox',
  hostDirectives: [
    {
      directive: FieldUiState,
      inputs: [...FIELD_UI_STATE_INPUTS],
    },
    { directive: Size, inputs: ['fiboSize'] },
  ],
  imports: [
    FieldShell,
    FieldInput,
    DataList,
    DataListItem,
    SelectOne,
    ComboboxInput,
    ComboboxList,
  ],
  host: {
    class: 'block',
  },
  providers: [
    provideFormValueControl(() => Combobox),
    provideComboboxControl(() => Combobox),
  ],
  templateUrl: './combobox.html',
})
export class Combobox
  implements
    ComboboxControl<string | number | null, string | number>,
    FormValueControl<string | number | null>
{
  readonly uiState = inject(FieldUiState);
  private readonly fieldShellHost = viewChild.required(FieldShellHost);
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');
  private readonly comboboxTemplateRef = viewChild.required<TemplateRef<any>>('comboboxTpl');

  readonly value = model<string | number | null>(null);
  readonly label = input('');
  readonly hint = input('');
  readonly placeholder = input('Search and select');
  readonly iconStart = input('');
  readonly clearValue = input<string | number | null | undefined>(null);

  readonly items = input<(string | number)[]>([]);
  readonly expanded = model(false);
  readonly query = model('');

  readonly options = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return query
      ? this.items().filter(item => String(item).toLocaleLowerCase().includes(query))
      : [];
  });

  readonly overlay = createOverlay(() => ({
    state: this.expanded,
    content: this.comboboxTemplateRef(),
    position: {
      connectedTo: this.fieldShellHost().referenceElement(),
      matchWidth: true,
    },
    focus: {
      restoreTo: () => this.fieldShellHost().focusReturnTarget(),
    },
    lifecycle: {
      beforeClose: [
        (_, __, reason) => {
          if (reason !== 'state') this.resetQueryToValue();
        },
      ],
    },
  }));

  private resetQueryToValue() {
    const value = this.value();
    const valueText = value !== null ? String(value) : '';

    if (this.query() !== valueText) {
      this.query.set(valueText);
    }
  }

  focus(options?: FocusOptions) {
    this.inputElement().nativeElement.focus(options);
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

```html {example="recipe" title="combobox.html"}
<fibo-field-shell
  #fieldShell
  [label]="label()"
  [hint]="hint()"
  [iconStart]="iconStart()"
  iconEnd="chevron-down"
  [canClear]="clearValue() !== undefined && value() !== clearValue()"
  (clearRequested)="clear()"
>
  <input
    fiboFieldInput
    class="fibo-field-input"
    #inputElement
    [placeholder]="placeholder()"
    (blur)="uiState.touched.set(true)"
    fiboComboboxInput
  />
</fibo-field-shell>

<ng-template #comboboxTpl>
  <div
    fiboComboboxList
    [keyboardSourceElement]="inputElement"
    fiboDataList
    [useActiveDescendant]="true"
    [autoActivateFirst]="true"
    (itemTriggered)="expanded.set(false)"
    fiboSelectOne
    [(value)]="value"
  >
    @for (item of options(); track item) {
      <button
        type="button"
        fiboDataListItem
        [value]="item"
        role="option"
        class="datalist-item w-full text-left"
      >
        {{ item }}
      </button>
    }
  </div>
</ng-template>
```

```ts {example="recipe" title="combobox-input.ts"}
import { Directive, effect, inject, untracked } from '@angular/core';
import { injectFormValueControl } from '@fibo-ui/cdk';
import { injectComboboxControl } from './combobox-control-token';
import { injectComboboxInternal } from './combobox-internal-token';

@Directive({
  selector: 'input[fiboComboboxInput]',
  exportAs: 'ComboboxInput',
  host: {
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'none',
    spellcheck: 'false',
    'aria-autocomplete': 'list',
    'aria-haspopup': 'listbox',
    '[value]': 'combobox.query()',
    '[disabled]': 'formControl.disabled?.() ?? false',
    '[required]': 'formControl.required?.() ?? false',
    '[attr.aria-required]': 'formControl.required?.() ?? false',
    '[attr.aria-invalid]': 'formControl.invalid?.() ?? false',
    '[attr.aria-expanded]': 'combobox.expanded()',
    '[attr.data-overlay-open]': 'combobox.expanded() || null',
    '[attr.aria-controls]': 'combobox.expanded() ? comboboxInternal.listboxId() : null',
    '[attr.aria-activedescendant]': 'combobox.expanded() ? comboboxInternal.activeDescendantId() : null',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ComboboxInput {
  readonly combobox = injectComboboxControl<string | number | null, string | number>();
  readonly formControl = injectFormValueControl<string | number | null>();
  readonly comboboxInternal = injectComboboxInternal();

  constructor() {
    effect(() => {
      if (!this.combobox.expanded()) {
        this.comboboxInternal.activeDescendantId.set(null);
      }
    });

    effect(() => {
      const value = this.combobox.value();
      const valueText = value !== null ? String(value) : '';

      if (untracked(() => this.combobox.query()) !== valueText) {
        this.combobox.query.set(valueText);
      }
    });

    effect(() => {
      const disabled = this.formControl.disabled?.() ?? false;
      const hasOptions = this.combobox.options().length > 0;

      if (this.combobox.expanded() && (disabled || !hasOptions)) {
        this.collapse();
      }
    });
  }

  private collapse() {
    this.combobox.expanded.set(false);
    this.comboboxInternal.activeDescendantId.set(null);
  }

  private resetInputValue() {
    this.combobox.query.set(this.currentValueText());
  }

  private currentValueText() {
    const value = this.combobox.value();
    return value !== null ? String(value) : '';
  }

  onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.combobox.query.set(text);

    if (!text) {
      this.combobox.value.set(null);
      this.collapse();
      return;
    }

    this.combobox.expanded.set(this.combobox.options().length > 0);
  }

  onBlur() {
    queueMicrotask(() => {
      if (!this.combobox.expanded()) {
        this.resetInputValue();
      }
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.collapse();
      this.resetInputValue();
      event.preventDefault();
      return;
    }

    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !this.combobox.expanded()) {
      if (this.combobox.options().length > 0) {
        this.combobox.expanded.set(true);
      }
      event.preventDefault();
    }
  }
}
```

```ts {example="recipe" title="combobox-list.ts"}
import { Directive, effect, inject } from '@angular/core';
import { DataList } from '@fibo-ui/cdk';
import { injectComboboxInternal } from './combobox-internal-token';

@Directive({
  selector: '[fiboComboboxList]',
  exportAs: 'ComboboxList',
  host: {
    role: 'listbox',
    '[attr.id]': 'comboboxInternal.listboxId()',
  },
})
export class ComboboxList {
  readonly comboboxInternal = injectComboboxInternal();
  private readonly dataList = inject(DataList);

  constructor() {
    effect(() => {
      this.comboboxInternal.activeDescendantId.set(
        this.dataList.activeDataListItem()?.id() ?? null,
      );
    });
  }
}
```

```ts {example="recipe" title="combobox-internal-token.ts"}
import {
  Injectable,
  inject,
  signal,
} from '@angular/core';

let nextComboboxListboxId = 0;

@Injectable()
export class ComboboxInternal {
  readonly listboxId = signal(`fibo-combobox-listbox-${nextComboboxListboxId++}`);
  readonly activeDescendantId = signal<string | null>(null);
}

export function injectComboboxInternal(): ComboboxInternal {
  return inject(ComboboxInternal);
}
```

```ts {example="recipe" title="combobox-control-token.ts"}
import {
  forwardRef,
  inject,
  InjectionToken,
  type ModelSignal,
  type Provider,
  type Signal,
  type Type,
  type WritableSignal,
} from '@angular/core';
import { ComboboxInternal } from './combobox-internal-token';

export interface ComboboxControl<TValue, TItem = TValue> {
  value: ModelSignal<TValue>;
  expanded: WritableSignal<boolean>;
  options: Signal<readonly TItem[]>;
  query: WritableSignal<string>;
}

export const FIBO_COMBOBOX_CONTROL = new InjectionToken<ComboboxControl<unknown>>(
  'FIBO_COMBOBOX_CONTROL',
);

export function provideComboboxControl<TValue, TItem = TValue>(
  type: () => Type<ComboboxControl<TValue, TItem>>,
): Provider[] {
  return [
    { provide: FIBO_COMBOBOX_CONTROL, useExisting: forwardRef(type) },
    ComboboxInternal,
  ];
}

export function injectComboboxControl<TValue, TItem = TValue>(): ComboboxControl<TValue, TItem> {
  return inject(FIBO_COMBOBOX_CONTROL) as ComboboxControl<TValue, TItem>;
}
```
