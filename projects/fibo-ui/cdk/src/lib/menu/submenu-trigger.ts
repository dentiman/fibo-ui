import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { KeyboardSource } from '../data-list/keyboard-source';
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
 * - Keyboard support: Enter to open, ArrowRight to navigate into submenu
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
      inputs: ['content'],
    },
    KeyboardSource,
  ],
  host: {
    'aria-haspopup': 'menu',
    '(keydown.enter)': 'popoverTrigger.open()',
    '(keydown.arrowright)': 'keyboardSource.delegate()?.navigateNext?.($event)',
    '(click)': 'popoverTrigger.open()',
  },
})
export class SubmenuTrigger implements OnInit, OnDestroy {
  popoverTrigger = inject(PopoverTrigger);
  option = inject(DataListItem);
  keyboardSource = inject(KeyboardSource);
  private panel = inject(MENU_PANEL);

  ngOnInit() {
    this.popoverTrigger.strategyKind.set('menu');
    this.panel.registerSubmenuTrigger(this);
  }

  ngOnDestroy() {
    this.panel.unregisterSubmenuTrigger(this);
  }
}
