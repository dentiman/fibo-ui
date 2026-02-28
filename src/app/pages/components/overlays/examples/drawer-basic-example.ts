import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FiboDrawer } from '@fibo-ui/components';
import { PopoverTriggerClick } from '@fibo-ui/cdk';

@Component({
  selector: 'drawer-basic-example',
  imports: [PopoverTriggerClick, FiboDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <button class="btn btn-primary" fiboPopoverTriggerClick overlayCategory="dialog" [content]="content">
        Open Drawer
      </button>

      <ng-template #content>
        <fibo-drawer>
          <div class="flex h-full flex-col p-6">
            <h2 class="text-lg font-semibold mb-4">Drawer Title</h2>
            <p class="text-sm text-muted">Drawer content goes here.</p>
          </div>
        </fibo-drawer>
      </ng-template>
    </div>
  `,
})
export class DrawerBasicExample {}
