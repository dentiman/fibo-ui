import {Component, computed, inject, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import {FormField} from './form-field';

@Component({
  selector: 'fibo-field-label',
  imports: [],
  templateUrl: './field-label.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'fibo-form-field-label  text-xs  block',
  },
})
export class FieldLabel {
  protected formField = inject(FormField);
}

