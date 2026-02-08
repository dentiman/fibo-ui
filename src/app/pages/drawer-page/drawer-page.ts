import {Component} from '@angular/core';
import {DrawerTrigger} from '@fibo-ui/components';
import {FormExamplePageComponent} from '../form-example-page/form-example-page';

@Component({
  imports: [
    DrawerTrigger,
    FormExamplePageComponent
  ],
  template: `
    <button class="btn" [fiboDrawerTrigger]="content">Open Drawer</button>

    <ng-template #content>
      <div class="overflow-hidden overflow-y-auto">
        <app-form-example-page></app-form-example-page>
      </div>
    </ng-template>
  `,
})
export class DrawerPageComponent {}
