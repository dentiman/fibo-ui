import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicCheckboxExampleComponent} from './content/basic-checkbox-example';
import {SignalFormsCheckboxExampleComponent} from './content/signal-forms-checkbox-example';

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [
    CommonModule,
    BasicCheckboxExampleComponent,
    SignalFormsCheckboxExampleComponent,
  ],
  templateUrl: './checkbox-page.html',
})
export class CheckboxPageComponent {

}
