```html
<button #valueMenu="PopoverTrigger" class="btn" fiboPopoverTriggerToggle>
  Select Option: {{ selectedValue() || 'None' }}
  <ng-template fiboPortalContent let-trigger>
    <fibo-menu fiboPopover [items]="valueItems()"
               [trigger]="trigger"
               fiboSelectOne [(value)]="selectedValue"
               placement="bottom-start">
    </fibo-menu>
  </ng-template>
</button>
```
