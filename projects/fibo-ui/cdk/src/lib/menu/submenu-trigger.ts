import { Directive, ElementRef, inject, input, model, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { restoreTriggerFocusOnClose } from '../overlay/overlay-behaviors';
import { createOverlay, OverlayStack } from '../overlay/overlay-stack';
import { connectedPosition } from '../overlay/overlay-config';
import type { OverlayBehaviorConfig } from '../overlay/overlay-config';
import { CONNECTED_SHELL_TOKEN } from '../overlay/overlay-shell-tokens';
import { MENU_PANEL } from './menu-panel';

@Directive({
  selector: '[fiboSubmenuTrigger]',
  exportAs: 'submenuTrigger',
  hostDirectives: [
    {
      directive: DataListItem,
      inputs: ['disabled'],
    },
  ],
  host: {
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'isOpen() || null',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave($event)',
    '(keydown.enter)': 'openFromKeyboard($event)',
    '(keydown.arrowright)': 'openFromKeyboard($event)',
    '(click)': 'open()',
  },
})
export class SubmenuTrigger implements OnInit, OnDestroy {
  readonly option = inject(DataListItem);
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly panel = inject(MENU_PANEL);
  private readonly overlayStack = inject(OverlayStack);

  content = input.required<TemplateRef<unknown>>();
  isOpen = model(false, { alias: 'open' });
  private pendingKeyboardNavigation = false;

  private readonly behavior: OverlayBehaviorConfig = {
    shell: CONNECTED_SHELL_TOKEN,
    tag: 'menu',
    closeOnOutsideClick: true,
    closeOnFocusLeave: true,
    closeOnEscape: true,
  };

  overlay = createOverlay(
    this.isOpen,
    this.behavior,
    connectedPosition(() => ({ placement: 'right-start', offset: 1, referenceElement: this.element })),
    this.content,
    overlay => {
      restoreTriggerFocusOnClose(overlay, () => this.element);
      overlay.afterOpened(() => {
        if (!this.pendingKeyboardNavigation) {
          return;
        }

        this.pendingKeyboardNavigation = false;
        // The child MenuPanel's DataList is now listening to keydown on this element.
        // Dispatching ArrowDown navigates to the first item in the submenu.
        this.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: false }));
      });
    },
  );

  ngOnInit() {
    this.panel.registerSubmenuTrigger(this);
  }

  ngOnDestroy() {
    this.panel.unregisterSubmenuTrigger(this);
  }

  onMouseEnter() {
    this.panel.activateSubmenu(this);
  }

  onMouseLeave(event: MouseEvent) {
    const submenuOverlay = this.overlay();
    const targetOverlayId = this.overlayStack.findOverlayContainerId(event.relatedTarget);
    if (submenuOverlay && this.overlayStack.isOverlayInBranch(submenuOverlay.id, targetOverlayId)) {
      return;
    }

    this.panel.deactivateSubmenu(this);
  }

  open() {
    this.isOpen.set(true);
  }

  openFromKeyboard(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isOpen()) {
      // Submenu is already open — dispatch ArrowDown so the child DataList
      // receives it and navigates to the first item.
      this.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: false }));
      return;
    }

    this.pendingKeyboardNavigation = true;
    this.open();
  }

  close() {
    this.isOpen.set(false);
  }
}
