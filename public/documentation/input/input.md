# Input

Text input.

## Basic Usage

:::example input-basic

```html {example="input-basic"}
<form class="space-y-4">
  <fibo-form-field-control label="Username" iconStart="user">
    <input type="text" placeholder="Enter username" class="text-field-input" />
  </fibo-form-field-control>

  <fibo-form-field-control label="Password" iconStart="lock">
    <input type="password" placeholder="Enter password" class="text-field-input" />
  </fibo-form-field-control>
</form>
```

```ts {example="input-basic"}
@Component({
  selector: 'input-basic-example',
  imports: [FormFieldControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class InputBasicExample {}
```
