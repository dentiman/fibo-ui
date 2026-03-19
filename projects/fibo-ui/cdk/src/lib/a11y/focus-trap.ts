import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  Injectable,
  input,
  OnDestroy,
} from '@angular/core';

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

/**
 * Manages a stack of focus traps. Only the topmost guarded trap
 * intercepts focusin events, preventing conflicts between nested traps.
 */
@Injectable({ providedIn: 'root' })
export class FocusTrapStack {
  private stack: FocusTrap[] = [];

  register(trap: FocusTrap): void {
    this.stack.push(trap);
    this.sync();
  }

  deregister(trap: FocusTrap): void {
    const index = this.stack.indexOf(trap);
    if (index !== -1) {
      this.stack.splice(index, 1);
    }
    this.sync();
  }

  private sync(): void {
    for (let i = 0; i < this.stack.length; i++) {
      this.stack[i].activeGuard = i === this.stack.length - 1;
    }
  }
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

  /** Guard focus via global focusin listener (catches mouse clicks and programmatic focus) */
  guardFocus = input(true);

  /** Managed by FocusTrapStack — true only for the topmost guarded trap */
  activeGuard = false;

  private elementRef = inject(ElementRef<HTMLElement>);
  private focusTrapStack = inject(FocusTrapStack);
  private previouslyFocused: HTMLElement | null = null;

  private focusinListener = (event: FocusEvent) => {
    if (!this.enabled() || !this.guardFocus() || !this.activeGuard) return;
    const target = event.target as HTMLElement;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      const focusable = getTabbableElements(this.elementRef.nativeElement);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        this.elementRef.nativeElement.focus();
      }
    }
  };

  constructor() {
    afterNextRender(() => {
      this.previouslyFocused = document.activeElement as HTMLElement;

      if (this.autoFocus()) {
        this.focusInitial();
      }

      if (this.guardFocus()) {
        this.focusTrapStack.register(this);
        document.addEventListener('focusin', this.focusinListener);
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
    document.removeEventListener('focusin', this.focusinListener);
    this.focusTrapStack.deregister(this);

    if (this.restoreFocus() && this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }

  private focusInitial(): void {
    const root = this.elementRef.nativeElement;
    const marked = root.querySelector('[fiboFocusInitial]') as HTMLElement | null;

    if (marked) {
      marked.focus({ preventScroll: true });
      return;
    }

    const focusable = getTabbableElements(root);
    if (focusable.length > 0) {
      focusable[0].focus({ preventScroll: true });
    } else {
      root.focus({ preventScroll: true });
    }
  }
}
