import { DestroyRef, Directive, effect, inject, InjectionToken, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DataList } from '../data-list/data-list';
import { DataListItem } from '../data-list/data-list-item.directive';
import { KeyboardSource } from '../data-list/keyboard-source';
import { SubmenuTrigger } from './submenu-trigger';
import { OVERLAY_HANDLE } from '../overlay/overlay-handle';
import { OverlayStack } from '../overlay/overlay-stack';

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
  hostDirectives: [DataList],
  providers: [{ provide: MENU_PANEL, useExisting: MenuPanel }],
})
export class MenuPanel {
  dataList = inject(DataList);
  private overlayStack = inject(OverlayStack);
  private overlayHandle = inject(OVERLAY_HANDLE);
  private destroyRef = inject(DestroyRef);
  private openTimeout: ReturnType<typeof setTimeout> | undefined;
  private closeTimeout: ReturnType<typeof setTimeout> | undefined;

  /** Registry of child submenu triggers */
  submenuTriggers = signal<SubmenuTrigger[]>([]);

  /** Delay in milliseconds before opening submenu on hover (default 300ms) */
  openDelay = input(300);
  keyboardSource = input<KeyboardSource | null>(null);

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
      trigger.close();
    });
  }

  activateSubmenu(trigger: SubmenuTrigger) {
    this.clearCloseTimeout();
    this.scheduleOpen(trigger);
  }

  deactivateSubmenu(trigger: SubmenuTrigger) {
    this.scheduleClose(trigger);
  }

  closeAll() {
    this.overlayStack.closeAllByTag('menu');
  }

  closeAllSoon() {
    setTimeout(() => this.closeAll(), 0);
  }

  focusToTrigger(event: Event) {
    const referenceElement = this.overlayHandle.referenceElement;
    // Only handle ArrowLeft for submenus (reference element is inside another overlay container).
    if (!referenceElement?.closest('[data-overlay-container-id]')) return;

    referenceElement.focus();
    this.dataList.resetActiveDataListItem();
    event.stopPropagation();
    this.closeAllSubmenus();
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimeouts());

    this.dataList.mouseleaveResetGuard.set((event: MouseEvent) => {
      const targetOverlayId = this.overlayStack.findOverlayContainerId(event.relatedTarget as EventTarget);
      return !this.overlayStack.isOverlayInBranch(this.overlayHandle.id, targetOverlayId);
    });

    effect((onCleanup) => {
      const keyboardSource = this.keyboardSource();
      if (!keyboardSource) {
        return;
      }

      keyboardSource.delegate.set(this.dataList);

      onCleanup(() => {
        if (keyboardSource.delegate() === this.dataList) {
          keyboardSource.delegate.set(null);
        }
      });
    });

    // Open/close submenu with symmetric delay when active option changes
    toObservable(this.dataList.activeDataListItem)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(activeItem => {
        this.handleActiveDataListItemChange(activeItem);
      });
  }

  private handleActiveDataListItemChange(activeItem: DataListItem | null) {
    const activeTrigger = this.findTriggerByDataListItem(activeItem);
    const openTrigger = this.submenuTriggers().find(trigger => trigger.isOpen());

    if (activeTrigger && openTrigger && activeTrigger !== openTrigger) {
      this.scheduleClose(openTrigger);
    }

    if (activeTrigger) {
      if (activeTrigger.isOpen()) {
        this.clearCloseTimeout();
      }
      this.scheduleOpen(activeTrigger);
      return;
    }

    // Ignore null active option to avoid closing submenu when pointer moves
    // from parent item into the submenu overlay container (mouseleave on parent list).
    this.clearOpenTimeout();
  }

  private findTriggerByDataListItem(option: DataListItem | null) {
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
        .forEach(current => current.close());
      trigger.open();
      this.openTimeout = undefined;
    }, this.openDelay());
  }

  private scheduleClose(trigger: SubmenuTrigger) {
    this.clearCloseTimeout();
    this.closeTimeout = setTimeout(() => {
      trigger.close();
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
