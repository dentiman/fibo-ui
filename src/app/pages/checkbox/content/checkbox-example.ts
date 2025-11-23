import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form, required} from '@angular/forms/signals';
import {Checkbox} from '@fibo-ui/components';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule, Field, Checkbox, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Checkbox with Signal Forms</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4 p-8">
        <form class="space-y-4">
          <div>
            <fibo-checkbox [field]="settingsForm.acceptTerms">
              I accept the terms and conditions
            </fibo-checkbox>
          </div>
          
          <div>
            <fibo-checkbox [field]="settingsForm.enableNotifications">
              Enable email notifications
            </fibo-checkbox>
          </div>
          
          <div>
            <fibo-checkbox [field]="settingsForm.marketingEmails">
              Receive marketing emails
            </fibo-checkbox>
          </div>
        </form>
      </div>
    </app-usage-demo>
  `,
})
export class CheckboxExampleComponent {
  settingsModel = signal({
    acceptTerms: false,
    enableNotifications: false,
    marketingEmails: false
  });

  settingsForm = form(this.settingsModel, (schemaPath) => {
    required(schemaPath.acceptTerms, { message: 'You must accept the terms' });
  });

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/checkbox/signal-forms.html.md' },
    { name: 'ts', path: '/documentation/checkbox/signal-forms.ts.md' }
  ];
}

