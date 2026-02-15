import { Component } from '@angular/core';
import {ConfirmationTrigger} from '@fibo-ui/components';

@Component({
  selector: 'app-confirmation-page',
  imports: [ConfirmationTrigger],
  template: `
<button class="btn-primary"
        (confirm)="onConfirm()"
        >Confirm button</button>
  `,
})
export class ConfirmationPageComponent {

  onConfirm() {
    console.log('Confirmation');
  }

}
