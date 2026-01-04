```html
<fibo-form-field
  fiboPopoverTrigger
  #roleTrigger="PopoverTrigger"
  [field]="userForm.role"
  appendIcon="chevron-down">
  <fibo-field-label>User Role</fibo-field-label>
  @let role = user().role;
  <span class="text-sm" [class.from-field-placeholder]="!role">{{ role || 'Select Role' }}</span>

  <ng-template fiboPortalTemplate [(isOpen)]="roleTrigger.isOpen">
    <div fiboPopover
         fiboDataList
         class="fibo-popover py-1 px-1 rounded-md"
         [trigger]="roleTrigger"
         [matchWidth]="true"
         [(fiboSelectOne)]="userForm.role().value"
         (optionTriggered)="roleTrigger.close()">
      <div class="max-h-70 overflow-y-auto">
        @for (role of userRoles; track role) {
          <a [fiboListItemValue]="role"
             class="datalist-item py-1 px-2 rounded-md relative group text-sm">
            <span class="block truncate font-normal">{{ role }}</span>
          </a>
        }
      </div>
    </div>
  </ng-template>
</fibo-form-field>
```

