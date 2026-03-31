import { Directive, ElementRef, inject, input, model, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { DataListItem } from '../data-list/data-list-item.directive';
import { KeyboardSource } from '../data-list/keyboard-source';
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
    KeyboardSource,
  ],
  host: {
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'isOpen() || null',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave($event)',
    '(keydown.enter)': 'open()',
    '(keydown.arrowright)': 'keyboardSource.delegate()?.navigateNext?.($event)',
    '(click)': 'open()',
  },
})
export class SubmenuTrigger implements OnInit, OnDestroy {
  readonly option = inject(DataListItem);
  readonly keyboardSource = inject(KeyboardSource);
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly panel = inject(MENU_PANEL);
  private readonly overlayStack = inject(OverlayStack);

  content = input.required<TemplateRef<unknown>>();
  isOpen = model(false, { alias: 'open' });

  private readonly behavior: OverlayBehaviorConfig = {
    shell: CONNECTED_SHELL_TOKEN,
    tag: 'menu',
    closeOnOutsideClick: true,
    closeOnFocusLeave: true,
    closeOnEscape: true,
  };

  overlayHandle = createOverlay(
    this.isOpen,
    this.behavior,
    connectedPosition(() => ({ placement: 'right-start', offset: 1, referenceElement: this.element })),
    this.content,
    overlay => { restoreTriggerFocusOnClose(overlay, () => this.element); },
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
    const submenuHandle = this.overlayHandle();
    const targetOverlayId = this.overlayStack.findOverlayContainerId(event.relatedTarget);
    if (submenuHandle && this.overlayStack.isOverlayInBranch(submenuHandle.id, targetOverlayId)) {
      return;
    }

    this.panel.deactivateSubmenu(this);
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}
