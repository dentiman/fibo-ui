```html
<button #valueMenu="PopoverTrigger" class="btn" fiboPopoverTriggerToggle>
  Select Option: {{ selectedValue() || 'None' }}
</button>
<ng-template [(isOpen)]="valueMenu.isOpen" fiboPortalTemplate>
  <fibo-menu [items]="valueItems()"
             [trigger]="valueMenu"
             [(fiboSelectOne)]="selectedValue"
             placement="bottom-start">
  </fibo-menu>
</ng-template>
```
