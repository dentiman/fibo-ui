import {Component, ChangeDetectionStrategy, signal, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Field, form} from '@angular/forms/signals';
import {Calendar, CalendarDateSelectionModel, CalendarDateRangeSelectionModel} from '@fibo-ui/components';
import {
  Popover,
  PopoverTriggerClick,
  PortalContent,
  FormFieldDirective
} from '@fibo-ui/cdk';
import {LucideAngularModule} from 'lucide-angular';
import {UsageDemo} from '../../common/usage-demo';

@Component({
  selector: 'app-datepicker-page',
  standalone: true,
  imports: [
    CommonModule,
    Field,
    FormFieldDirective,
    Popover,
    PortalContent,
    PopoverTriggerClick,
    Calendar,
    CalendarDateSelectionModel,
    CalendarDateRangeSelectionModel,
    LucideAngularModule,
    UsageDemo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 flex flex-col space-y-12">
      <!-- Datepicker -->
      <div>
        <h2 class="text-foreground">Datepicker with Signal Forms</h2>
        <app-usage-demo [codeBlocks]="datepickerCodeBlocks">
          <div class="mx-auto w-70 space-y-4 p-8">
            <form class="space-y-4">

              <div fiboFormField fiboPopoverTriggerClick class="group  fibo-form-field  px-3 py-1 flex flex-col justify-center relative">
                <label class="block text-xs fibo-form-field-label">Birth Date</label>
                <input
                  type="text"
                  [field]="userForm.birthDate"
                  placeholder="YYYY-MM-DD"
                  class="w-full appearance-none outline-none text-sm focus:outline-0" />
                <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2">
                  <lucide-icon name="calendar-days" size="16" class="text-foreground-tertiary"></lucide-icon>
                </div>

                  <fibo-calendar *fiboPortalContent="let trigger"
                                 fiboPopover           [trigger]="trigger"
                                 fiboCalendarDate      [(value)]="userForm.birthDate().value"
                                 (optionTriggered)="trigger.close()"
                                 class="fibo-popover rounded-md"/>

              </div>

            </form>
          </div>
        </app-usage-demo>
      </div>

      <!-- Date Range -->
      <div>
        <h2 class="text-foreground">Date Range Picker with Signal Forms</h2>
        <app-usage-demo [codeBlocks]="dateRangeCodeBlocks">
          <div class="mx-auto w-70 space-y-4 p-8">
            <form class="space-y-4">
              <div fiboFormField fiboPopoverTriggerClick class="group content-center fibo-form-field px-3 py-1 relative">
                <label class="block text-xs fibo-form-field-label">Date Range</label>
                <div class="flex items-center gap-1">
                  <input
                    type="text"
                    [field]="dateRangeForm.startDate"
                    placeholder="YYYY-MM-DD"
                    class="w-19 appearance-none outline-none text-sm placeholder:text-xs focus:outline-0"/>
                  <span class="flex items-center mx-1 text-gray-400 text-center">-</span>
                  <input
                    type="text"
                    [field]="dateRangeForm.endDate"
                    placeholder="YYYY-MM-DD"
                    class="w-full pl-1 appearance-none outline-none text-sm placeholder:text-xs focus:outline-0"/>
                </div>
                <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2">
                  <lucide-icon name="calendar-range" size="16" class="text-foreground-tertiary"></lucide-icon>
                </div>
                <fibo-calendar *fiboPortalContent="let trigger"
                               fiboPopover              [trigger]="trigger"
                               fiboCalendarDateRange    [(value)]="calendarDateRange"
                               class="fibo-popover rounded-md"/>
              </div>
            </form>
          </div>
        </app-usage-demo>
      </div>
    </div>
  `
})
export class DatepickerPageComponent {
  // Datepicker
  userModel = signal({
    birthDate: ''
  });

  userForm = form(this.userModel, (schemaPath) => {
    // Add validation if needed
  });

  readonly datepickerCodeBlocks = [
    { name: 'html', path: '/documentation/datepicker/signal-forms.html.md' },
    { name: 'ts', path: '/documentation/datepicker/signal-forms.ts.md' }
  ];

  // Date Range
  calendarDateRange = model({
    startDate: '',
    endDate: ''
  });

  dateRangeForm = form(this.calendarDateRange, (schemaPath) => {
    // Add validation if needed
  });

  readonly dateRangeCodeBlocks = [
    { name: 'html', path: '/documentation/datepicker/signal-forms-date-range.html.md' },
    { name: 'ts', path: '/documentation/datepicker/signal-forms-date-range.ts.md' }
  ];
}
