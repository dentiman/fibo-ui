import { DestroyRef, Directive, ElementRef, inject, OnInit } from '@angular/core';
import { blockScroll } from './overlay-behaviors';
import { OverlayShellHost } from './overlay-shell-host';
import { OverlayStack } from './overlay-stack';

/**
 * Marks the content container element inside an overlay shell.
 *
 * Responsibilities:
 * - Binds `data-overlay-container-id` for DOM-based overlay lookups
 * - Auto-sets `interactionRoot` to the host element
 * - Attaches `closeOnOutsideClick` / `closeOnFocusLeave` listeners
 *   based on `strategy.defaultBehaviors`
 */
@Directive({
  selector: '[fiboOverlayContainer]',
  host: {
    '[attr.data-overlay-container-id]': 'shellHost.handle().id',
  },
})
export class OverlayContainer implements OnInit {
  readonly shellHost = inject(OverlayShellHost);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlayStack = inject(OverlayStack);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const handle = this.shellHost.handle();
    const behaviors = handle.strategy.defaultBehaviors;

    handle.setInteractionRoot(this.elementRef.nativeElement);

    if (behaviors.includes('blockScroll')) {
      blockScroll(this.destroyRef);
    }

    if (behaviors.includes('closeOnOutsideClick')) {
      this.attachCloseOnOutsideClick();
    }

    if (behaviors.includes('closeOnFocusLeave')) {
      this.attachCloseOnFocusLeave();
    }
  }

  private isInsideSafeZone(target: Node): boolean {
    const handle = this.shellHost.handle();

    if (handle.referenceElement?.contains(target)) return true;
    if (this.elementRef.nativeElement.contains(target)) return true;

    const targetOverlayId = this.overlayStack.findOverlayContainerId(target);
    return this.overlayStack.isOverlayInBranch(handle.id, targetOverlayId);
  }

  private attachCloseOnOutsideClick(): void {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || this.isInsideSafeZone(target)) return;
      this.shellHost.handle().close('outside-click');
    };

    document.addEventListener('click', handler, true);
    this.destroyRef.onDestroy(() => document.removeEventListener('click', handler, true));
  }

  private attachCloseOnFocusLeave(): void {
    const handler = (event: FocusEvent) => {
      const target = event.target as Node | null;
      if (!target || this.isInsideSafeZone(target)) return;
      this.shellHost.handle().close('focusout');
    };

    document.addEventListener('focusin', handler, true);
    this.destroyRef.onDestroy(() => document.removeEventListener('focusin', handler, true));
  }
}
