import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PopoverTrigger } from '@fibo-ui/cdk';
import { Button } from '@fibo-ui/components';

@Component({
  selector: 'cdk-popover-trigger-example',
  imports: [PopoverTrigger, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-6">
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" fiboButton fiboAppearance="primary" fiboPopoverTrigger [content]="popoverTpl">
          Open Popover
        </button>

        <button
          #ref="PopoverTrigger"
          type="button"
          fiboButton fiboAppearance="secondary"
          fiboPopoverTrigger
          placement="bottom-start"
          [content]="actionsTpl"
        >
          With actions
        </button>
      </div>

      <ng-template #popoverTpl>
        <div class="w-64 p-3">
          <p class="text-sm font-medium">Popover content</p>
          <p class="mt-1 text-sm text-foreground-secondary">
            Closes on outside click, Escape, or focus leave.
          </p>
        </div>
      </ng-template>

      <ng-template #actionsTpl>
        <div class="w-48">
          <button type="button" class="block w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-background-secondary" (click)="ref.close()">
            Action one
          </button>
          <button type="button" class="block w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-background-secondary" (click)="ref.close()">
            Action two
          </button>
        </div>
      </ng-template>
    </section>
  `,
})
export class CdkPopoverTriggerExample {}
