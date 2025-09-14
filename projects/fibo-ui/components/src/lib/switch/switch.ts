import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {PrimitiveValueAccessor} from '@fibo-ui/cdk';
import {LoadingSpin} from '../loading-spin/loading-spin';

@Component({
  selector: 'fibo-switch',
  imports: [LoadingSpin],
  templateUrl: './switch.html',
  hostDirectives: [
    {
      directive: PrimitiveValueAccessor,
      inputs: ['value: checked', 'disabled'],
      outputs: ['valueChange: checkedChange'],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Switch {

  isLoading = input(false);
  size = input<'xs' | 'sm' | 'base' | 'lg' | 'xl'>('base');

  protected cva = inject<PrimitiveValueAccessor<boolean>>(PrimitiveValueAccessor);

  checked = this.cva.value;

  trackSize = computed(() => {
    return {
      xs: 'h-4 w-7',
      sm: 'h-5 w-9',
      base: 'h-6 w-11',
      lg: 'h-7 w-14',
      xl: 'h-8 w-16'
    }[this.size()];
  });

  thumbSize = computed(() => {
    return {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      base: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-7 w-7'
    }[this.size()];
  });

  checkedTranslate = computed(() => {
    return {
      xs: 'translate-x-3',
      sm: 'translate-x-4',
      base: 'translate-x-5',
      lg: 'translate-x-7',
      xl: 'translate-x-8'
    }[this.size()];
  });

  onInputChange(event: Event) {
    if (this.cva.disabled()) return;
    const inputEl = event.target as HTMLInputElement;
    this.checked.set(!!inputEl.checked);
  }

}
