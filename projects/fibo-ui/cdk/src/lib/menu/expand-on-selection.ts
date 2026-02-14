import { contentChildren, Directive, effect, inject } from '@angular/core';
import { Option } from '../data-list/option.directive';
import { Expandable } from './expandable';

/**
 * Directive that automatically expands when any descendant Option is selected.
 *
 * **Requirements:**
 * - Host element must have `fiboExpandable` directive
 * - Works with any SelectionModel (RouterSelectOne, SelectOne, SelectMulti, etc.)
 *
 * Usage:
 * ```html
 * <div fiboExpandable fiboExpandOnSelection>
 *   <div fiboOption [value]="1">Option 1</div>
 *   <div fiboOption [value]="2">Option 2</div>
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
  private options = contentChildren(Option, { descendants: true });

  constructor() {
    effect(() => {
      if (this.options().some(opt => opt.isSelected())) {
        this.expandable.expanded.set(true);
      }
    });
  }
}
