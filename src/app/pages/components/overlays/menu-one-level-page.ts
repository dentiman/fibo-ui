import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataList,
  DataListItem,
  Popover,
  PopoverTriggerToggle,
  PortalContent,
} from '@fibo-ui/cdk';
import { RouterLink } from '@angular/router';
import { UsageDemo } from '../../../common/usage-demo';

@Component({
  selector: 'app-menu-one-level-page',
  standalone: true,
  imports: [
    CommonModule,
    PopoverTriggerToggle,
    Popover,
    PortalContent,
    DataList,
    DataListItem,
    RouterLink,
    UsageDemo,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 flex flex-col space-y-12">
      <h2 class="text-foreground">Menu One Level</h2>

      <app-usage-demo [codeBlocks]="codeBlocks">
        <div class="mx-auto w-90 p-8">
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
        </div>
      </app-usage-demo>
    </div>
  `
})
export class MenuOneLevelPageComponent {
  readonly codeBlocks = [
    { name: 'html', path: '/documentation/menu-one-level/menu-one-level.html.md' }
  ];
}
