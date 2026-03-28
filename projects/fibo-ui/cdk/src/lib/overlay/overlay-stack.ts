import {
  afterNextRender,
  AfterRenderRef,
  DestroyRef,
  EffectRef,
  Injectable,
  Injector,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import type { Signal, WritableSignal } from '@angular/core';
import type { OverlayCategory, OverlayHandle } from './overlay-handle';
import {
  CreateOverlayHandleOptions,
  createOverlayHandleInternal,
  markOverlayHandleClosedInternal,
  setOverlayHandleRequestCloseInternal,
  syncOverlayHandleRenderConfigInternal,
} from './overlay-handle-internal';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';
import {
  OverlaySession,
  OverlayStackEntry,
} from './overlay-session';
import type { OverlayStrategy } from './overlay-strategy';

type OverlayInput = OverlayStrategy | null | undefined;

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
  private readonly overlayParentIds = new Map<string, string | null>();
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
        overlay.close('escape');
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
    strategy: Signal<OverlayStrategy | null | undefined> | OverlayStrategy | null | undefined,
    setup?: (overlay: OverlaySession) => void,
  ): Signal<OverlayHandle | null>;
  createOverlay(
    isOpen: WritableSignal<boolean>,
    configOrStrategy: Signal<OverlayStrategy | null | undefined> | OverlayStrategy | null | undefined,
    setup?: (overlay: OverlaySession) => void,
  ): Signal<OverlayHandle | null> {
    const readOverlayInput = (): OverlayInput =>
      typeof configOrStrategy === 'function' ? configOrStrategy() : configOrStrategy;

    const isStrategy = (input: OverlayInput): input is OverlayStrategy =>
      !!input && typeof input === 'object' && 'kind' in input;
    const toStrategy = (input: OverlayInput): OverlayStrategy | null => {
      if (!input) {
        return null;
      }

      return isStrategy(input) ? input : null;
    };

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
    let closeGuards: Array<(reason: OverlayCloseReason, event?: Event) => boolean | void> = [];
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
      closeGuards = [];
      overlayHandle.set(null);
    };

    const requestClose = (handle: OverlayHandle, reason: OverlayCloseReason, event?: Event) => {
      if (handle !== currentHandle || handle.closed) {
        return;
      }

      for (const guard of closeGuards) {
        if (guard(reason, event) === false) {
          return;
        }
      }

      markOverlayHandleClosedInternal(handle);
      runBeforeClose(handle, reason);
      isOpen.set(false);
    };

    const openOverlay = (initialInput: OverlayInput) => {
      const initialStrategy = toStrategy(initialInput);

      if (currentHandle || !initialStrategy) {
        return false;
      }

      destroyPendingOpen();

      const handle = this.addOverlay({
        strategy: initialStrategy,
        templateRef: initialStrategy.config.templateRef,
        category: initialStrategy.category,
        referenceElement: initialStrategy.config.referenceElement,
        interactionRoot: initialStrategy.config.interactionRoot,
        focusReturnTarget: initialStrategy.config.focusReturnTarget,
      });

      setOverlayHandleRequestCloseInternal(handle, (reason, event) =>
        requestClose(handle, reason, event),
      );
      currentHandle = handle;
      overlayHandle.set(handle);

      untracked(() => {
        configSyncEffect = effect(
          () => {
            const nextStrategy = toStrategy(readOverlayInput());
            if (!nextStrategy) {
              return;
            }
            syncOverlayHandleRenderConfigInternal(handle, {
              templateRef: nextStrategy.config.templateRef,
              referenceElement: nextStrategy.config.referenceElement,
              interactionRoot: nextStrategy.config.interactionRoot,
              focusReturnTarget: nextStrategy.config.focusReturnTarget,
            });
          },
          { injector },
        );

        if (setup) {
          setup({
            handle,
            requestClose: (reason, event) => requestClose(handle, reason, event),
            findOverlayContainerId: target => this.findOverlayContainerId(target),
            isInOverlayBranch: target =>
              this.isOverlayInBranch(handle.id, this.findOverlayContainerId(target)),
            afterOpened: handler => afterOpenedHandlers.push(handler),
            afterClose: handler => afterCloseHandlers.push(handler),
            beforeClose: handler => beforeCloseHandlers.push(handler),
            canClose: guard => closeGuards.push(guard),
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

            const pendingStrategy = toStrategy(readOverlayInput());
            if (!pendingStrategy?.config.templateRef) {
              return;
            }

            openOverlay(pendingStrategy);
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

        const initialInput = untracked(readOverlayInput);
        if (!openOverlay(initialInput)) {
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

  private addOverlay(options: RegisterOverlayOptions & { strategy: OverlayStrategy }): OverlayHandle {
    const category = options.category ?? 'popover';
    const zIndex = BASE_Z_INDEX[category] + ++this.zIndexCounter;
    const parentOverlayId = this.findOverlayContainerId(options.referenceElement);
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
  configOrStrategy: Signal<OverlayStrategy | null | undefined> | OverlayStrategy | null | undefined,
  setup?: (overlay: OverlaySession) => void,
): Signal<OverlayHandle | null>;
export function createOverlay(
  isOpen: WritableSignal<boolean>,
  configOrStrategy: Signal<OverlayStrategy | null | undefined> | OverlayStrategy | null | undefined,
  setup?: (overlay: OverlaySession) => void,
): Signal<OverlayHandle | null> {
  const overlayStack = inject(OverlayStack);
  return overlayStack.createOverlay(isOpen, configOrStrategy, setup);
}
