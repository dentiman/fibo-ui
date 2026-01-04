```html
<form class="space-y-4">
  <fibo-form-field
    fiboPopoverTrigger
    #dateRangeTrigger="PopoverTrigger"
    [field]="userForm.dateRange"
    appendIcon="calendar-range">
    <fibo-field-label>Date Range</fibo-field-label>
    <div class="flex items-center gap-1">
      <input
        fiboInput
        name="startDate"
        type="text"
        [value]="dateRangeValue().startDate || ''"
        placeholder="YYYY-MM-DD"
        (focus)="dateRangeTrigger.open()"
        (input)="onStartDateInput($event)"
        class="w-19 appearance-none outline-none text-sm placeholder:text-xs focus:outline-0" />
      <span class="flex items-center mx-1 text-gray-400 text-center">-</span>
      <input
        fiboInput
        name="endDate"
        type="text"
        [value]="dateRangeValue().endDate || ''"
        placeholder="YYYY-MM-DD"
        (focus)="dateRangeTrigger.open()"
        (input)="onEndDateInput($event)"
        class="w-full pl-1 appearance-none outline-none text-sm placeholder:text-xs focus:outline-0" />
    </div>
    <ng-template fiboPortalTemplate [(isOpen)]="dateRangeTrigger.isOpen">
      <fibo-calendar
        fiboPopover
        [trigger]="dateRangeTrigger"
        class="fibo-popover rounded-md"
        [(fiboCalendarDateRangeSelectionModel)]="calendarDateRange"
        (optionTriggered)="dateRangeTrigger.close()"
              />
            </ng-template>
          </fibo-form-field>
        </form>
```

