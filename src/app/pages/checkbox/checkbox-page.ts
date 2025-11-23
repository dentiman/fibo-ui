import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicCheckboxExampleComponent} from './content/basic-checkbox-example';
import {CheckboxExampleComponent} from './content/checkbox-example';

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [
    CommonModule,
    BasicCheckboxExampleComponent,
    CheckboxExampleComponent,
  ],
  templateUrl: './checkbox-page.html',
})
export class CheckboxPageComponent {

}
