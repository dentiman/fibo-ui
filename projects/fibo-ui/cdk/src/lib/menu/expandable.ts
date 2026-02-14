import { Directive, model } from '@angular/core';

/**
 * Directive that provides expandable state management for menu items.
 *
 * Provides:
 * - `expanded` signal model for two-way binding
 * - `toggle()` method to flip the expanded state
 * - `aria-expanded` attribute for accessibility
 *
 * Usage:
 * ```html
 * <div fiboExpandable [(expanded)]="isExpanded">
 *   <button (click)="expandable.toggle()">Toggle</button>
 *   @if (expandable.expanded()) {
 *     <div>Expandable content</div>
 *   }
 * </div>
 * ```
 */
@Directive({
  selector: '[fiboExpandable]',
  exportAs: 'expandable',
  host: {
    '[attr.aria-expanded]': 'expanded() || null',
  },
})
export class Expandable {
  /**
   * Signal model for the expanded state.
   * Can be used with two-way binding: [(expanded)]="value"
   */
  expanded = model(false);

  /**
   * Toggles the expanded state.
   */
  toggle = () => this.expanded.set(!this.expanded());
}
