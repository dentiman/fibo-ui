# Combobox

Editable combobox with restricted selection.

This pattern keeps the typed text separate from the form value. The form value changes only after the user explicitly selects an option from the popup. If the input loses focus without a selection, the typed text is reset.

## Basic Usage

:::example combobox-basic-template

```html {example="combobox-basic-template"}
<fibo-form-field-control
  fiboPopoverTrigger
  #trigger="PopoverTrigger"
  [delegatesFocus]="true"
  [content]="comboboxTpl"
  label="Assignee"
  iconEnd="chevron-down"
  [clearValue]="null"
  [(value)]="value"
>
  <input
    type="text"
    role="combobox"
    aria-autocomplete="list"
    [value]="inputValue()"
    placeholder="Search assignee"
    autocomplete="off"
    class="text-field-input"
    (focus)="onFocus(trigger)"
    (input)="onInput($event, trigger)"
    (keydown)="onInputKeydown($event, trigger)"
    (blur)="onBlur()"
  />

  <ng-template #comboboxTpl let-trigger>
    <div
      fiboPopover
      [trigger]="trigger"
      [matchWidth]="true"
      role="listbox"
      fiboDataList
      fiboSelectOne
      [(value)]="value"
      (itemTriggered)="trigger.close()"
      class="popover-container"
    >
      @for (item of visibleItems(); track item.value) {
        <button
          type="button"
          fiboDataListItem
          [value]="item.value"
          role="option"
          class="datalist-item w-full text-left"
        >
          {{ item.label }}
        </button>
      }
    </div>
  </ng-template>
</fibo-form-field-control>
```

```ts {example="combobox-basic-template"}
@Component({
  selector: 'combobox-basic-template-example',
  imports: [FormFieldControl, PopoverTrigger, Popover, DataList, DataListItem, SelectOne],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class ComboboxBasicTemplateExample {
  readonly value = model<string | null>(null);
  readonly options = signal([
    { label: 'Ada Lovelace', value: 'ada' },
    { label: 'Alan Turing', value: 'alan' },
    { label: 'Barbara Liskov', value: 'barbara' },
  ]);

  readonly selectedItem = computed(() => {
    const value = this.value();
    if (value === null) return null;
    return this.options().find((item) => item.value === value) ?? null;
  });

  readonly inputValue = linkedSignal({
    source: this.selectedItem,
    computation: (selectedItem) => selectedItem?.label ?? '',
  });
}
```

## Combobox Component

Ready-made combobox component that encapsulates the editable field, popover, and listbox selection model.

:::example combobox-component

```html {example="combobox-component" title="usage.html"}
<fibo-combobox
  [formField]="userForm.assignee"
  label="Assignee"
  placeholder="Search assignee"
  [items]="assignees"
/>
```

```ts {example="combobox-component" title="usage.ts"}
@Component({
  selector: 'combobox-component-example',
  imports: [Combobox, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class ComboboxComponentExample {
  readonly assignees: ComboboxItem[] = [
    { label: 'Ada Lovelace', value: 'ada' },
    { label: 'Alan Turing', value: 'alan' },
    { label: 'Barbara Liskov', value: 'barbara' },
    { label: 'Grace Hopper', value: 'grace' },
  ];

  readonly user = signal({ assignee: null as string | null });
  readonly userForm = form(this.user);
}
```

```html {example="combobox-component" title="fibo-combobox.html"}
<fibo-form-field-control
  fiboPopoverTrigger
  #trigger="PopoverTrigger"
  [delegatesFocus]="true"
  [content]="comboboxTpl"
  [label]="label()"
  [iconEnd]="'chevron-down'"
  [clearValue]="clearValue()"
  [(value)]="value"
>
  <input
    type="text"
    role="combobox"
    aria-autocomplete="list"
    [value]="inputValue()"
    [placeholder]="placeholder()"
    autocomplete="off"
    class="text-field-input"
    (focus)="onFocus(trigger)"
    (input)="onInput($event, trigger)"
    (keydown)="onInputKeydown($event, trigger)"
    (blur)="onBlur()"
  />

  <ng-template #comboboxTpl let-trigger>
    <div
      fiboPopover
      [trigger]="trigger"
      [matchWidth]="true"
      role="listbox"
      fiboDataList
      fiboSelectOne
      [(value)]="value"
      (itemTriggered)="trigger.close()"
      class="popover-container"
    >
      @for (item of visibleItems(); track item.value) {
        <button
          type="button"
          fiboDataListItem
          [value]="item.value"
          role="option"
          class="datalist-item w-full text-left"
        >
          {{ item.label }}
        </button>
      }
    </div>
  </ng-template>
</fibo-form-field-control>
```

```ts {example="combobox-component" title="fibo-combobox.ts"}
@Component({
  selector: 'fibo-combobox',
  imports: [FormFieldControl, PopoverTrigger, Popover, DataList, DataListItem, SelectOne],
  host: { class: 'block' },
  template: '...',
})
export class Combobox implements FormValueControl<string | number | null> {
  value = model<string | number | null>(null);
  items = input<ComboboxItem[]>([]);

  readonly selectedItem = computed(() => {
    const currentValue = this.value();
    if (currentValue === null) return null;
    return this.items().find((item) => item.value === currentValue) ?? null;
  });

  readonly inputValue = linkedSignal({
    source: this.selectedItem,
    computation: (selectedItem) => selectedItem?.label ?? '',
  });
}
```

## Behavior

- The input text is local draft state and is not written to the form value while the user types.
- Only explicit option selection commits a new value.
- Blur restores the last selected option label, or clears the input if nothing is selected.
- Custom values are not allowed in this variant.

## API

### Inputs

- `value: model<string | number | null>`
- `items: input<ComboboxItem[]>`
- `label: input<string>`
- `placeholder: input<string>`
- `iconStart: input<string>`
- `clearValue: input<string | number | null | undefined>`
- standard form-state inputs: `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

### Types

```ts
export interface ComboboxItem {
  label: string;
  value: string | number | null;
}
```
