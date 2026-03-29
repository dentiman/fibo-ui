# Multiple Select

Multi-value selector with checkbox items, integrated with Signal Forms.

## Basic Usage

:::example multiple-select

```html {example="multiple-select"}
<fibo-multi-select
  [formField]="userForm.skills"
  label="Skills"
  placeholder="Select skills"
  [items]="skillItems"
/>
```

```ts {example="multiple-select"}
@Component({
  selector: 'multiple-select-component-example',
  imports: [MultiSelect, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class MultipleSelectComponentExample {
  readonly skillItems: SelectItem[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
  ];

  readonly user = signal({ skills: [] as string[] });
  readonly userForm = form(this.user);
}
```

## API

### Inputs

- `items: input<SelectItem[]>` - available options
- `label: input<string>` - field label
- `placeholder: input<string>` - placeholder text
- standard form-state inputs: `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`

### Types

```ts
export interface SelectItem {
  label: string;
  value: string | number | null;
}
```
