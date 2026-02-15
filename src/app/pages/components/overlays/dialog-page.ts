import {Component} from '@angular/core';
import {DialogTrigger} from '@fibo-ui/components';
import {FormExamplePageComponent} from '../examples/form-example-page';

@Component({
  imports: [
    DialogTrigger,
    FormExamplePageComponent
  ],
  template: `
<button class="btn" [fiboDialogTrigger]="content">Open Dialog</button>

<ng-template #content>
  <div class="overflow-hidden overflow-y-auto">
    <app-form-example-page></app-form-example-page>
  </div>
</ng-template>

  `,
})
export class DialogPageComponent {}
