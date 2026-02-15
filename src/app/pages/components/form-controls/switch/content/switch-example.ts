import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormField, form, required} from '@angular/forms/signals';
import {Switch} from '@fibo-ui/components';
import {UsageDemo} from '../../../../../common/usage-demo';

@Component({
  selector: 'app-switch',
  imports: [CommonModule, FormField, Switch, UsageDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Switch with Signal Forms</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
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
    </app-usage-demo>
  `,
})
export class SwitchExampleComponent {
  settingsModel = signal({
    enableNotifications: false,
    enableDarkMode: false,
    enableAnalytics: false,
    requireTwoFactor: false
  });

  settingsForm = form(this.settingsModel, (schemaPath) => {
    required(schemaPath.requireTwoFactor, { message: 'Two-factor authentication is required' });
  });

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/switch/signal-forms.html.md' },
    { name: 'ts', path: '/documentation/switch/signal-forms.ts.md' }
  ];
}

