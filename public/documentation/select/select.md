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
