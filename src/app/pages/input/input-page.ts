import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputExampleComponent} from './content/input-example';

@Component({
  selector: 'app-input-page',
  standalone: true,
  imports: [
    CommonModule,
    InputExampleComponent,
  ],
  templateUrl: './input-page.html',
})
export class InputPageComponent {

}
