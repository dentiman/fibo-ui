import { Component } from '@angular/core';
import {ConfirmationTrigger} from '@fibo-ui/components';

@Component({
  selector: 'app-confirmation-page',
  imports: [ConfirmationTrigger],
  templateUrl: './confirmation-page.component.html',
})
export class ConfirmationPageComponent {

  onConfirm() {
    console.log('Confirmation');
  }

}
