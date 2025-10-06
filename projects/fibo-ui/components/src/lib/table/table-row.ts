import {contentChildren, Directive, inject, TemplateRef} from '@angular/core';
import {FiboColumn} from './column';

@Directive({
  selector: '[fiboTableRow]'
})
export class FiboTableRow<T> {
  templateRef = inject<TemplateRef<unknown>>(TemplateRef)
  columns = contentChildren(FiboColumn as any, { descendants: true }) as unknown as () => readonly FiboColumn<T, keyof T>[];

}


