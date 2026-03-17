import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FiboDrawer } from '@fibo-ui/components';
import { DialogTrigger } from '@fibo-ui/cdk';

@Component({
  selector: 'drawer-basic-example',
  imports: [FiboDrawer, DialogTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <button #drawerTrigger="DialogTrigger" class="btn btn-primary" fiboDialogTrigger [content]="drawerTpl">
        Open Drawer
      </button>

      <ng-template #drawerTpl>
        <fibo-drawer>
          <div class="flex h-full flex-col p-6">
            <h2 class="text-lg font-semibold mb-4">Drawer Title</h2>
            <p class="text-sm text-muted">Drawer content goes here.</p>
            <div class="mt-6">
              <button class="btn btn-primary" (click)="drawerTrigger.close()">Close Drawer</button>
            </div>
          </div>
        </fibo-drawer>
      </ng-template>
    </div>
  `,
})
export class DrawerBasicExample {}
