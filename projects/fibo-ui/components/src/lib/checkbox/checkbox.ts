import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {PrimitiveValueAccessor} from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-checkbox',
  templateUrl: './checkbox.html',
  hostDirectives: [
    {
      directive: PrimitiveValueAccessor,
      inputs: ['value: checked', 'disabled'],
      outputs: ['valueChange: checkedChange'],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'flex items-center'
  }
})
export class Checkbox {

  isLoading = input(false);
  indeterminate = input(false);

  protected cva = inject<PrimitiveValueAccessor<boolean>>(PrimitiveValueAccessor);

  checked = this.cva.value;

  onInputChange(event: Event) {
    if (this.cva.disabled()) return;
    const inputEl = event.target as HTMLInputElement;
    this.checked.set(!!inputEl.checked);
  }

}
