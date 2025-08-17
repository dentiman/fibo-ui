import {computed, contentChildren, Directive, ElementRef, inject, input, output} from '@angular/core';
import {FormFieldContent, PrimitiveValueAccessor} from '@fibo-ui/components';

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

  inputs = contentChildren(FormFieldContent)


}
