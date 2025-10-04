import {computed, contentChildren, Directive, ElementRef, inject, input, output} from '@angular/core';
import {PrimitiveValueAccessor} from '../../common/primitive-value-accessor';
import {FormFieldContent} from './form-field-content';


export type FormFieldAppearance = 'basic' | 'secondary' | 'clear';

@Directive({
  hostDirectives: [
    {
      directive: PrimitiveValueAccessor,
      inputs: ['value', 'disabled'],
      outputs: ['valueChange'],
    }
  ],
  host: {
    class: 'relative block w-full group',
  }
})
export class FormFieldControl<T> {
  element = inject(ElementRef)

  cva = inject<PrimitiveValueAccessor<T>>(PrimitiveValueAccessor);
  placeholder = input<string>('');

  floatingLabel = input<string | null>(null, {alias: 'label'});
  fixedLabel = input<string | null>(null);
  label = computed(()=> this.floatingLabel() || this.fixedLabel());

  appearance = input<FormFieldAppearance>('basic');

  inputs = contentChildren(FormFieldContent)


}
