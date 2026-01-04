import {ChangeDetectionStrategy, Component, computed, effect, model, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form} from '@angular/forms/signals';
import {FormField, Calendar, CalendarDateRangeSelectionModel, DateRange} from '@fibo-ui/components';
import {
  FiboInput,
  Popover,
  PopoverTrigger,
  PortalTemplateDirective
} from '@fibo-ui/cdk';
import {FieldLabel} from '../../../../../projects/fibo-ui/components/src/lib/form/form-field/field-label';
import {UsageDemo} from '../../../common/usage-demo';

@Component({
  selector: 'app-date-range',
  imports: [
    CommonModule,
    Field,
    FormField,
    FiboInput,
    Popover,
    PortalTemplateDirective,
    PopoverTrigger,
    Calendar,
    CalendarDateRangeSelectionModel,
    FieldLabel,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-foreground">Date Range Picker with Signal Forms</h2>
    <app-usage-demo [codeBlocks]="codeBlocks">
      <div class="mx-auto w-70 space-y-4 p-8">
        <form class="space-y-4">
          <fibo-form-field
            fiboPopoverTrigger
            #dateRangeTrigger="PopoverTrigger"
            appendIcon="calendar-range">
            <fibo-field-label>Date Range</fibo-field-label>
            <div class="flex items-center gap-1">
              <input
                fiboInput
                type="text"
                [field]="dateRangeForm.startDate"
                placeholder="YYYY-MM-DD"
                (focus)="dateRangeTrigger.open()"
                class="w-19 appearance-none outline-none text-sm placeholder:text-xs focus:outline-0"/>
              <span class="flex items-center mx-1 text-gray-400 text-center">-</span>
              <input
                fiboInput
                type="text"
                [field]="dateRangeForm.endDate"
                placeholder="YYYY-MM-DD"
                (focus)="dateRangeTrigger.open()"
                class="w-full pl-1 appearance-none outline-none text-sm placeholder:text-xs focus:outline-0"/>
            </div>
            <ng-template fiboPortalTemplate [(isOpen)]="dateRangeTrigger.isOpen">
              <fibo-calendar
                fiboPopover
                [trigger]="dateRangeTrigger"
                class="fibo-popover rounded-md"
                [(fiboCalendarDateRangeSelectionModel)]="calendarDateRange"

              />
            </ng-template>
          </fibo-form-field>
        </form>
      </div>
    </app-usage-demo>
  `,
})
export class DateRangeExampleComponent {

  // Model signal for calendar component (needs to sync with form field)
  calendarDateRange = model({
    startDate: '',
    endDate: ''
  });

  dateRangeForm = form(this.calendarDateRange, (schemaPath) => {
    // Add validation if needed
  });


  readonly codeBlocks = [
    { name: 'html', path: '/documentation/datepicker/signal-forms-date-range.html.md' },
    { name: 'ts', path: '/documentation/datepicker/signal-forms-date-range.ts.md' }
  ];
}

