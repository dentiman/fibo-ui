import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { Checkbox } from '@fibo-ui/components';

@Component({
  selector: 'checkbox-signal-forms-example',
  imports: [FormField, Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-70 space-y-4 p-8">
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
    </div>
  `,
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
