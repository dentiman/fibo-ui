import {Directive, inject, input, TemplateRef} from '@angular/core';
import {Table} from './table';

export type FiboColumnContext<T, K extends keyof T> = {
  $implicit: T;
  value: T[K];
  key: K;
};

@Directive({
  selector: 'ng-template[fiboColumn]',
})
export class FiboColumn<T , K extends keyof T = keyof T> {
  // Column key to associate this cell template with
  fiboColumn = input.required<K>();
  // Optional human-readable column header
  fiboColumnHeader = input<string>('');
  fiboColumnThClass = input<string>('');
  fiboColumnTdClass = input<string>('');
  fiboColumnIsSortable = input<boolean>(false);

  // Optional data source to help type inference for the template context
  fiboColumnSource = input<readonly T[] | T[]>([]);
  templateRef = inject<TemplateRef<FiboColumnContext<T, K>>>(TemplateRef)

  static ngTemplateContextGuard<T , K extends keyof T>(
    dir: FiboColumn<T, K>,
    ctx: unknown
  ): ctx is FiboColumnContext<T, K> {
    return true;
  }
}


