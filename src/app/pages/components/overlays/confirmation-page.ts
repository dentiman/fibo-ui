import { Component } from '@angular/core';
import { ConfirmationTrigger, Button } from '@fibo-ui/components';

@Component({
  selector: 'app-confirmation-page',
  imports: [ConfirmationTrigger, Button],
  template: `
<button fiboButton fiboAppearance="primary"
        fiboConfirm
        (confirm)="onConfirm()"
        >Confirm button</button>
  `,
})
export class ConfirmationPageComponent {

  onConfirm() {
    console.log('Confirmation');
  }

}
