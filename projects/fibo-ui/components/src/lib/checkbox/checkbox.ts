import {Component, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrimitiveValueAccessor} from '../common/primitive-value-accessor';

@Component({
  selector: 'sui-checkbox',
  imports: [CommonModule],
  templateUrl: './checkbox.html',
  hostDirectives: [
    {
      directive: PrimitiveValueAccessor,
      inputs: ['value: checked', 'disabled'],
      outputs: ['valueChange: checkedChange'],
    }
  ],
  host: {
    'role': 'checkbox',
    '[attr.aria-checked]': 'getAriaChecked()',
    '(click)': 'onClick()',
    '(blur)': 'cva.onTouched()',
    '(keydown.space)': 'onKeydown($event)',
    '(keydown.enter)': 'onKeydown($event)',
    'tabindex': '0',
    '[style.pointer-events]': 'cva.disabled() ? "none" : "auto"',
    '[attr.aria-disabled]': 'cva.disabled()',
    'class': `
     flex items-center gap-2 cursor-pointer
      aria-disabled:opacity-50 aria-disabled:cursor-not-allowed
    `
  }
})
export class Checkbox {

  isLoading = input(false);
  indeterminate = input(false);

  protected cva = inject<PrimitiveValueAccessor<boolean>>(PrimitiveValueAccessor);

  checked = this.cva.value;

  getAriaChecked(): string | boolean {
    if (this.indeterminate()) {
      return 'mixed';
    }
    return this.checked() ?? false;
  }

  onClick() {
    if(!this.cva.disabled()) {
      const newValue = !this.checked();
      this.checked.set(newValue);
    }
  }

  onKeydown(event: Event) {
    event.preventDefault();
    this.onClick();
  }

}
