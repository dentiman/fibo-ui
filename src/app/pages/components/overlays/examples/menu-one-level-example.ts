import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataList, DataListItem, Popover, PopoverTriggerToggle, PortalContent } from '@fibo-ui/cdk';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'menu-one-level-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent, DataList, DataListItem, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <button type="button" #trigger="PopoverTrigger" class="btn btn-primary" fiboPopoverTriggerToggle>
        Menu (1 level)
      </button>

      <ng-template fiboPortalContent [(isOpen)]="trigger.isOpen">
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
    </div>
  `,
})
export class MenuOneLevelExample {}
