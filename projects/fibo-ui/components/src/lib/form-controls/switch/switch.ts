import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';
import { LoadingSpin } from '../../loading-spin/loading-spin';

@Component({
  selector: 'fibo-switch',
  imports: [LoadingSpin],
  templateUrl: './switch.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-checked]': 'checked() || null',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.data-size]': 'size()',
    '[attr.data-loading]': 'isLoading() || null',
  },
})
export class Switch implements FormCheckboxControl {
  checked = model<boolean>(false);
  isLoading = input(false);
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
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
