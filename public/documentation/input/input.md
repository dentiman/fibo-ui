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
