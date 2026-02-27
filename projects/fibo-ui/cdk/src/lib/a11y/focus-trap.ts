import { afterNextRender, Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
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
        const focusable = getFocusableElements(this.elementRef.nativeElement);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          this.elementRef.nativeElement.focus();
        }
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.enabled() || event.key !== 'Tab') return;

    const focusable = getFocusableElements(this.elementRef.nativeElement);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
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
