import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form} from '@angular/forms/signals';
import {FormField, Calendar, CalendarDateSelectionModel} from '@fibo-ui/components';
import {
  FiboInput,
  Popover,
  PopoverTrigger,
  PortalTemplateDirective
} from '@fibo-ui/cdk';
import {FieldLabel} from '../../../../../projects/fibo-ui/components/src/lib/form/form-field/field-label';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-datepicker',
  imports: [
    CommonModule,
    Field,
    FormField,
    FiboInput,
    Popover,
    PortalTemplateDirective,
    PopoverTrigger,
    Calendar,
    CalendarDateSelectionModel,
    FieldLabel,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Datepicker with Signal Forms</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4 p-8">
        <form class="space-y-4">
          <fibo-form-field
            fiboPopoverTrigger
            #dateTrigger="PopoverTrigger"
            [field]="userForm.birthDate"
            appendIcon="calendar-days">
            <fibo-field-label>Birth Date</fibo-field-label>
            <input
              fiboInput
              type="number"
              [field]="userForm.birthDate"
              placeholder="YYYY-MM-DD"
              (focus)="dateTrigger.open()"
              class="w-full appearance-none outline-none text-sm focus:outline-0" />
            <ng-template fiboPortalTemplate [(isOpen)]="dateTrigger.isOpen">
              <fibo-calendar
                fiboPopover
                [trigger]="dateTrigger"
                class="fibo-popover rounded-md"
                [(fiboCalendarDateSelectionModel)]="userForm.birthDate().value"
                (optionTriggered)="dateTrigger.close()"
              />
            </ng-template>
          </fibo-form-field>
        </form>
      </div>
    </app-usage-demo>
  `,
})
export class DatepickerExampleComponent {
  userModel = signal({
    birthDate: ''
  });

  userForm = form(this.userModel, (schemaPath) => {
    // Add validation if needed
  });

  readonly codeBlocks = [
    { name: 'html', path: '/documentation/datepicker/signal-forms.html.md' },
    { name: 'ts', path: '/documentation/datepicker/signal-forms.ts.md' }
  ];
}

