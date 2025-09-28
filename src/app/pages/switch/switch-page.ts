import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicSwitchExampleComponent} from './content/basic-switch-example';
import {SwitchSizesExampleComponent} from './content/switch-sizes-example';

@Component({
  selector: 'app-switch-page',
  standalone: true,
  imports: [
    CommonModule,
    BasicSwitchExampleComponent,
    SwitchSizesExampleComponent,
  ],
  templateUrl: './switch-page.html',
})
export class SwitchPageComponent {

}
