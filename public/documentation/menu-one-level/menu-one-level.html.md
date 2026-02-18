```html
<button type="button"
        #trigger="PopoverTrigger"
        class="btn btn-primary"
        fiboPopoverTriggerToggle>
  Menu (1 level)
</button>

<ng-template fiboPortalContent [(isOpen)]="trigger.isOpen">
  <div fiboPopover [trigger]="trigger"
       fiboDataList (itemTriggered)="trigger.close()"
       class="popover-container min-w-40">
    <a fiboDataListItem [routerLink]="'/'" class="datalist-item">
      Single Select
    </a>
    <a fiboDataListItem [routerLink]="'/select-multiple'" class="datalist-item">
      Multiple Select
    </a>
    <a fiboDataListItem [routerLink]="'/datepicker'" class="datalist-item">
      Datepicker
    </a>
  </div>
</ng-template>
```
