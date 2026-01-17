```html
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
    <ng-template fiboPortalContent let-trigger>
      <fibo-calendar fiboPopover              [trigger]="trigger"
                     fiboCalendarDateRange    [(value)]="calendarDateRange"
                     class="fibo-popover rounded-md"
      />
    </ng-template>
  </div>
</form>
```

