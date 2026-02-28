```html
<button type="button"
        class="btn btn-primary"
        fiboPopoverTriggerToggle>
  Menu (1 level)
  <ng-template fiboPortalContent let-trigger>
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
</button>
```
