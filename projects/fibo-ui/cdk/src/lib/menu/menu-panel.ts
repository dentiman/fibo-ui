import { DestroyRef, Directive, effect, inject, InjectionToken, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DataList } from '../data-list/data-list';
import { DataListItem } from '../data-list/data-list-item.directive';
import { SubmenuTrigger } from './submenu-trigger';
import { type OverlayHandle } from '../overlay/overlay-handle';
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
 * <div fiboMenuPanel [keyboardSource]="keyboardSource" [openDelay]="300">
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
      inputs: ['keyboardSource'],
    },
  ],
  providers: [{ provide: MENU_PANEL, useExisting: MenuPanel }],
})
export class MenuPanel {
  dataList = inject(DataList);
  private overlayStack = inject(OverlayStack);
  private destroyRef = inject(DestroyRef);
  private openTimeout: ReturnType<typeof setTimeout> | undefined;
  private closeTimeout: ReturnType<typeof setTimeout> | undefined;

  /** Registry of child submenu triggers */
  submenuTriggers = signal<SubmenuTrigger[]>([]);

  /** Delay in milliseconds before opening submenu on hover (default 300ms) */
  openDelay = input(300);
  /**
   * Current overlay session for this menu panel when it is rendered inside an overlay.
   *
   * Used by overlay-backed menus for several related cases:
   * - ArrowLeft focus return from a submenu back to its trigger element
   * - fallback keyboard wiring from the connected reference element when no explicit
   *   `keyboardSource` is provided
   * - branch-aware pointer handling, so parent menu state is preserved while the pointer
   *   moves between this panel and its child submenu overlays
   *
   * Plain in-place menus can omit it. Popover and nested submenu panels usually provide it.
   */
  overlay = input<OverlayHandle | null>(null);

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
    const overlay = this.overlay();
    if (!overlay) return;
    const pos = overlay.position();
    const referenceElement = pos.type === 'connected' ? pos.referenceElement : null;
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
      if (!targetOverlayId) return true;

      // Don't reset when mouse moves into a child overlay of this panel's own overlay
      const overlay = this.overlay();
      if (overlay && this.overlayStack.isOverlayInBranch(overlay.id, targetOverlayId)) {
        return false;
      }

      // Don't reset when mouse moves into an open submenu's overlay
      return !this.submenuTriggers().some(trigger => {
        const submenuOverlay = trigger.overlay();
        return submenuOverlay && this.overlayStack.isOverlayInBranch(submenuOverlay.id, targetOverlayId);
      });
    });

    effect((onCleanup) => {
      const keyboardSource = this.dataList.keyboardSource();

      if (keyboardSource) {
        return;
      }

      // Fallback: auto-wire keydown from referenceElement when no keyboardSource is provided.
      // This allows PopoverTrigger (and similar) to drive menu keyboard navigation
      // without requiring explicit fiboKeyboardSource boilerplate.
      const pos = this.overlay()?.position();
      const refEl = pos?.type === 'connected' ? pos.referenceElement : null;
      if (!refEl) return;

      const handler = (e: KeyboardEvent) => this.dataList.onKeydown(e);
      refEl.addEventListener('keydown', handler);
      onCleanup(() => refEl.removeEventListener('keydown', handler));
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
    const isMouseActivation = this.dataList.lastActivationSource() === 'mouse';

    if (activeTrigger && openTrigger && activeTrigger !== openTrigger) {
      this.scheduleClose(openTrigger);
    }

    if (activeTrigger) {
      if (activeTrigger.isOpen()) {
        this.clearCloseTimeout();
      }
      // Only auto-open submenus on mouse hover; keyboard requires Enter/ArrowRight.
      if (isMouseActivation) {
        this.scheduleOpen(activeTrigger);
      }
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
