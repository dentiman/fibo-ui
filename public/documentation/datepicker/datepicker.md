# Datepicker

Calendar-based date picker with Signal Forms support.

## Basic Usage

:::example datepicker

```html {example="datepicker"}
<fibo-datepicker
  [formField]="userForm.birthDate"
  label="Birth Date"
  placeholder="YYYY-MM-DD"
/>
```

```ts {example="datepicker"}
@Component({
  selector: 'datepicker-component-example',
  imports: [DatePickerField, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class DatepickerComponentExample {
  readonly userModel = signal({ birthDate: '' });
  readonly userForm = form(this.userModel);
}
```

## API

### Inputs

- `label: input<string>` - field label
- `placeholder: input<string>` - placeholder text
- `iconStart: input<string>` - start icon name
- standard form-state inputs: `required`, `disabled`, `touched`, `invalid`, `dirty`, `errors`
