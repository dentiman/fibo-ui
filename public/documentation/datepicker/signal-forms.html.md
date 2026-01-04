```html
<form class="space-y-4">
  <fibo-form-field
    fiboPopoverTrigger
    #dateTrigger="PopoverTrigger"
    [field]="userForm.birthDate"
    appendIcon="calendar-days">
    <fibo-field-label>Birth Date</fibo-field-label>
    <input
      fiboInput
      name="birthDate"
      type="text"
      [field]="userForm.birthDate"
      placeholder="YYYY-MM-DD"
      (focus)="dateTrigger.open()"
      class="w-full appearance-none outline-none text-sm focus:outline-0" />
    <ng-template fiboPortalContent [(isOpen)]="dateTrigger.isOpen">
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
```

