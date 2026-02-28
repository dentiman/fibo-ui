import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { PopoverTrigger } from '../popover/popover-trigger';
import { MENU_PANEL } from './menu-panel';

/**
 * Directive that creates a submenu trigger with popover behavior.
 *
 * **Requirements:**
 * - Parent element must have `fiboMenuPanel` directive
 *
 * Features:
 * - Composes DataListItem + PopoverTrigger via hostDirectives
 * - Registers in parent MenuPanel on init
 * - Unregisters on destroy
 * - Keyboard support: Enter/Escape to open/close, ArrowRight to navigate into submenu
 * - Click to open
 *
 * Usage:
 * ```html
 * <div fiboMenuPanel>
 *   <button fiboSubmenuTrigger [disabled]="false">
 *     Menu Item
 *   </button>
 * </div>
 * ```
 */
@Directive({
  selector: '[fiboSubmenuTrigger]',
  exportAs: 'submenuTrigger',
  hostDirectives: [
    {
      directive: DataListItem,
      inputs: ['disabled'],
    },
    {
      directive: PopoverTrigger,
      inputs: ['contentTemplate', 'fiboOverlayKind'],
    },
  ],
  host: {
    '(keydown.enter)': 'popoverTrigger.open()',
    '(keydown.escape)': 'popoverTrigger.close()',
    '(keydown.arrowright)': 'popoverTrigger.keydownDelegate()?.navigateNext?.($event)',
    '(click)': 'popoverTrigger.open()',
  },
})
export class SubmenuTrigger implements OnInit, OnDestroy {
  popoverTrigger = inject(PopoverTrigger);
  option = inject(DataListItem);
  private panel = inject(MENU_PANEL);

  // Expose PopoverTrigger's isOpen for template binding
  get isOpen() {
    return this.popoverTrigger.isOpen;
  }
  set isOpen(value: any) {
    this.popoverTrigger.isOpen = value;
  }

  ngOnInit() {
    this.panel.registerSubmenuTrigger(this);
  }

  ngOnDestroy() {
    this.panel.unregisterSubmenuTrigger(this);
  }
}
