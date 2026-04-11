import { Directive, ElementRef, inject, input, model, TemplateRef } from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import { DRAWER_SHELL_TOKEN } from './overlay-shell-tokens';
import { createOverlay } from './public-overlay';

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

  overlay = createOverlay(() => ({
    state: this.isOpen,
    content: this.content(),
    focus: { restoreTo: () => this.element },
  }));

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

  overlay = createOverlay(() => ({
    state: this.isOpen,
    content: this.content(),
    shell: DRAWER_SHELL_TOKEN,
    focus: { restoreTo: () => this.element },
  }));

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

  overlay = createOverlay(() => ({
    state: this.isOpen,
    content: this.content(),
    position: {
      connectedTo: this.element,
      placement: this.placement(),
      offset: this.offset(),
    },
    focus: { restoreTo: () => this.element },
  }));

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
