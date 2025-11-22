import {Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from "@angular/core/rxjs-interop";
import {User, usersChoices} from "../../common/form-data-example";
import {BasicSelectExampleComponent} from './content/basic-select-example';
import {FloatingLabelSelectExampleComponent} from './content/floating-label-example';
import {FixedLabelSelectExampleComponent} from './content/fixed-label-example';
import {CustomTemplateSelectExampleComponent} from './content/custom-template-example';
import {CustomComponentSelectExampleComponent} from './content/user-select-wrapper';
import {StylesStatesSelectExampleComponent} from './content/styles-states-example';

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BasicSelectExampleComponent,
    CustomTemplateSelectExampleComponent,
    CustomComponentSelectExampleComponent,
    StylesStatesSelectExampleComponent,

  ],
  templateUrl: './select-page.html',
})
export class SelectPageComponent {

}
