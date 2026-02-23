# Checkbox

Accessible checkbox component with support for indeterminate state and Signal Forms.

## Basic Usage

:::example checkbox-basic

```html {example="checkbox-basic"}
<div class="space-y-4">
  <fibo-checkbox [checked]="false">Unchecked</fibo-checkbox>
  <fibo-checkbox [checked]="true">Checked</fibo-checkbox>
  <fibo-checkbox [indeterminate]="true">Indeterminate</fibo-checkbox>
  <fibo-checkbox [checked]="true" [disabled]="true">Disabled</fibo-checkbox>
</div>
```

```ts {example="checkbox-basic"}
@Component({
  selector: 'checkbox-basic-example',
  imports: [Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CheckboxBasicExample {}
```

## Signal Forms

:::example checkbox-signal-forms

```html {example="checkbox-signal-forms"}
<form class="space-y-4">
  <div>
    <fibo-checkbox [formField]="settingsForm.acceptTerms">
      I accept the terms and conditions
    </fibo-checkbox>
  </div>
  <div>
    <fibo-checkbox [formField]="settingsForm.enableNotifications">
      Enable email notifications
    </fibo-checkbox>
  </div>
  <div>
    <fibo-checkbox [formField]="settingsForm.marketingEmails">
      Receive marketing emails
    </fibo-checkbox>
  </div>
</form>
```

```ts {example="checkbox-signal-forms"}
@Component({
  selector: 'checkbox-signal-forms-example',
  imports: [FormField, Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class CheckboxSignalFormsExample {
  readonly settingsModel = signal({
    acceptTerms: false,
    enableNotifications: false,
    marketingEmails: false,
  });
  readonly settingsForm = form(this.settingsModel, schemaPath => {
    required(schemaPath.acceptTerms, { message: 'You must accept the terms' });
  });
}
```
