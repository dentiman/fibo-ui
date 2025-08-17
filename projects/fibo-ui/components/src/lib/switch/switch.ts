import {Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrimitiveValueAccessor} from '../common/primitive-value-accessor';
import {LoadingSpin} from '../loading-spin/loading-spin';

@Component({
  selector: 'sui-switch,button[suiSwitch]',
  imports: [CommonModule, LoadingSpin],
  templateUrl: './switch.html',
  hostDirectives: [
    {
      directive: PrimitiveValueAccessor,
      inputs: ['value: checked', 'disabled'],
      outputs: ['valueChange: checkedChange'],
    }
  ],
  host: {
    'role': 'switch',
    '[attr.aria-checked]': 'checked()',
    '(click)': 'onClick()',
    '(blur)': 'cva.onTouched()',
    '(keydown.space)': 'onKeydown($event)',
    '(keydown.enter)': 'onKeydown($event)',
    'tabindex': '0',
    '[style.pointer-events]': 'cva.disabled() ? "none" : "auto"',
    '[attr.aria-disabled]': 'cva.disabled()',
    '[class]': 'containerClasses()'
  }
})
export class Switch {

  isLoading = input(false);
  size = input<'xs' | 'sm' | 'base' | 'lg' | 'xl'>('base');

  protected cva = inject<PrimitiveValueAccessor<boolean>>(PrimitiveValueAccessor);

  checked = this.cva.value;

  containerClasses = computed(() => {
    const baseClasses = 'bg-gray-200 aria-checked:bg-primary-600 aria-disabled:opacity-50 relative inline-flex flex-shrink-0 cursor-pointer aria-disabled:cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-600 focus-visible:ring-offset-1';

    const sizeClasses = {
      xs: 'h-4 w-7',
      sm: 'h-5 w-9',
      base: 'h-6 w-11',
      lg: 'h-7 w-14',
      xl: 'h-8 w-16'
    };

    return `${baseClasses} ${sizeClasses[this.size()]}`;
  });

  thumbSizeClasses = computed(() => {
    const sizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      base: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-7 w-7'
    };

    return sizeClasses[this.size()];
  });

  thumbClasses = computed(() => {
    const baseClasses = 'pointer-events-none relative inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out';

    const transformClasses = {
      xs: 'translate-x-3',
      sm: 'translate-x-4',
      base: 'translate-x-5',
      lg: 'translate-x-7',
      xl: 'translate-x-8'
    };

    const transform = this.checked() ? transformClasses[this.size()] : 'translate-x-0';

    return `${baseClasses} ${this.thumbSizeClasses()} ${transform}`;
  });

  onClick() {
    if(!this.cva.disabled()) {
      const newValue = !this.checked();
      this.checked.set(newValue);
      // this.cva.onChange(newValue);
    }
  }

  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
    this.onClick();
  }

}
