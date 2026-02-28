import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Popover, PopoverTriggerToggle } from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'cdk-popover-info-card-example',
  imports: [PopoverTriggerToggle, Popover, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-6 flex gap-4 items-center">
      <button type="button" #triggerRef="PopoverTrigger" fiboPopoverTriggerToggle [content]="cardTpl"
              class="btn btn-secondary flex items-center gap-2">
        <lucide-icon name="user" size="16" />
        Alex Johnson
      </button>
      <ng-template #cardTpl let-trigger>
        <div fiboPopover placement="bottom-start" [offset]="8"
             class="popover-container p-4 w-72 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <lucide-icon name="user" size="18" class="text-primary" />
            </div>
            <div class="min-w-0">
              <div class="font-semibold text-sm">Alex Johnson</div>
              <div class="text-xs text-foreground-secondary truncate">alex@company.io</div>
            </div>
          </div>
          <hr class="border-border-primary" />
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex items-center gap-2 text-foreground-secondary">
              <lucide-icon name="briefcase" size="14" class="shrink-0" />
              <span>Senior Frontend Engineer</span>
            </div>
            <div class="flex items-center gap-2 text-foreground-secondary">
              <lucide-icon name="map-pin" size="14" class="shrink-0" />
              <span>Berlin, Germany</span>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-primary w-full" (click)="trigger.close()">
            View Profile
          </button>
        </div>
      </ng-template>
      <span class="text-sm text-foreground-secondary">{{ triggerRef.isOpen() ? 'Open' : 'Closed' }}</span>
    </section>
  `,
})
export class CdkPopoverInfoCardExample {}
