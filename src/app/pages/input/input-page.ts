import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicInputExampleComponent} from './content/basic-input-example';
import {StylesStatesInputExampleComponent} from './content/label-input-example';

@Component({
  selector: 'app-input-page',
  standalone: true,
  imports: [
    CommonModule,
    BasicInputExampleComponent,
    StylesStatesInputExampleComponent,
  ],
  templateUrl: './input-page.html',
})
export class InputPageComponent {

}
