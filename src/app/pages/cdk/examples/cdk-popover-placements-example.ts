import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Popover, PopoverTriggerToggle, PortalContent } from '@fibo-ui/cdk';

@Component({
  selector: 'cdk-popover-placements-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-10">
      <div class="flex justify-center items-center gap-3 flex-wrap">
        <button type="button" #top="PopoverTrigger" fiboPopoverTriggerToggle class="btn btn-secondary">
          top
        </button>
        <button type="button" #topStart="PopoverTrigger" fiboPopoverTriggerToggle class="btn btn-secondary">
          top-start
        </button>
        <button type="button" #bottom="PopoverTrigger" fiboPopoverTriggerToggle class="btn btn-secondary">
          bottom
        </button>
        <button type="button" #bottomEnd="PopoverTrigger" fiboPopoverTriggerToggle class="btn btn-secondary">
          bottom-end
        </button>
        <button type="button" #right="PopoverTrigger" fiboPopoverTriggerToggle class="btn btn-secondary">
          right
        </button>
        <button type="button" #left="PopoverTrigger" fiboPopoverTriggerToggle class="btn btn-secondary">
          left
        </button>
      </div>

      <ng-template fiboPortalContent [(isOpen)]="top.isOpen">
        <div fiboPopover [trigger]="top" placement="top" [offset]="8"
             class="popover-container px-3 py-2 text-sm">
          placement: <strong>top</strong>
        </div>
      </ng-template>

      <ng-template fiboPortalContent [(isOpen)]="topStart.isOpen">
        <div fiboPopover [trigger]="topStart" placement="top-start" [offset]="8"
             class="popover-container px-3 py-2 text-sm">
          placement: <strong>top-start</strong>
        </div>
      </ng-template>

      <ng-template fiboPortalContent [(isOpen)]="bottom.isOpen">
        <div fiboPopover [trigger]="bottom" placement="bottom" [offset]="8"
             class="popover-container px-3 py-2 text-sm">
          placement: <strong>bottom</strong>
        </div>
      </ng-template>

      <ng-template fiboPortalContent [(isOpen)]="bottomEnd.isOpen">
        <div fiboPopover [trigger]="bottomEnd" placement="bottom-end" [offset]="8"
             class="popover-container px-3 py-2 text-sm">
          placement: <strong>bottom-end</strong>
        </div>
      </ng-template>

      <ng-template fiboPortalContent [(isOpen)]="right.isOpen">
        <div fiboPopover [trigger]="right" placement="right" [offset]="8"
             class="popover-container px-3 py-2 text-sm">
          placement: <strong>right</strong>
        </div>
      </ng-template>

      <ng-template fiboPortalContent [(isOpen)]="left.isOpen">
        <div fiboPopover [trigger]="left" placement="left" [offset]="8"
             class="popover-container px-3 py-2 text-sm">
          placement: <strong>left</strong>
        </div>
      </ng-template>
    </section>
  `,
})
export class CdkPopoverPlacementsExample {}
