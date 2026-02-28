```html
<button class="btn btn-primary" fiboPopoverTriggerToggle>
  User Profile
  <ng-template fiboPortalContent let-trigger>
    <fibo-menu fiboPopover
               [trigger]="trigger"
               [items]="userProfileMenuItems"
               placement="bottom-start">
    </fibo-menu>
  </ng-template>
</button>
```
