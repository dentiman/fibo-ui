import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormActionsComponent} from '../../common/form-actions';
import {Input} from '@fibo-ui/components';

@Component({
  selector: 'app-input',
  imports: [
    FormActionsComponent,
    Input,
    ReactiveFormsModule
  ],
  templateUrl: './input-page.html',
})
export class InputPageComponent {
  ctrl = new FormControl('Austin');
}
