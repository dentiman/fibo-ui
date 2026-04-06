import {
  afterNextRender,
  AfterRenderRef,
  DestroyRef,
  Injectable,
  Injector,
  TemplateRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import type { Signal, WritableSignal } from '@angular/core';
import type { OverlayHandle } from './overlay-handle';
import { createOverlayHandle } from './overlay-handle-internal';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';
import { OverlaySession, OverlayStackEntry } from './overlay-session';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

// Encapsulates all mutable state for one open/close cycle.
class OverlayCycle {
  overlay: OverlayHandle | null = null;
  closed = false;
  afterOpenedRenderRef: AfterRenderRef | null = null;
  readonly cleanups: Array<() => void> = [];
  readonly afterOpened: Array<(overlay: OverlayHandle) => void> = [];
  readonly afterClose: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void> = [];
  readonly beforeClose: Array<
    (ctx: OverlayCloseContext, overlay: OverlayHandle, reason: OverlayCloseReason) => void
  > = [];
  readonly guards: Array<(reason: OverlayCloseReason, event?: Event) => boolean | void> = [];

  reset(): void {
    this.afterOpenedRenderRef?.destroy();
    this.afterOpenedRenderRef = null;
    for (const cleanup of this.cleanups.splice(0)) cleanup();
    this.afterOpened.length = 0;
    this.afterClose.length = 0;
    this.beforeClose.length = 0;
    this.guards.length = 0;
    this.overlay = null;
    this.closed = false;
  }
}

// Global stack that coordinates open overlays, ordering and close completion.
@Injectable({
  providedIn: 'root',
})
export class OverlayStack {
  private readonly openOverlays = signal<OverlayHandle[]>([]);
  private readonly overlayParentIds = new Map<string, string | null>();
  private readonly pendingAfterClose = new Map<string, OverlayStackEntry>();

  readonly openOverlayList: Signal<OverlayHandle[]> = this.openOverlays.asReadonly();

  /**
   * Walk up the overlay parent chain from the given overlay to the topmost
   * open ancestor, then close it.  Angular's destroy lifecycle cascade-closes
   * all descendant overlays automatically.
   */
  closeBranchRoot(overlayId: string): void {
    let rootId = overlayId;
    while (true) {
      const parentId = this.overlayParentIds.get(rootId);
      if (!parentId) break;
      if (!this.openOverlays().some(o => o.id === parentId)) break;
      rootId = parentId;
    }
    const root = this.openOverlays().find(o => o.id === rootId);
    root?.close();
  }

  completeAfterClose(id: string): void {
    const pendingEntry = this.pendingAfterClose.get(id);
    if (!pendingEntry) {
      return;
    }

    this.pendingAfterClose.delete(id);
    for (const handler of pendingEntry.handlers) {
      handler(pendingEntry.handle, pendingEntry.reason);
    }
  }

  findOverlayContainerId(target: EventTarget | null | undefined): string | null {
    const element =
      target instanceof Element ? target :
      target instanceof Node ? target.parentElement :
      null;

    if (!element) {
      return null;
    }

    return element.closest('[data-overlay-container-id]')?.getAttribute('data-overlay-container-id') ?? null;
  }

  isOverlayInBranch(
    ownerOverlayId: string | null | undefined,
    targetOverlayId: string | null | undefined,
  ): boolean {
    if (!ownerOverlayId || !targetOverlayId) {
      return false;
    }

    let currentOverlayId: string | null | undefined = targetOverlayId;
    while (currentOverlayId) {
      if (currentOverlayId === ownerOverlayId) {
        return true;
      }

      currentOverlayId = this.overlayParentIds.get(currentOverlayId) ?? null;
    }

    return false;
  }

  createOverlay(
    isOpen: WritableSignal<boolean>,
    behavior: OverlayBehaviorConfig,
    position: Signal<OverlayPositionConfig>,
    content: Signal<TemplateRef<any> | string | null>,
    setup?: (overlay: OverlaySession) => void,
  ): Signal<OverlayHandle | null> {
    const overlaySignal = signal<OverlayHandle | null>(null);
    const destroyRef = inject(DestroyRef);
    const injector = inject(Injector);
    const cycle = new OverlayCycle();

    const runBeforeClose = (overlay: OverlayHandle, reason: OverlayCloseReason) => {
      const ctx: OverlayCloseContext = {
        activeElement: document.activeElement as HTMLElement | null,
      };
      for (const handler of cycle.beforeClose) handler(ctx, overlay, reason);
    };

    const teardown = (reason: OverlayCloseReason) => {
      const overlay = cycle.overlay;
      if (!overlay) return;

      if (!cycle.closed) {
        runBeforeClose(overlay, reason);
      }

      this.removeOverlay(overlay);

      if (cycle.afterClose.length > 0) {
        this.pendingAfterClose.set(overlay.id, {
          handle: overlay,
          reason,
          handlers: [...cycle.afterClose],
        });
      }

      cycle.reset();
      overlaySignal.set(null);
    };

    const requestClose = (reason: OverlayCloseReason, event?: Event) => {
      const overlay = cycle.overlay;
      if (!overlay || cycle.closed) return;

      for (const guard of cycle.guards) {
        if (guard(reason, event) === false) return;
      }

      cycle.closed = true;
      runBeforeClose(overlay, reason);
      isOpen.set(false);
    };

    const openOverlay = () => {
      const contentSignal = computed(() => content() ?? undefined);
      const overlay = createOverlayHandle(behavior, position, contentSignal, requestClose);

      this.addOverlay(overlay);
      cycle.overlay = overlay;
      overlaySignal.set(overlay);

      untracked(() => {
        const session: OverlaySession = {
          handle: overlay,
          requestClose: (reason, event) => requestClose(reason, event),
          findOverlayContainerId: target => this.findOverlayContainerId(target),
          isInOverlayBranch: target =>
            this.isOverlayInBranch(overlay.id, this.findOverlayContainerId(target)),
          afterOpened: handler => cycle.afterOpened.push(handler),
          afterClose: handler => cycle.afterClose.push(handler),
          beforeClose: handler => cycle.beforeClose.push(handler),
          canClose: guard => cycle.guards.push(guard),
          effect: runner => {
            const effectRef = effect(runner, { injector });
            cycle.cleanups.push(() => effectRef.destroy());
            return effectRef;
          },
          onCleanup: cleanup => cycle.cleanups.push(cleanup),
        };

        if (setup) {
          setup(session);
        }

        cycle.afterOpenedRenderRef = afterNextRender(
          () => {
            if (cycle.overlay !== overlay || cycle.closed) return;
            for (const handler of cycle.afterOpened) handler(overlay);
            cycle.afterOpened.length = 0;
            cycle.afterOpenedRenderRef = null;
          },
          { injector },
        );
      });
    };

    effect(() => {
      if (!isOpen()) {
        if (cycle.overlay) teardown('state');
        return;
      }

      if (cycle.overlay) return;

      if (content() === null) return;

      openOverlay();
    });

    destroyRef.onDestroy(() => teardown('destroy'));

    return overlaySignal.asReadonly();
  }

  private addOverlay(overlay: OverlayHandle): void {
    const pos = untracked(overlay.position);
    const anchor = pos.type === 'connected' ? pos.referenceElement : document.activeElement;
    const parentOverlayId = this.findOverlayContainerId(anchor);

    this.openOverlays.update(overlays => [...overlays, overlay]);
    this.overlayParentIds.set(overlay.id, parentOverlayId);
  }

  private removeOverlay(overlay: OverlayHandle): void {
    this.openOverlays.update(overlays => overlays.filter(o => o.id !== overlay.id));
    this.overlayParentIds.delete(overlay.id);
  }
}

export function createOverlay(
  isOpen: WritableSignal<boolean>,
  behavior: OverlayBehaviorConfig,
  position: Signal<OverlayPositionConfig>,
  content: Signal<TemplateRef<any> | string | null>,
  setup?: (overlay: OverlaySession) => void,
): Signal<OverlayHandle | null> {
  return inject(OverlayStack).createOverlay(isOpen, behavior, position, content, setup);
}
