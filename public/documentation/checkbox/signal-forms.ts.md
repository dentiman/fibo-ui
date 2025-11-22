```ts
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form, required} from '@angular/forms/signals';
import {Checkbox} from '@fibo-ui/components';

@Component({
  selector: 'app-checkbox-signal-forms',
  imports: [CommonModule, Field, Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'signal-forms.html'
})
export class SignalFormsCheckboxExampleComponent {
  settingsModel = signal({
    acceptTerms: false,
    enableNotifications: false,
    marketingEmails: false
  });

  settingsForm = form(this.settingsModel, (schemaPath) => {
    required(schemaPath.acceptTerms, { message: 'You must accept the terms' });
  });
}
```

