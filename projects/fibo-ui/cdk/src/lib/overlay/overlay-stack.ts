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
  isDevMode,
  runInInjectionContext,
  signal,
  untracked,
} from '@angular/core';
import type { Signal, WritableSignal } from '@angular/core';
import type { OverlayHandle } from './overlay-handle';
import { createOverlayHandle } from './overlay-handle-internal';
import {
  type TrapOverlayFocusOptions,
  restoreTriggerFocusOnClose,
  trapOverlayFocus,
} from './overlay-behaviors';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';
import { OverlaySession, OverlayStackEntry } from './overlay-session';
import type {
  ConnectedPosition,
  CoordinatePosition,
  GlobalPosition,
  OverlayBehaviorConfig,
  OverlayPositionConfig,
} from './overlay-config';
import type { PublicOverlayConfig, PublicOverlayPositionConfig } from './overlay-public-config';
import { CONNECTED_SHELL_TOKEN, MODAL_SHELL_TOKEN } from './overlay-shell-tokens';

type OverlayFamily = 'global' | 'connected' | 'coordinate';

interface OverlayLiveBindings {
  content: Signal<TemplateRef<any> | string | null>;
  position: Signal<OverlayPositionConfig>;
}

interface OverlayCreateSnapshot {
  state: WritableSignal<boolean>;
  family: OverlayFamily;
  behavior: OverlayBehaviorConfig;
  focus: PublicOverlayConfig['focus'];
  lifecycle: PublicOverlayConfig['lifecycle'];
  setup: PublicOverlayConfig['setup'];
}

function detectFamily(position: PublicOverlayPositionConfig): OverlayFamily {
  if (!position) return 'global';
  if ('connectedTo' in position) return 'connected';
  return 'coordinate';
}

function normalizePosition(position: PublicOverlayPositionConfig): OverlayPositionConfig {
  if (!position) return { type: 'global' } satisfies GlobalPosition;
  if ('connectedTo' in position) {
    return {
      type: 'connected',
      referenceElement: position.connectedTo,
      placement: position.placement,
      matchWidth: position.matchWidth,
      offset: position.offset,
    } satisfies ConnectedPosition;
  }

  return {
    type: 'coordinate',
    x: position.x,
    y: position.y,
    placement: position.placement,
  } satisfies CoordinatePosition;
}

function defaultShellFor(family: OverlayFamily) {
  return family === 'global' ? MODAL_SHELL_TOKEN : CONNECTED_SHELL_TOKEN;
}

function defaultBackdropFor(family: OverlayFamily): boolean {
  return family === 'global';
}

function defaultBlockScrollFor(family: OverlayFamily): boolean {
  return family === 'global';
}

function defaultCloseFocusLeaveFor(family: OverlayFamily): boolean {
  return family === 'connected';
}

function defaultTrapFor(family: OverlayFamily): false | TrapOverlayFocusOptions {
  return family === 'connected' ? false : { guard: true };
}

function createLiveBindings(factory: () => PublicOverlayConfig): OverlayLiveBindings {
  return {
    content: computed(() => factory().content),
    position: computed(() => normalizePosition(factory().position)),
  };
}

function readCreateSnapshot(factory: () => PublicOverlayConfig): OverlayCreateSnapshot {
  const config = factory();
  const family = detectFamily(config.position);

  return {
    state: config.state,
    family,
    behavior: {
      shell: config.shell ?? defaultShellFor(family),
      needsBackdrop: config.backdrop ?? defaultBackdropFor(family),
      blockScroll: config.blockScroll ?? defaultBlockScrollFor(family),
      closeOnEscape: config.close?.escape ?? true,
      closeOnOutsideClick: config.close?.outsideClick ?? true,
      closeOnFocusLeave: config.close?.focusLeave ?? defaultCloseFocusLeaveFor(family),
      closeOnScroll: config.close?.scroll ?? false,
    },
    focus: config.focus,
    lifecycle: config.lifecycle,
    setup: config.setup,
  };
}

function applySessionPolicies(session: OverlaySession, snapshot: OverlayCreateSnapshot): void {
  const trap = snapshot.focus?.trap ?? defaultTrapFor(snapshot.family);

  if (trap) {
    trapOverlayFocus(session, typeof trap === 'object' ? trap : undefined);
  }

  if (snapshot.focus?.restoreTo) {
    restoreTriggerFocusOnClose(session, snapshot.focus.restoreTo);
  }

  snapshot.lifecycle?.afterOpened?.forEach(handler => session.afterOpened(handler));
  snapshot.lifecycle?.beforeClose?.forEach(handler => session.beforeClose(handler));
  snapshot.lifecycle?.afterClose?.forEach(handler => session.afterClose(handler));
  snapshot.lifecycle?.canClose?.forEach(guard => session.canClose(guard));
  snapshot.setup?.(session);
}

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
    factory: () => PublicOverlayConfig,
  ): Signal<OverlayHandle | null> {
    const hostInjector = inject(Injector);
    const liveBindings = createLiveBindings(factory);
    const runtimeRef = signal<Signal<OverlayHandle | null> | null>(null);
    const result = computed<OverlayHandle | null>(() => runtimeRef()?.() ?? null);

    // Delay the first factory() call until the first render/effect pass so
    // required inputs/view queries used inside config remain safe to read.
    effect(() => {
      const snapshot = untracked(() => readCreateSnapshot(factory));

      untracked(() => {
        this.setupPositionFamilyGuard(snapshot.family, liveBindings.position, hostInjector);

        const runtime = runInInjectionContext(hostInjector, () =>
          this.createOverlayRuntime(
            snapshot.state,
            snapshot.behavior,
            liveBindings.position,
            liveBindings.content,
            session => applySessionPolicies(session, snapshot),
          ),
        );

        runtimeRef.set(runtime);
      });
    });

    return result;
  }

  private createOverlayRuntime(
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

  private setupPositionFamilyGuard(
    initialFamily: OverlayFamily,
    position: Signal<OverlayPositionConfig>,
    hostInjector: Injector,
  ): void {
    if (!isDevMode()) {
      return;
    }

    runInInjectionContext(hostInjector, () => {
      effect(() => {
        const current = position();
        if (current.type !== initialFamily) {
          throw new Error(
            '[fibo-ui overlay] position family cannot change within a session: ' +
            `${initialFamily} → ${current.type}. Close the overlay and open a new one.`,
          );
        }
      });
    });
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
