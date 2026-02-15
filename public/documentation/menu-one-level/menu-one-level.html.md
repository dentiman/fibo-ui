```html
<button type="button"
        #trigger="PopoverTrigger"
        class="btn btn-primary"
        fiboPopoverTriggerToggle>
  Menu (1 level)
</button>

<ng-template fiboPortalContent [(isOpen)]="trigger.isOpen">
  <div fiboPopover [trigger]="trigger"
       fiboDataList (optionTriggered)="trigger.close()"
       class="popover-container min-w-40">
    <a fiboOption [routerLink]="'/'" class="datalist-item">
      Single Select
    </a>
    <a fiboOption [routerLink]="'/select-multiple'" class="datalist-item">
      Multiple Select
    </a>
    <a fiboOption [routerLink]="'/datepicker'" class="datalist-item">
      Datepicker
    </a>
  </div>
</ng-template>
```
