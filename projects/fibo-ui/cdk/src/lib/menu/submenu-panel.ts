import { DestroyRef, Directive, inject, InjectionToken, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';
import { DataList } from '../data-list/data-list';
import { SubmenuTrigger } from './submenu-trigger';

/**
 * Injection token for parent SubmenuPanel.
 * Used by SubmenuTrigger to register itself.
 */
export const SUBMENU_PANEL = new InjectionToken<SubmenuPanel>('SubmenuPanel');

/**
 * Directive that coordinates popover submenu behavior.
 *
 * Features:
 * - Instant close when active item changes
 * - Debounced open after configurable delay (default 300ms)
 * - Manages registry of child SubmenuTrigger directives
 * - Includes DataList as hostDirective
 *
 * Usage:
 * ```html
 * <div fiboSubmenuPanel [trigger]="menuTrigger" [openDelay]="300">
 *   <button fiboSubmenuTrigger>Item with submenu</button>
 * </div>
 * ```
 */
@Directive({
  selector: '[fiboSubmenuPanel]',
  hostDirectives: [
    {
      directive: DataList,
      inputs: ['trigger'],
    },
  ],
  providers: [{ provide: SUBMENU_PANEL, useExisting: SubmenuPanel }],
})
export class SubmenuPanel {
  dataList = inject(DataList);
  private destroyRef = inject(DestroyRef);

  /** Registry of child submenu triggers */
  submenuTriggers = signal<SubmenuTrigger[]>([]);

  /** Delay in milliseconds before opening submenu on hover (default 300ms) */
  openDelay = input(300);

  constructor() {
    // Instant close when active item changes
    toObservable(this.dataList.activeOption)
      .pipe(
        filter(activeItem => !!activeItem),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(activeItem => {
        this.submenuTriggers()
          .filter(t => t.option !== activeItem)
          .forEach(t => t.popoverTrigger.close());
      });

    // Debounced open when active item stabilizes
    toObservable(this.dataList.activeOption)
      .pipe(
        filter(activeItem => !!activeItem),
        debounceTime(this.openDelay()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(activeItem => {
        // Close all others first
        this.submenuTriggers()
          .filter(t => t.option !== activeItem)
          .forEach(t => t.popoverTrigger.close());

        // Open the active one
        this.submenuTriggers()
          .find(t => t.option === activeItem)
          ?.popoverTrigger.open();
      });
  }
}
