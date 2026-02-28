import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Popover, PopoverTriggerToggle } from '@fibo-ui/cdk';

@Component({
  selector: 'cdk-popover-placements-example',
  imports: [PopoverTriggerToggle, Popover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-10">
      <div class="flex justify-center items-center gap-3 flex-wrap">
        <button type="button" fiboPopoverTriggerToggle [contentTemplate]="topTpl" class="btn btn-secondary">
          top
        </button>
        <ng-template #topTpl let-trigger>
          <div fiboPopover [trigger]="trigger" placement="top" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>top</strong>
          </div>
        </ng-template>

        <button type="button" fiboPopoverTriggerToggle [contentTemplate]="topStartTpl" class="btn btn-secondary">
          top-start
        </button>
        <ng-template #topStartTpl let-trigger>
          <div fiboPopover [trigger]="trigger" placement="top-start" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>top-start</strong>
          </div>
        </ng-template>

        <button type="button" fiboPopoverTriggerToggle [contentTemplate]="bottomTpl" class="btn btn-secondary">
          bottom
        </button>
        <ng-template #bottomTpl let-trigger>
          <div fiboPopover [trigger]="trigger" placement="bottom" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>bottom</strong>
          </div>
        </ng-template>

        <button type="button" fiboPopoverTriggerToggle [contentTemplate]="bottomEndTpl" class="btn btn-secondary">
          bottom-end
        </button>
        <ng-template #bottomEndTpl let-trigger>
          <div fiboPopover [trigger]="trigger" placement="bottom-end" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>bottom-end</strong>
          </div>
        </ng-template>

        <button type="button" fiboPopoverTriggerToggle [contentTemplate]="rightTpl" class="btn btn-secondary">
          right
        </button>
        <ng-template #rightTpl let-trigger>
          <div fiboPopover [trigger]="trigger" placement="right" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>right</strong>
          </div>
        </ng-template>

        <button type="button" fiboPopoverTriggerToggle [contentTemplate]="leftTpl" class="btn btn-secondary">
          left
        </button>
        <ng-template #leftTpl let-trigger>
          <div fiboPopover [trigger]="trigger" placement="left" [offset]="8"
               class="popover-container px-3 py-2 text-sm">
            placement: <strong>left</strong>
          </div>
        </ng-template>
      </div>
    </section>
  `,
})
export class CdkPopoverPlacementsExample {}
