import { Directive, ElementRef, effect, inject, input, output, signal } from '@angular/core';
import {FormFieldContent} from '@fibo-ui/cdk';
import {MultipleSelect} from './multiple-select';

@Directive({
  selector: 'input[fiboMultipleSelectInput]',
  standalone: true,
  hostDirectives: [FormFieldContent],
  host: {
     class: 'fibo-input flex-1 w-full min-w-30 outline-0  appearance-none text-sm',
    '[placeholder]': 'placeholder()',
    '(focusin)': 'select.trigger()?.open()',
    '(keydown.backspace)': 'removeLastValue()',
    '(input)': 'onInput($event)',
    '[disabled]': 'select.disabled()'
  }
})
export class MultipleSelectInput {

  select = inject(MultipleSelect);

  private readonly elementRef = inject(ElementRef);

  placeholder = input<string>('');

  valueChange = output<string>();

  constructor() {

    // this.select.control.valueChanges.subscribe(() => {
    //   const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    //   inputElement.value = '';
    //   this.valueChange.emit('');
    // });

    // effect(() => {
    //  const  dataList =  this.select.dataList()
    //   if(dataList) {
    //     dataList.optionTriggered.subscribe(() => this.elementRef.nativeElement.focus())
    //   }
    // });
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.valueChange.emit(inputElement.value);
  }

  removeLastValue() {
    const inputElement = this.elementRef.nativeElement as HTMLInputElement;
    // Only remove last value if input is empty
    if (!inputElement.value) {
      const value = this.select.value();
      if (Array.isArray(value) && value.length > 0) {
        this.select.value.set(value.slice(0, -1));
      }
    }
  }
}
