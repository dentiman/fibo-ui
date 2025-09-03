import {Component, input} from '@angular/core';
import {AsyncPipe, JsonPipe} from "@angular/common";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form-actions',
  standalone: true,
  template: `
    <ng-content></ng-content>

    <div class="py-3 flex gap-x-2">
      <button  (click)="setDisabled()">Disable</button>
      <button  (click)="setEnabled()">Enable</button>
    </div>

    Control value : {{ ctrl().value | json}}<br />
    Errors: {{ ctrl().errors | json }}<br />
    Invalid: {{ ctrl().invalid | json }}<br />
    Dirty: {{ ctrl().dirty | json }}<br />
    Touched: {{ ctrl().touched | json }}<br />
  `,
  imports: [AsyncPipe, JsonPipe],
})
export class FormActionsComponent {
  setDisabled() {
    this.ctrl().disable();
  }
  
  setEnabled() {
    this.ctrl().enable();
  }

  ctrl = input.required<AbstractControl>();
}
