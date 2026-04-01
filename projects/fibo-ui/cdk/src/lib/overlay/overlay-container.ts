import { DestroyRef, Directive, ElementRef, inject, OnInit } from '@angular/core';
import { blockScroll, isElementInsideOverlayContainer } from './overlay-behaviors';
import { setOverlayHandleInteractionRootInternal } from './overlay-handle-internal';
import { OverlayShellHost } from './overlay-shell-host';
import { OverlayStack } from './overlay-stack';

/**
 * Marks the content container element inside an overlay shell.
 *
 * Responsibilities:
 * - Binds `data-overlay-container-id` for DOM-based overlay lookups
 * - Auto-sets `interactionRoot` to the host element
 * - Attaches close-policy listeners based on `behavior` booleans:
 *   `closeOnOutsideClick`, `closeOnFocusLeave`, `closeOnScroll`, `blockScroll`
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
    const behavior = handle.behavior;

    setOverlayHandleInteractionRootInternal(handle, this.elementRef.nativeElement);

    if (behavior.blockScroll) {
      blockScroll(this.destroyRef);
    }

    if (behavior.closeOnOutsideClick) {
      this.attachCloseOnOutsideClick();
    }

    if (behavior.closeOnFocusLeave) {
      this.attachCloseOnFocusLeave();
    }

    if (behavior.closeOnScroll) {
      this.attachCloseOnScroll();
    }

    if (behavior.closeOnEscape !== false) {
      this.attachCloseOnEscape();
    }
  }

  private isInsideSafeZone(target: Node): boolean {
    const handle = this.shellHost.handle();
    const pos = handle.position();
    const referenceElement = pos.type === 'connected' ? pos.referenceElement : null;

    if (referenceElement?.contains(target)) return true;
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

  private attachCloseOnEscape(): void {
    const handle = this.shellHost.handle();

    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const list = this.overlayStack.openOverlayList();
      const topmost = [...list].reverse().find(o => o.behavior.closeOnEscape !== false);
      if (topmost?.id !== handle.id) return;
      handle.close('escape');
    };

    document.addEventListener('keydown', handler, true);
    this.destroyRef.onDestroy(() => document.removeEventListener('keydown', handler, true));
  }

  private attachCloseOnScroll(): void {
    const handle = this.shellHost.handle();

    const handler = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && isElementInsideOverlayContainer(target, handle.id)) return;
      handle.close('blur');
    };

    document.addEventListener('scroll', handler, true);
    this.destroyRef.onDestroy(() => document.removeEventListener('scroll', handler, true));
  }
}
