import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { DrawerTrigger } from '@fibo-ui/cdk';

@Component({
  selector: 'drawer-basic-example',
  imports: [DrawerTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <button #drawerTrigger="DrawerTrigger" class="btn btn-primary" fiboDrawerTrigger [content]="drawerTpl">
        Open Drawer
      </button>

      <ng-template #drawerTpl>
        <div class="flex h-full flex-col p-6">
          <h2 class="mb-4 text-lg font-semibold">Drawer Title</h2>
          <p class="text-sm text-muted">Drawer content goes here.</p>
          <div class="mt-6">
            <button class="btn btn-primary" (click)="drawerTrigger.close()">Close Drawer</button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class DrawerBasicExample {}
