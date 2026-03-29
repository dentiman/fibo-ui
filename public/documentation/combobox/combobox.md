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
