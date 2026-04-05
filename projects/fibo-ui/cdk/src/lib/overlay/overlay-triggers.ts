import { Directive, ElementRef, inject, input, model, signal, TemplateRef } from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import { createOverlay } from './overlay-stack';
import { connectedPosition, globalPosition } from './overlay-config';
import type { OverlayBehaviorConfig } from './overlay-config';
import {
  CONNECTED_SHELL_TOKEN,
  DRAWER_SHELL_TOKEN,
  MODAL_SHELL_TOKEN,
} from './overlay-shell-tokens';
import { trapOverlayFocus, restoreTriggerFocusOnClose } from './overlay-behaviors';

@Directive({
  selector: '[fiboDialogTrigger]',
  exportAs: 'DialogTrigger',
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown.enter)': 'open()',
    '(click)': 'open()',
  },
})
export class DialogTrigger {
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  isOpen = model(false, { alias: 'open' });
  content = input.required<TemplateRef<unknown>>();

  private readonly behavior: OverlayBehaviorConfig = {
    shell: MODAL_SHELL_TOKEN,
    needsBackdrop: true,
    blockScroll: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
  };
  private readonly position = signal(globalPosition());

  overlay = createOverlay(this.isOpen, this.behavior, this.position, this.content, session => {
    trapOverlayFocus(session, { guard: true });
    restoreTriggerFocusOnClose(session, () => this.element);
  });

  open() {
    if (!this.isOpen()) this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}

@Directive({
  selector: '[fiboDrawerTrigger]',
  exportAs: 'DrawerTrigger',
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown.enter)': 'open()',
    '(click)': 'open()',
  },
})
export class DrawerTrigger {
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  isOpen = model(false, { alias: 'open' });
  content = input.required<TemplateRef<unknown>>();

  private readonly behavior: OverlayBehaviorConfig = {
    shell: DRAWER_SHELL_TOKEN,
    needsBackdrop: true,
    blockScroll: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
  };
  private readonly position = signal(globalPosition());

  overlay = createOverlay(this.isOpen, this.behavior, this.position, this.content, session => {
    trapOverlayFocus(session, { guard: true });
    restoreTriggerFocusOnClose(session, () => this.element);
  });

  open() {
    if (!this.isOpen()) this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}

@Directive({
  selector: '[fiboPopoverTrigger]',
  exportAs: 'PopoverTrigger',
  host: {
    '[attr.aria-expanded]': 'isOpen() || null',
    '(keydown.enter)': 'toggle()',
    '(click)': 'toggle()',
  },
})
export class PopoverTrigger {
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;

  isOpen = model(false, { alias: 'open' });
  content = input.required<TemplateRef<unknown>>();
  placement = input<Placement>();
  offset = input<number>();

  private readonly behavior: OverlayBehaviorConfig = {
    shell: CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    closeOnFocusLeave: true,
  };

  private readonly position = connectedPosition(() => ({
    referenceElement: this.element,
    placement: this.placement(),
    offset: this.offset(),
  }));

  overlay = createOverlay(this.isOpen, this.behavior, this.position, this.content, session => {
    restoreTriggerFocusOnClose(session, () => this.element);
  });

  open() {
    if (!this.isOpen()) this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.update(v => !v);
  }
}
