# Switch

Toggle switch component with size variants and Signal Forms support.

## Basic Usage

:::example switch-basic

```html {example="switch-basic"}
<div class="flex flex-wrap gap-4">
  <fibo-switch [checked]="false">Unchecked</fibo-switch>
  <fibo-switch [checked]="true">Checked</fibo-switch>
  <fibo-switch [checked]="true" [isLoading]="true">Loading</fibo-switch>
  <fibo-switch [checked]="true" [disabled]="true">Disabled</fibo-switch>
</div>
```

```ts {example="switch-basic"}
@Component({
  selector: 'switch-basic-example',
  imports: [Switch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class SwitchBasicExample {}
```

## Sizes

:::example switch-sizes

```html {example="switch-sizes"}
<div class="flex flex-wrap gap-4">
  <fibo-switch [checked]="true" size="xs">Extra small</fibo-switch>
  <fibo-switch [checked]="true" size="sm">Small</fibo-switch>
  <fibo-switch [checked]="true" size="md">Medium</fibo-switch>
  <fibo-switch [checked]="true" size="lg">Large</fibo-switch>
  <fibo-switch [checked]="true" size="xl">Extra large</fibo-switch>
</div>
```

```ts {example="switch-sizes"}
@Component({
  selector: 'switch-sizes-example',
  imports: [Switch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class SwitchSizesExample {}
```

## Signal Forms

:::example switch-signal-forms

```html {example="switch-signal-forms"}
<form class="space-y-4">
  <div>
    <fibo-switch [formField]="settingsForm.enableNotifications">
      Enable push notifications
    </fibo-switch>
  </div>
  <div>
    <fibo-switch [formField]="settingsForm.enableDarkMode">
      Enable dark mode
    </fibo-switch>
  </div>
  <div>
    <fibo-switch [formField]="settingsForm.enableAnalytics">
      Enable analytics tracking
    </fibo-switch>
  </div>
  <div>
    <fibo-switch [formField]="settingsForm.requireTwoFactor">
      Require two-factor authentication
    </fibo-switch>
  </div>
</form>
```

```ts {example="switch-signal-forms"}
@Component({
  selector: 'switch-signal-forms-example',
  imports: [FormField, Switch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class SwitchSignalFormsExample {
  readonly settingsModel = signal({
    enableNotifications: false,
    enableDarkMode: false,
    enableAnalytics: false,
    requireTwoFactor: false,
  });
  readonly settingsForm = form(this.settingsModel, schemaPath => {
    required(schemaPath.requireTwoFactor, { message: 'Two-factor authentication is required' });
  });
}
```
