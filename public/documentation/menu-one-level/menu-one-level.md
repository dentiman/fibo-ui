# Menu One Level

Simple dropdown menu built with `DataList` for keyboard navigation and accessibility.

## Basic Usage

:::example menu-one-level

```html {example="menu-one-level"}
<button type="button" class="btn btn-primary" fiboPopoverTriggerToggle>
  Menu (1 level)
  <ng-template fiboPortalContent let-trigger>
    <div
      fiboPopover [trigger]="trigger"
      fiboDataList (itemTriggered)="trigger.close()"
      class="popover-container min-w-40"
    >
      <a fiboDataListItem [routerLink]="'/'" class="datalist-item">Single Select</a>
      <a fiboDataListItem [routerLink]="'/select-multiple'" class="datalist-item">Multiple Select</a>
      <a fiboDataListItem [routerLink]="'/datepicker'" class="datalist-item">Datepicker</a>
    </div>
  </ng-template>
</button>
```

```ts {example="menu-one-level"}
@Component({
  selector: 'menu-one-level-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent, DataList, DataListItem, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '...',
})
export class MenuOneLevelExample {}
```
