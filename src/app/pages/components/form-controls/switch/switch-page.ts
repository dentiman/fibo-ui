import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicSwitchExampleComponent} from './content/basic-switch-example';
import {SwitchSizesExampleComponent} from './content/switch-sizes-example';
import {SwitchExampleComponent} from './content/switch-example';

@Component({
  selector: 'app-switch-page',
  standalone: true,
  imports: [
    CommonModule,
    BasicSwitchExampleComponent,
    SwitchSizesExampleComponent,
    SwitchExampleComponent,
  ],
  template: `
<div class="px-4 flex flex-col space-y-12">
  <app-switch-basic></app-switch-basic>
  <app-switch-sizes></app-switch-sizes>
  <app-switch></app-switch>
</div>
  `,
})
export class SwitchPageComponent {

}
