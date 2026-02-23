# Date Range Picker

Calendar-based date range picker with Signal Forms support.

## Basic Usage

:::example datepicker-range

```html {example="datepicker-range"}
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

  <fibo-calendar *fiboPortalContent="let trigger"
                 fiboPopover [trigger]="trigger"
                 fiboSelectDateRange [(value)]="calendarDateRange"
                 class="popover-container" />
</fibo-form-field-control>
```

```ts {example="datepicker-range"}
@Component({
  selector: 'datepicker-range-example',
  imports: [
    FormField, FormFieldControl, PopoverTriggerClick,
    PortalContent, Popover, Calendar, SelectDateRange,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class DatepickerRangeExample {
  readonly calendarDateRange = model({ startDate: '', endDate: '' });
  readonly dateRangeForm = form(this.calendarDateRange);
}
```
