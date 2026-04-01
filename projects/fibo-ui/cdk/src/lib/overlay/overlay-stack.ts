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
import {
  createOverlayHandleInternal,
  markOverlayHandleClosedInternal,
  setOverlayHandleRequestCloseInternal,
} from './overlay-handle-internal';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';
import { OverlaySession, OverlayStackEntry } from './overlay-session';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

// Encapsulates all mutable state for one open/close cycle.
class OverlayCycle {
  handle: OverlayHandle | null = null;
  afterOpenedRenderRef: AfterRenderRef | null = null;
  readonly cleanups: Array<() => void> = [];
  readonly afterOpened: Array<(handle: OverlayHandle) => void> = [];
  readonly afterClose: Array<(handle: OverlayHandle, reason: OverlayCloseReason) => void> = [];
  readonly beforeClose: Array<
    (ctx: OverlayCloseContext, handle: OverlayHandle, reason: OverlayCloseReason) => void
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
    this.handle = null;
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

  closeAllByTag(tag: string): void {
    const overlays = this.openOverlayList().filter(o => o.behavior.tag === tag);
    for (const overlay of [...overlays].reverse()) {
      overlay.close();
    }
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
    const overlayHandle = signal<OverlayHandle | null>(null);
    const destroyRef = inject(DestroyRef);
    const injector = inject(Injector);
    const cycle = new OverlayCycle();

    const runBeforeClose = (handle: OverlayHandle, reason: OverlayCloseReason) => {
      const ctx: OverlayCloseContext = {
        activeElement: document.activeElement as HTMLElement | null,
      };
      for (const handler of cycle.beforeClose) handler(ctx, handle, reason);
    };

    const teardown = (reason: OverlayCloseReason) => {
      const handle = cycle.handle;
      if (!handle) return;

      if (!handle.closed) {
        runBeforeClose(handle, reason);
      }

      this.removeOverlay(handle);

      if (cycle.afterClose.length > 0) {
        this.pendingAfterClose.set(handle.id, {
          handle,
          reason,
          handlers: [...cycle.afterClose],
        });
      }

      cycle.reset();
      overlayHandle.set(null);
    };

    const requestClose = (handle: OverlayHandle, reason: OverlayCloseReason, event?: Event) => {
      if (handle !== cycle.handle || handle.closed) return;

      for (const guard of cycle.guards) {
        if (guard(reason, event) === false) return;
      }

      markOverlayHandleClosedInternal(handle);
      runBeforeClose(handle, reason);
      isOpen.set(false);
    };

    const openOverlay = () => {
      const contentSignal = computed(() => content() ?? undefined);
      const handle = this.addOverlay(behavior, position, contentSignal);
      setOverlayHandleRequestCloseInternal(handle, (reason, event) =>
        requestClose(handle, reason, event),
      );
      cycle.handle = handle;
      overlayHandle.set(handle);

      untracked(() => {
        const session: OverlaySession = {
          handle,
          requestClose: (reason, event) => requestClose(handle, reason, event),
          findOverlayContainerId: target => this.findOverlayContainerId(target),
          isInOverlayBranch: target =>
            this.isOverlayInBranch(handle.id, this.findOverlayContainerId(target)),
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
            if (cycle.handle !== handle || handle.closed) return;
            for (const handler of cycle.afterOpened) handler(handle);
            cycle.afterOpened.length = 0;
            cycle.afterOpenedRenderRef = null;
          },
          { injector },
        );
      });
    };

    effect(() => {
      if (!isOpen()) {
        if (cycle.handle) teardown('state');
        return;
      }

      if (cycle.handle) return;

      if (content() === null) return;

      openOverlay();
    });

    destroyRef.onDestroy(() => teardown('destroy'));

    return overlayHandle.asReadonly();
  }

  private addOverlay(
    behavior: OverlayBehaviorConfig,
    position: Signal<OverlayPositionConfig>,
    content: Signal<TemplateRef<any> | string | undefined>,
  ): OverlayHandle {
    const initialPos = untracked(position);
    const parentOverlayId = this.findOverlayContainerId(
      initialPos.type === 'connected' ? initialPos.referenceElement : null,
    );
    const handle = createOverlayHandleInternal({ behavior, position, content });

    this.openOverlays.update(overlays => [...overlays, handle]);
    this.overlayParentIds.set(handle.id, parentOverlayId);

    return handle;
  }

  private removeOverlay(handle: OverlayHandle): void {
    this.openOverlays.update(overlays => overlays.filter(o => o.id !== handle.id));
    this.overlayParentIds.delete(handle.id);
  }
}

export function createOverlay(
  isOpen: WritableSignal<boolean>,
  behavior: OverlayBehaviorConfig,
  position: Signal<OverlayPositionConfig>,
  content: Signal<TemplateRef<any> | string | null>,
  setup?: (overlay: OverlaySession) => void,
): Signal<OverlayHandle | null> {
  const overlayStack = inject(OverlayStack);
  return overlayStack.createOverlay(isOpen, behavior, position, content, setup);
}
