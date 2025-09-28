import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicMultipleSelectExampleComponent} from './content/basic-multiple-select-example';
import {FloatingLabelMultipleSelectExampleComponent} from './content/floating-label-example';
import {FixedLabelMultipleSelectExampleComponent} from './content/fixed-label-example';
import {CustomTemplateMultipleSelectExampleComponent} from './content/custom-template-example';
import {SearchableMultipleSelectExampleComponent} from './content/searchable-multiple-select-example';

@Component({
  selector: 'app-multiple-select-page',
  standalone: true,
  imports: [
    CommonModule,
    BasicMultipleSelectExampleComponent,
    FloatingLabelMultipleSelectExampleComponent,
    FixedLabelMultipleSelectExampleComponent,
    CustomTemplateMultipleSelectExampleComponent,
    SearchableMultipleSelectExampleComponent,
  ],
  templateUrl: './multiple-select-page.html',
})
export class MultipleSelectPageComponent {

}
