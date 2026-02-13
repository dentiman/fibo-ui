```html

<form class="space-y-4">
    <div fiboFormField fiboPopoverTriggerClick class="group form-field-control relative">
        <label class="form-field-label">Birth Date</label>
        <input
                type="text"
                [field]="userForm.birthDate"
                placeholder="YYYY-MM-DD"
                class="w-full appearance-none outline-none text-sm focus:outline-0"/>
        <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2">
            <lucide-icon name="calendar-days" size="16" class="text-foreground-tertiary"></lucide-icon>
        </div>
        <ng-template fiboPortalContent let-trigger>
            <fibo-calendar fiboPopover [trigger]="trigger"
                           fiboSelectDate [(value)]="userForm.birthDate().value"
                           (optionTriggered)="trigger.close()"
                           class="popover-container rounded-md"
            />
        </ng-template>
    </div>
</form>
```

