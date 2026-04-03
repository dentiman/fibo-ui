import { DestroyRef, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { blockScroll, isElementInsideOverlayContainer } from './overlay-behaviors';
import { OverlayHandle, OVERLAY_HANDLE } from './overlay-handle';
import { OverlayStack } from './overlay-stack';

/**
 * Host directive for all overlay shell components.
 *
 * Responsibilities:
 * - Accepts `OverlayHandle` as input and provides it via `OVERLAY_HANDLE` DI token
 * - Binds `data-overlay-container-id` for DOM-based overlay lookups
 * - Sets `hostElement` on the handle for outside-click detection
 * - Calls `completeAfterClose` when the shell is destroyed
 * - Attaches close-policy listeners based on `behavior` booleans:
 *   `closeOnFocusLeave`, `closeOnScroll`, `blockScroll`, `closeOnEscape`
 * - Outside-click is handled centrally by `OverlayStackOutlet`
 */
@Directive({
  selector: '[fiboOverlayContainer]',
  providers: [
    {
      provide: OVERLAY_HANDLE,
      useFactory: () => inject(OverlayContainer).handle(),
    },
  ],
  host: {
    'style': 'z-index: 1000',
    '[attr.data-overlay-container-id]': 'handle().id',
  },
})
export class OverlayContainer implements OnInit {
  readonly handle = input.required<OverlayHandle>();
  readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlayStack = inject(OverlayStack);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() =>
      this.overlayStack.completeAfterClose(this.handle().id),
    );
  }

  ngOnInit(): void {
    const handle = this.handle();
    const behavior = handle.behavior;

    handle.hostElement.set(this.elementRef.nativeElement);

    if (behavior.blockScroll) {
      blockScroll(this.destroyRef);
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

  private attachCloseOnFocusLeave(): void {
    const handle = this.handle();
    const handler = (event: FocusEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const pos = handle.position();
      if (pos.type === 'connected' && pos.referenceElement?.contains(target)) return;
      if (this.elementRef.nativeElement.contains(target)) return;
      const targetOverlayId = this.overlayStack.findOverlayContainerId(target);
      if (targetOverlayId && this.overlayStack.isOverlayInBranch(handle.id, targetOverlayId)) return;
      handle.close('focusout');
    };

    document.addEventListener('focusin', handler, true);
    this.destroyRef.onDestroy(() => document.removeEventListener('focusin', handler, true));
  }

  private attachCloseOnEscape(): void {
    const handle = this.handle();

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
    const handle = this.handle();

    const handler = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && isElementInsideOverlayContainer(target, handle.id)) return;
      handle.close('blur');
    };

    document.addEventListener('scroll', handler, true);
    this.destroyRef.onDestroy(() => document.removeEventListener('scroll', handler, true));
  }
}
