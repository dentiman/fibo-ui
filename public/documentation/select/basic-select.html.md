```html

<button type="button" fiboFormFieldTrigger [field]="userForm.role"
        class="w-full group fibo-form-field px-3 py-1 flex flex-col justify-center relative text-left">
    <label class="block text-xs fibo-form-field-label">User Role</label>
    @let role = user().role;
    <div class="text-sm" [class.from-field-placeholder]="!role">{{ role || 'Select Role' }}</div>
    <div class="absolute right-0 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2">
        <lucide-icon name="chevron-down" size="16" class="text-foreground-tertiary"></lucide-icon>
    </div>

    <div *fiboPortalContent="let trigger"
         fiboPopover [trigger]="trigger" [matchWidth]="true"
         fiboDataList (optionTriggered)="trigger.close()"
         fiboSelectOne [(value)]="userForm.role().value"
         class="popover-container py-1 px-1 rounded-md">
        <div class="max-h-70 overflow-y-auto">
            @for (role of userRoles; track role) {
            <a fiboOption [value]="role"
               class="datalist-item py-1 px-2 rounded-md relative group text-sm">
                <span class="block truncate font-normal">{{ role }}</span>
            </a>
            }
        </div>
    </div>
</button>
```

