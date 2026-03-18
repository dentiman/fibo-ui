import {
  afterNextRender,
  AfterRenderRef,
  DestroyRef,
  EffectRef,
  Injectable,
  Injector,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { OverlayCategory, OverlayHandle } from './overlay-handle';
import {
  CreateOverlayHandleOptions,
  createOverlayHandleInternal,
  markOverlayHandleClosedInternal,
  setOverlayHandleRequestCloseInternal,
  syncOverlayHandleRenderConfigInternal,
} from './overlay-handle-internal';
import {
  OverlayCloseContext,
  OverlayCloseReason,
  OverlayRenderConfig,
  OverlayRenderConfigSignal,
  OverlaySession,
  OverlayStackEntry,
} from './overlay-session';

const BASE_Z_INDEX: Record<OverlayCategory, number> = {
  dialog: 500,
  confirmation: 600,
  popover: 1000,
  menu: 1000,
  tooltip: 2000,
  notification: 3000,
};

const ESCAPE_SKIP_CATEGORIES: Set<OverlayCategory> = new Set(['notification', 'tooltip']);

type RegisterOverlayOptions = Omit<CreateOverlayHandleOptions, 'zIndex' | 'firstInCategory'>;

// Global stack that coordinates open overlays, ordering and close completion.
@Injectable({
  providedIn: 'root',
})
export class OverlayStack {
  private readonly openOverlays = signal<Map<string, OverlayHandle>>(new Map());
  private readonly pendingAfterClose = new Map<string, OverlayStackEntry>();
  private zIndexCounter = 0;

  readonly openOverlayList = computed(() => {
    const overlays = Array.from(this.openOverlays().values());
    return overlays.sort((left, right) => left.zIndex - right.zIndex);
  });

  readonly openDialogs = computed(() =>
    this.openOverlayList().filter(overlay => overlay.category === 'dialog')
  );

  readonly hasOpenDialogs = computed(() => this.openDialogs().length > 0);

  readonly dialogCount = computed(() => this.openDialogs().length);

  readonly topmost = computed(() => {
    const list = this.openOverlayList();
    return list.length > 0 ? list[list.length - 1] : null;
  });

  openByCategory(category: OverlayCategory): OverlayHandle[] {
    return this.openOverlayList().filter(overlay => overlay.category === category);
  }

  closeTopmost(): void {
    const list = this.openOverlayList();
    for (let index = list.length - 1; index >= 0; index--) {
      const overlay = list[index];
      if (!ESCAPE_SKIP_CATEGORIES.has(overlay.category)) {
        overlay.close();
        return;
      }
    }
  }

  closeAllByCategory(category: OverlayCategory): void {
    const overlays = this.openByCategory(category);
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

  createOverlay(
    isOpen: WritableSignal<boolean>,
    config: OverlayRenderConfigSignal,
    setup?: (overlay: OverlaySession) => void,
  ): Signal<OverlayHandle | null> {
    const overlayHandle = signal<OverlayHandle | null>(null);
    const destroyRef = inject(DestroyRef);
    const injector = inject(Injector);

    let currentHandle: OverlayHandle | null = null;
    let configSyncEffect: EffectRef | null = null;
    let pendingOpenEffect: EffectRef | null = null;
    let setupCleanups: Array<() => void> = [];
    let afterOpenedHandlers: Array<(overlay: OverlayHandle) => void> = [];
    let afterCloseHandlers: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void> = [];
    let beforeCloseHandlers: Array<
      (ctx: OverlayCloseContext, overlay: OverlayHandle, reason: OverlayCloseReason) => void
    > = [];
    let afterOpenedRenderRef: AfterRenderRef | null = null;

    const cleanupSetup = () => {
      for (const cleanup of setupCleanups.splice(0)) {
        cleanup();
      }
    };

    const destroyConfigSync = () => {
      configSyncEffect?.destroy();
      configSyncEffect = null;
    };

    const destroyPendingOpen = () => {
      pendingOpenEffect?.destroy();
      pendingOpenEffect = null;
    };

    const destroyAfterOpenedRender = () => {
      afterOpenedRenderRef?.destroy();
      afterOpenedRenderRef = null;
    };

    const runBeforeClose = (handle: OverlayHandle, reason: OverlayCloseReason) => {
      const ctx: OverlayCloseContext = {
        activeElement: document.activeElement as HTMLElement | null,
      };

      for (const handler of beforeCloseHandlers) {
        handler(ctx, handle, reason);
      }
    };

    const teardown = (reason: OverlayCloseReason) => {
      const handle = currentHandle;
      destroyPendingOpen();
      if (!handle) {
        return;
      }

      destroyConfigSync();
      destroyAfterOpenedRender();
      cleanupSetup();

      if (!handle.closed) {
        runBeforeClose(handle, reason);
      }

      this.removeOverlay(handle);
      if (afterCloseHandlers.length > 0) {
        this.pendingAfterClose.set(handle.id, {
          handle,
          reason,
          handlers: [...afterCloseHandlers],
        });
      }

      currentHandle = null;
      afterOpenedHandlers = [];
      afterCloseHandlers = [];
      beforeCloseHandlers = [];
      overlayHandle.set(null);
    };

    const requestClose = (handle: OverlayHandle, reason: OverlayCloseReason, event?: Event) => {
      if (handle !== currentHandle || handle.closed) {
        return;
      }

      markOverlayHandleClosedInternal(handle);
      runBeforeClose(handle, reason);
      isOpen.set(false);
    };

    const openOverlay = (initialConfig: OverlayRenderConfig) => {
      if (currentHandle || !initialConfig.templateRef) {
        return false;
      }

      destroyPendingOpen();

      const handle = this.addOverlay({
        templateRef: initialConfig.templateRef,
        category: initialConfig.category,
        referenceElement: initialConfig.referenceElement,
      });

      setOverlayHandleRequestCloseInternal(handle, (reason, event) =>
        requestClose(handle, reason, event),
      );
      currentHandle = handle;
      overlayHandle.set(handle);

      untracked(() => {
        configSyncEffect = effect(
          () => {
            const nextConfig: OverlayRenderConfig = config();
            syncOverlayHandleRenderConfigInternal(handle, {
              templateRef: nextConfig.templateRef,
              referenceElement: nextConfig.referenceElement,
            });
          },
          { injector },
        );

        if (setup) {
          setup({
            handle,
            requestClose: (reason, event) => requestClose(handle, reason, event),
            afterOpened: handler => afterOpenedHandlers.push(handler),
            afterClose: handler => afterCloseHandlers.push(handler),
            beforeClose: handler => beforeCloseHandlers.push(handler),
            effect: runner => effect(runner, { injector }),
            onCleanup: cleanup => setupCleanups.push(cleanup),
          });
        }

        afterOpenedRenderRef = afterNextRender(
          () => {
            if (currentHandle !== handle || handle.closed) {
              return;
            }

            for (const handler of afterOpenedHandlers) {
              handler(handle);
            }

            afterOpenedHandlers = [];
            afterOpenedRenderRef = null;
          },
          { injector },
        );
      });

      return true;
    };

    const ensurePendingOpen = () => {
      if (pendingOpenEffect) {
        return;
      }

      untracked(() => {
        pendingOpenEffect = effect(
          () => {
            if (!isOpen() || currentHandle) {
              destroyPendingOpen();
              return;
            }

            const pendingConfig = config();
            if (!pendingConfig.templateRef) {
              return;
            }

            openOverlay(pendingConfig);
          },
          { injector },
        );
      });
    };

    effect(() => {
      if (isOpen()) {
        if (currentHandle) {
          return;
        }

        const initialConfig = untracked(config);
        if (!openOverlay(initialConfig)) {
          ensurePendingOpen();
        }

        return;
      }

      destroyPendingOpen();
      if (currentHandle) {
        teardown('state');
      }
    });

    destroyRef.onDestroy(() => {
      teardown('destroy');
    });

    return overlayHandle.asReadonly();
  }

  private addOverlay(options: RegisterOverlayOptions): OverlayHandle {
    const category = options.category ?? 'popover';
    const zIndex = BASE_Z_INDEX[category] + ++this.zIndexCounter;
    let handle!: OverlayHandle;

    const firstInCategory = computed(() => {
      const firstOverlay = this.openOverlayList().find(overlay => overlay.category === category);
      return firstOverlay?.id === handle.id;
    });

    handle = createOverlayHandleInternal({ ...options, zIndex, firstInCategory });

    this.openOverlays.update(map => {
      const nextMap = new Map(map);
      nextMap.set(handle.id, handle);
      return nextMap;
    });

    return handle;
  }

  private removeOverlay(handle: OverlayHandle): void {
    this.openOverlays.update(map => {
      const nextMap = new Map(map);
      nextMap.delete(handle.id);
      return nextMap;
    });
  }
}

export function createOverlay(
  isOpen: WritableSignal<boolean>,
  config: OverlayRenderConfigSignal,
  setup?: (overlay: OverlaySession) => void,
): Signal<OverlayHandle | null> {
  return inject(OverlayStack).createOverlay(isOpen, config, setup);
}
