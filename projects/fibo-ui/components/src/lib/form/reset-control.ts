import {Component, Input, output} from '@angular/core';
import {AbstractControl, FormControl, NgControl} from '@angular/forms';
import {IsEmptyPipe} from '@fibo-ui/cdk';
import {AsyncPipe, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'fibo-reset-control',
  imports: [
    IsEmptyPipe,
    AsyncPipe,
    NgTemplateOutlet
  ],
  templateUrl: './reset-control.html',
  host: {
    class: ''
  }
})
export class ResetControl {
  @Input({ required: true }) control!: NgControl|null;

  reset = output()

  onReset() {
    this.control?.reset();
     this.reset.emit();
    this.control?.control?.markAsTouched();
  }
}
