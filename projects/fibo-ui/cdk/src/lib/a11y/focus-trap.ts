import { afterNextRender, Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

const TABBABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getTabbableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
  );
}

@Directive({
  selector: '[fiboFocusTrap]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class FocusTrap implements OnDestroy {
  /** Enable or disable the focus trap */
  enabled = input(true);

  /** Auto-focus the first focusable element on init */
  autoFocus = input(true);

  /** Restore focus to the previously focused element on destroy */
  restoreFocus = input(true);

  private elementRef = inject(ElementRef<HTMLElement>);
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => {
      if (this.autoFocus()) {
        this.previouslyFocused = document.activeElement as HTMLElement;
        const focusable = getTabbableElements(this.elementRef.nativeElement);
        if (focusable.length > 0) {
          focusable[0].focus({ preventScroll: true });
        } else {
          this.elementRef.nativeElement.focus({ preventScroll: true });
        }
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.enabled() || event.key !== 'Tab') return;

    const focusable = getTabbableElements(this.elementRef.nativeElement);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement;
    const isInsideTrap = this.elementRef.nativeElement.contains(active);
    const isInTabOrder = focusable.includes(active);

    if (event.shiftKey) {
      if (active === first || (isInsideTrap && !isInTabOrder)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || (isInsideTrap && !isInTabOrder)) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.restoreFocus() && this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }
}
