import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicCheckboxExampleComponent} from './content/basic-checkbox-example';
import {FormControlCheckboxExampleComponent} from './content/form-control-checkbox-example';

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [
    CommonModule,
    BasicCheckboxExampleComponent,
    FormControlCheckboxExampleComponent,
  ],
  templateUrl: './checkbox-page.html',
})
export class CheckboxPageComponent {

}
