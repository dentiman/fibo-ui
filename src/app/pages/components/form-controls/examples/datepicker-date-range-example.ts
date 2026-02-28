import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { SelectDateRange, Popover, PopoverTriggerClick, PortalContent } from '@fibo-ui/cdk';
import { Calendar, FormFieldControl } from '@fibo-ui/components';

@Component({
  selector: 'datepicker-date-range-example',
  imports: [
    FormField,
    FormFieldControl,
    PopoverTriggerClick,
    PortalContent,
    Popover,
    Calendar,
    SelectDateRange,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <fibo-form-field-control fiboPopoverTriggerClick
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

        <ng-template fiboPortalContent let-trigger>
          <fibo-calendar fiboPopover [trigger]="trigger"
                         fiboSelectDateRange [(value)]="calendarDateRange"
                         class="popover-container" />
        </ng-template>
      </fibo-form-field-control>
    </div>
  `,
})
export class DatepickerDateRangeExample {
  readonly calendarDateRange = model({ startDate: '', endDate: '' });
  readonly dateRangeForm = form(this.calendarDateRange);
}
