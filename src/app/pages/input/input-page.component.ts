import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormActionsComponent} from '../../common/form-actions.component';
import {Input} from '@spacy-ui/components';

@Component({
  selector: 'app-input',
  imports: [
    FormActionsComponent,
    Input,
    ReactiveFormsModule
  ],
  templateUrl: './input-page.component.html',
})
export class InputPageComponent {
  ctrl = new FormControl('Austin', { validators: Validators.required });
}
