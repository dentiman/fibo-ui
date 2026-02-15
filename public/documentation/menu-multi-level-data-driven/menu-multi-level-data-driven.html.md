```html
<button #trigger="PopoverTrigger" class="btn btn-primary" fiboPopoverTriggerToggle>
  User Profile
</button>

<ng-template fiboPortalContent [(isOpen)]="trigger.isOpen">
  <fibo-menu fiboPopover
             [trigger]="trigger"
             [items]="userProfileMenuItems"
             placement="bottom-start">
  </fibo-menu>
</ng-template>
```
