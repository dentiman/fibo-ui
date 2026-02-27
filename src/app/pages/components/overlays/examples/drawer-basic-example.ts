import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawerTrigger } from '@fibo-ui/components';

@Component({
  selector: 'drawer-basic-example',
  imports: [DrawerTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <button class="btn btn-primary" [fiboDrawerTrigger]="content">Open Drawer</button>

      <ng-template #content>
        <div class="flex h-full flex-col p-6">
          <h2 class="text-lg font-semibold mb-4">Drawer Title</h2>
          <p class="text-sm text-muted">Drawer content goes here.</p>
        </div>
      </ng-template>
    </div>
  `,
})
export class DrawerBasicExample {}
