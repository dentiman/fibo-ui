import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { SelectDateRange, Popover, PopoverTriggerClick } from '@fibo-ui/cdk';
import { Calendar, FormFieldControl } from '@fibo-ui/components';

@Component({
  selector: 'datepicker-range-example',
  imports: [
    FormField,
    FormFieldControl,
    PopoverTriggerClick,
    Popover,
    Calendar,
    SelectDateRange,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-form-field-control fiboPopoverTriggerClick [content]="calTpl"
        label="Date Range" iconEnd="calendar-range">

        <div class="flex items-center gap-2">
          <input [formField]="dateRangeForm.startDate"
                 type="text" placeholder="YYYY-MM-DD"
                 class="text-field-input min-w-0 flex-1" />
          <span class="from-field-placeholder text-sm shrink-0">-</span>
          <input [formField]="dateRangeForm.endDate"
                 type="text" placeholder="YYYY-MM-DD"
                 class="text-field-input min-w-0 flex-1" />
        </div>
      </fibo-form-field-control>
      <ng-template #calTpl let-trigger>
        <fibo-calendar fiboPopover
                       fiboSelectDateRange [(value)]="calendarDateRange"
                       class="popover-container" />
      </ng-template>
    </div>
  `,
})
export class DatepickerRangeExample {
  readonly calendarDateRange = model({ startDate: '', endDate: '' });
  readonly dateRangeForm = form(this.calendarDateRange);
}
