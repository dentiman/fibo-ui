import { Component, ChangeDetectionStrategy, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form } from '@angular/forms/signals';
import { Calendar } from '@fibo-ui/components';
import {
  SelectDateRange,
  SelectDate,
  Popover,
  PopoverTriggerClick,
  PortalContent,
  FormFieldDirective
} from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { UsageDemo } from '../../../common/usage-demo';

@Component({
  selector: 'app-datepicker-page',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    FormFieldDirective,
    Popover,
    PortalContent,
    PopoverTriggerClick,
    Calendar,
    SelectDate,
    SelectDateRange,
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
          <div class="container mx-auto p-4 w-[350px]">
            <form class="space-y-4">
              <div fiboFormField fiboPopoverTriggerClick
                   class="form-field-control flex items-center gap-2">
                <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
                  <label class="form-field-label mt-1">Birth Date</label>
                  <input
                    type="text"
                    [formField]="userForm.birthDate"
                    placeholder="YYYY-MM-DD"
                    class="text-field-input"/>
                </div>
                <lucide-icon name="calendar-days" size="16"
                             class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>

                <fibo-calendar *fiboPortalContent="let trigger"
                               fiboPopover [trigger]="trigger"
                               fiboSelectDate [(value)]="userForm.birthDate().value"
                               (optionTriggered)="trigger.close()"
                               class="popover-container"/>
              </div>
            </form>
          </div>
        </app-usage-demo>
      </div>

      <!-- Date Range -->
      <div>
        <h2 class="text-foreground">Date Range Picker with Signal Forms</h2>
        <app-usage-demo [codeBlocks]="dateRangeCodeBlocks">
          <div class="container mx-auto p-4 w-[350px]">
            <form class="space-y-4">
              <div fiboFormField fiboPopoverTriggerClick
                   class="form-field-control flex items-center gap-2">
                <div class="flex flex-col justify-center flex-1 min-w-0 gap-0">
                  <label class="form-field-label mt-1">Date Range</label>
                  <div class="flex items-center gap-2">
                    <input
                      type="text"
                      [formField]="dateRangeForm.startDate"
                      placeholder="YYYY-MM-DD"
                      class="text-field-input min-w-0 flex-1"/>
                    <span class="from-field-placeholder text-sm shrink-0">-</span>
                    <input
                      type="text"
                      [formField]="dateRangeForm.endDate"
                      placeholder="YYYY-MM-DD"
                      class="text-field-input min-w-0 flex-1"/>
                  </div>
                </div>
                <lucide-icon name="calendar-range" size="16"
                             class="form-field-icon form-field-icon-end shrink-0"></lucide-icon>
                <fibo-calendar *fiboPortalContent="let trigger"
                               fiboPopover [trigger]="trigger"
                               fiboSelectDateRange [(value)]="calendarDateRange"
                               class="popover-container"/>
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
