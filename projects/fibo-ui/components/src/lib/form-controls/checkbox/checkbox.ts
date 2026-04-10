import {ChangeDetectionStrategy, Component, input, model, ViewEncapsulation} from '@angular/core';
import {FormCheckboxControl} from '@angular/forms/signals';

@Component({
  selector: 'fibo-checkbox',
  templateUrl: './checkbox.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'group flex items-center'
  }
})
export class Checkbox implements FormCheckboxControl {

  /** Whether the checkbox is checked */
  checked = model<boolean>(false);

  indeterminate = input(false);
  readonly = input(false);
  disabled = input<boolean>(false);
  touched = model<boolean>(false);

  onInputChange(event: Event) {
    if (this.disabled()) return;
    const inputEl = event.target as HTMLInputElement;
    this.checked.set(inputEl.checked);
  }

  onBlur() {
    this.touched.set(true);
  }

}
