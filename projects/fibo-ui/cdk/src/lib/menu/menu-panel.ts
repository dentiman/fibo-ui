import { DestroyRef, Directive, inject, InjectionToken, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DataList } from '../data-list/data-list';
import { Popover } from '../popover/popover';
import { Option } from '../data-list/option.directive';
import { SubmenuTrigger } from './submenu-trigger';

/**
 * Injection token for parent MenuPanel.
 * Used by SubmenuTrigger to register itself.
 */
export const MENU_PANEL = new InjectionToken<MenuPanel>('MenuPanel');

/**
 * Directive that coordinates popover submenu behavior.
 *
 * Features:
 * - Delayed open/close on active item changes
 * - Manages registry of child SubmenuTrigger directives
 * - Includes DataList as hostDirective
 *
 * Usage:
 * ```html
 * <div fiboMenuPanel [trigger]="menuTrigger" [openDelay]="300">
 *   <button fiboSubmenuTrigger>Item with submenu</button>
 * </div>
 * ```
 */
@Directive({
  selector: '[fiboMenuPanel]',
  host: {
    '(keydown.arrowleft)': 'focusToTrigger($event)',
  },
  hostDirectives: [
    {
      directive: DataList,
      inputs: ['trigger'],
    },
  ],
  providers: [{ provide: MENU_PANEL, useExisting: MenuPanel }],
})
export class MenuPanel {
  dataList = inject(DataList);
  private popover = inject(Popover, { self: true, optional: true });
  private destroyRef = inject(DestroyRef);
  private openTimeout: ReturnType<typeof setTimeout> | undefined;
  private closeTimeout: ReturnType<typeof setTimeout> | undefined;

  /** Registry of child submenu triggers */
  submenuTriggers = signal<SubmenuTrigger[]>([]);

  /** Delay in milliseconds before opening submenu on hover (default 300ms) */
  openDelay = input(300);
  closeParent = output<void>();

  registerSubmenuTrigger(trigger: SubmenuTrigger) {
    const currentTriggers = this.submenuTriggers();
    if (!currentTriggers.includes(trigger)) {
      this.submenuTriggers.set([...currentTriggers, trigger]);
    }
  }

  unregisterSubmenuTrigger(trigger: SubmenuTrigger) {
    const currentTriggers = this.submenuTriggers();
    this.submenuTriggers.set(currentTriggers.filter(current => current !== trigger));
  }

  closeAllSubmenus() {
    this.clearTimeouts();
    this.submenuTriggers().forEach(trigger => {
      trigger.popoverTrigger.close();
    });
  }

  closeMenuWithParent() {
    this.popover?.close();
    this.closeParent.emit();
  }

  focusToTrigger(event: Event) {
    if (!this.popover?.trigger().isListItem) {
      return;
    }

    this.popover.trigger().element.focus();
    this.dataList.resetActiveOption();
    event.stopPropagation();
    this.closeAllSubmenus();
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimeouts());

    // Open/close submenu with symmetric delay when active option changes
    toObservable(this.dataList.activeOption)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(activeItem => {
        this.handleActiveOptionChange(activeItem);
      });
  }

  private handleActiveOptionChange(activeItem: Option | null) {
    const activeTrigger = this.findTriggerByOption(activeItem);
    const openTrigger = this.submenuTriggers().find(trigger => trigger.popoverTrigger.isOpen());

    if (activeTrigger && openTrigger && activeTrigger !== openTrigger) {
      this.scheduleClose(openTrigger);
    }

    if (activeTrigger) {
      if (activeTrigger.popoverTrigger.isOpen()) {
        this.clearCloseTimeout();
      }
      this.scheduleOpen(activeTrigger);
      return;
    }

    // Ignore null active option to avoid closing submenu when pointer moves
    // from parent item into the submenu portal (mouseleave on parent list).
    this.clearOpenTimeout();
  }

  private findTriggerByOption(option: Option | null) {
    if (!option) {
      return undefined;
    }
    return this.submenuTriggers().find(trigger => trigger.option === option);
  }

  private scheduleOpen(trigger: SubmenuTrigger) {
    this.clearOpenTimeout();
    this.openTimeout = setTimeout(() => {
      this.submenuTriggers()
        .filter(current => current !== trigger)
        .forEach(current => current.popoverTrigger.close());
      trigger.popoverTrigger.open();
      this.openTimeout = undefined;
    }, this.openDelay());
  }

  private scheduleClose(trigger: SubmenuTrigger) {
    this.clearCloseTimeout();
    this.closeTimeout = setTimeout(() => {
      trigger.popoverTrigger.close();
      this.closeTimeout = undefined;
    }, this.openDelay());
  }

  private clearTimeouts() {
    this.clearOpenTimeout();
    this.clearCloseTimeout();
  }

  private clearOpenTimeout() {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = undefined;
    }
  }

  private clearCloseTimeout() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }
  }
}
