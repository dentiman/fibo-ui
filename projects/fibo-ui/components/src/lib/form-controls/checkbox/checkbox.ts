import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'fibo-checkbox',
  templateUrl: './checkbox.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-checked]': 'checked() || null',
    '[attr.data-indeterminate]': 'indeterminate() || null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-readonly]': 'readonly() || null',
  },
})
export class Checkbox implements FormCheckboxControl {
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
