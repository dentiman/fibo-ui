import {Component} from '@angular/core';
import {DialogTrigger} from '@fibo-ui/components';
import { FormExample } from '../form-controls/examples/form-example';

@Component({
  imports: [
    DialogTrigger,
    FormExample
  ],
  template: `
<button class="btn" [fiboDialogTrigger]="content">Open Dialog</button>

<ng-template #content>
  <div class="overflow-hidden overflow-y-auto">
    <form-example />
  </div>
</ng-template>

  `,
})
export class DialogPageComponent {}
