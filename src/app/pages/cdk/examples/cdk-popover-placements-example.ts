import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Popover, PopoverTriggerToggle, PortalContent } from '@fibo-ui/cdk';

@Component({
  selector: 'cdk-popover-placements-example',
  imports: [PopoverTriggerToggle, Popover, PortalContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-10">
      <div class="flex justify-center items-center gap-3 flex-wrap">
        <button type="button" fiboPopoverTriggerToggle class="btn btn-secondary">
          top
          <div *fiboPortalContent="let trigger" fiboPopover [trigger]="trigger" placement="top" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>top</strong>
          </div>
        </button>
        <button type="button" fiboPopoverTriggerToggle class="btn btn-secondary">
          top-start
          <div *fiboPortalContent="let trigger" fiboPopover [trigger]="trigger" placement="top-start" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>top-start</strong>
          </div>
        </button>
        <button type="button" fiboPopoverTriggerToggle class="btn btn-secondary">
          bottom
          <div *fiboPortalContent="let trigger" fiboPopover [trigger]="trigger" placement="bottom" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>bottom</strong>
          </div>
        </button>
        <button type="button" fiboPopoverTriggerToggle class="btn btn-secondary">
          bottom-end
          <div *fiboPortalContent="let trigger" fiboPopover [trigger]="trigger" placement="bottom-end" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>bottom-end</strong>
          </div>
        </button>
        <button type="button" fiboPopoverTriggerToggle class="btn btn-secondary">
          right
          <div *fiboPortalContent="let trigger" fiboPopover [trigger]="trigger" placement="right" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>right</strong>
          </div>
        </button>
        <button type="button" fiboPopoverTriggerToggle class="btn btn-secondary">
          left
          <div *fiboPortalContent="let trigger" fiboPopover [trigger]="trigger" placement="left" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>left</strong>
          </div>
        </button>
      </div>
    </section>
  `,
})
export class CdkPopoverPlacementsExample {}
