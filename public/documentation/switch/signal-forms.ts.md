```ts
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form, required} from '@angular/forms/signals';
import {Switch} from '@fibo-ui/components';

@Component({
  selector: 'app-switch-signal-forms',
  imports: [CommonModule, Field, Switch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'signal-forms.html'
})
export class SignalFormsSwitchExampleComponent {
  settingsModel = signal({
    enableNotifications: false,
    enableDarkMode: false,
    enableAnalytics: false,
    requireTwoFactor: false
  });

  settingsForm = form(this.settingsModel, (schemaPath) => {
    required(schemaPath.requireTwoFactor, { message: 'Two-factor authentication is required' });
  });
}
```

