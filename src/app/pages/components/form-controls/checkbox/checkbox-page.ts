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
  template: `
<div class="px-4 flex flex-col space-y-12">
  <app-checkbox-basic></app-checkbox-basic>
  <app-checkbox></app-checkbox>
</div>
  `,
})
export class CheckboxPageComponent {

}
