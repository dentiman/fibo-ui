import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataList, DataListItem, DataListKeyboardBridge, KeyboardTarget, Popover, PopoverTriggerToggle } from '@fibo-ui/cdk';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'menu-one-level-example',
  imports: [PopoverTriggerToggle, Popover, DataList, DataListKeyboardBridge, DataListItem, KeyboardTarget, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-90 p-8">
      <button type="button" class="btn btn-primary" fiboKeyboardTarget #keyboardTarget="KeyboardTarget" fiboPopoverTriggerToggle [content]="menuTpl">
        Menu (1 level)
      </button>
      <ng-template #menuTpl let-trigger>
        <div
          fiboPopover
          #popover="Popover"
          fiboDataList [fiboDataListKeyboardBridge]="keyboardTarget"
          (itemTriggered)="popover.close()"
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
