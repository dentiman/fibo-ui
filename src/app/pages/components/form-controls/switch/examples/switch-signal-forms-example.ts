import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { Switch } from '@fibo-ui/components';

@Component({
  selector: 'switch-signal-forms-example',
  imports: [FormField, Switch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-70 space-y-4 p-8">
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
    </div>
  `,
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
