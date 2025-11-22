import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignalFormsInputExampleComponent} from './content/signal-forms-input-example';

@Component({
  selector: 'app-input-page',
  standalone: true,
  imports: [
    CommonModule,
    SignalFormsInputExampleComponent,
  ],
  templateUrl: './input-page.html',
})
export class InputPageComponent {

}
