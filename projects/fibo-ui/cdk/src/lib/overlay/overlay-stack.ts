import {
  afterNextRender,
  AfterRenderRef,
  DestroyRef,
  EffectRef,
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
  syncOverlayHandleContentInternal,
  syncOverlayHandlePositionInternal,
} from './overlay-handle-internal';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';
import { OverlaySession, OverlayStackEntry } from './overlay-session';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

const OVERLAY_Z_INDEX = 1000;

// Encapsulates all mutable state for one open/close cycle.
class OverlayCycle {
  handle: OverlayHandle | null = null;
  positionSyncEffect: EffectRef | null = null;
  contentSyncEffect: EffectRef | null = null;
  afterOpenedRenderRef: AfterRenderRef | null = null;
  readonly cleanups: Array<() => void> = [];
  readonly afterOpened: Array<(handle: OverlayHandle) => void> = [];
  readonly afterClose: Array<(handle: OverlayHandle, reason: OverlayCloseReason) => void> = [];
  readonly beforeClose: Array<
    (ctx: OverlayCloseContext, handle: OverlayHandle, reason: OverlayCloseReason) => void
  > = [];
  readonly guards: Array<(reason: OverlayCloseReason, event?: Event) => boolean | void> = [];

  reset(): void {
    this.positionSyncEffect?.destroy();
    this.positionSyncEffect = null;
    this.contentSyncEffect?.destroy();
    this.contentSyncEffect = null;
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
  private readonly openOverlays = signal<Map<string, OverlayHandle>>(new Map());
  private readonly overlayParentIds = new Map<string, string | null>();
  private readonly pendingAfterClose = new Map<string, OverlayStackEntry>();
  private zIndexCounter = 0;

  readonly openOverlayList = computed(() => {
    const overlays = Array.from(this.openOverlays().values());
    return overlays.sort((left, right) => left.zIndex - right.zIndex);
  });

  readonly topmost = computed(() => {
    const list = this.openOverlayList();
    return list.length > 0 ? list[list.length - 1] : null;
  });

  closeTopmost(): void {
    const list = this.openOverlayList();
    for (let index = list.length - 1; index >= 0; index--) {
      const overlay = list[index];
      if (overlay.behavior.closeOnEscape !== false) {
        overlay.close('escape');
        return;
      }
    }
  }

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

    const openOverlay = (initialPosition: OverlayPositionConfig, initialContent: TemplateRef<any> | string) => {
      const handle = this.addOverlay(behavior, initialPosition, initialContent);
      setOverlayHandleRequestCloseInternal(handle, (reason, event) =>
        requestClose(handle, reason, event),
      );
      cycle.handle = handle;
      overlayHandle.set(handle);

      untracked(() => {
        cycle.positionSyncEffect = effect(
          () => syncOverlayHandlePositionInternal(handle, position()),
          { injector },
        );

        cycle.contentSyncEffect = effect(
          () => {
            const c = content();
            if (c !== null) syncOverlayHandleContentInternal(handle, c);
          },
          { injector },
        );

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
          effect: runner => effect(runner, { injector }),
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

      const initialContent = content();
      if (initialContent === null) return;

      openOverlay(position(), initialContent);
    });

    destroyRef.onDestroy(() => teardown('destroy'));

    return overlayHandle.asReadonly();
  }

  private addOverlay(
    behavior: OverlayBehaviorConfig,
    position: OverlayPositionConfig,
    content: TemplateRef<any> | string,
  ): OverlayHandle {
    const zIndex = OVERLAY_Z_INDEX + ++this.zIndexCounter;
    const parentOverlayId = this.findOverlayContainerId(
      position.type === 'connected' ? position.referenceElement : null,
    );
    const handle = createOverlayHandleInternal({ behavior, position, content, zIndex });

    this.openOverlays.update(map => {
      const nextMap = new Map(map);
      nextMap.set(handle.id, handle);
      return nextMap;
    });
    this.overlayParentIds.set(handle.id, parentOverlayId);

    return handle;
  }

  private removeOverlay(handle: OverlayHandle): void {
    this.openOverlays.update(map => {
      const nextMap = new Map(map);
      nextMap.delete(handle.id);
      return nextMap;
    });
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
