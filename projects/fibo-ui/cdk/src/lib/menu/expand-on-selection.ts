import { contentChildren, Directive, effect, inject } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { Expandable } from './expandable';

/**
 * Directive that automatically expands when any descendant DataListItem is selected.
 *
 * **Requirements:**
 * - Host element must have `fiboExpandable` directive
 * - Works with any SelectionModel (RouterSelectOne, SelectOne, SelectMulti, etc.)
 *
 * Usage:
 * ```html
 * <div fiboExpandable fiboExpandOnSelection>
 *   <div fiboDataListItem [value]="1">DataListItem 1</div>
 *   <div fiboDataListItem [value]="2">DataListItem 2</div>
 * </div>
 * ```
 *
 * When any option becomes selected, the expandable will automatically expand.
 */
@Directive({
  selector: '[fiboExpandOnSelection]',
})
export class ExpandOnSelection {
  private expandable = inject(Expandable);
  private options = contentChildren(DataListItem, { descendants: true });

  constructor() {
    effect(() => {
      if (this.options().some(opt => opt.isSelected())) {
        this.expandable.expanded.set(true);
      }
    });
  }
}
