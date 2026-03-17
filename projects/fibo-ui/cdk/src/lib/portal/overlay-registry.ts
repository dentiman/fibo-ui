import {
  afterNextRender,
  AfterRenderRef,
  DestroyRef,
  EffectRef,
  Injectable,
  InjectionToken,
  Injector,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { TemplateRef } from '@angular/core';

export type OverlayCategory =
  | 'popover'
  | 'menu'
  | 'dialog'
  | 'tooltip'
  | 'confirmation'
  | 'notification';

const BASE_Z_INDEX: Record<OverlayCategory, number> = {
  dialog: 500,
  confirmation: 600,
  popover: 1000,
  menu: 1000,
  tooltip: 2000,
  notification: 3000,
};

const ESCAPE_SKIP_CATEGORIES: Set<OverlayCategory> = new Set(['notification', 'tooltip']);

export interface OverlayCloseContext {
  activeElement: HTMLElement | null;
}

export interface RegisterOverlayOptions {
  templateRef: TemplateRef<any>;
  category?: OverlayCategory;
  referenceElement?: HTMLElement | null;
}

let nextOverlayId = 0;

export class OverlayRef {
  readonly id: string;
  readonly category: OverlayCategory;
  readonly zIndex: number;
  readonly firstInCategory: Signal<boolean>;

  private readonly _templateRef: WritableSignal<TemplateRef<any> | undefined>;
  private readonly _referenceElement: WritableSignal<HTMLElement | null | undefined>;

  private _closed = false;

  _requestClose?: (reason: OverlayCloseReason, event?: Event) => void;

  get templateRef(): TemplateRef<any> | undefined {
    return this._templateRef();
  }

  get referenceElement(): HTMLElement | null | undefined {
    return this._referenceElement();
  }

  get closed() {
    return this._closed;
  }

  constructor(
    options: RegisterOverlayOptions & { zIndex: number; firstInCategory: Signal<boolean> }
  ) {
    this.id = `overlay-${++nextOverlayId}`;
    this._templateRef = signal(options.templateRef);
    this._referenceElement = signal(options.referenceElement);
    this.category = options.category ?? 'popover';
    this.zIndex = options.zIndex;
    this.firstInCategory = options.firstInCategory;
  }

  close() {
    if (this._closed) return;
    this._requestClose?.('programmatic');
  }

  _markClosed() {
    this._closed = true;
  }

  _syncConfig(config: Pick<OverlayConfig, 'templateRef' | 'referenceElement'>) {
    this._templateRef.set(config.templateRef);
    this._referenceElement.set(config.referenceElement);
  }
}

export const OVERLAY_REF = new InjectionToken<OverlayRef>('OVERLAY_REF');

export interface OverlayConfig {
  templateRef?: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  category: OverlayCategory;
}

export type OverlayCloseReason =
  | 'programmatic'
  | 'escape'
  | 'focusout'
  | 'outside-click'
  | 'backdrop'
  | 'blur'
  | 'state'
  | 'destroy';

export interface OverlaySetupContext {
  ref: OverlayRef;
  requestClose: (reason: OverlayCloseReason, event?: Event) => void;
  afterOpened: (handler: (overlay: OverlayRef) => void) => void;
  afterClose: (handler: (overlay: OverlayRef, reason: OverlayCloseReason) => void) => void;
  beforeClose: (
    handler: (
      ctx: OverlayCloseContext,
      overlay: OverlayRef,
      reason: OverlayCloseReason,
    ) => void,
  ) => void;
  effect: (runner: Parameters<typeof effect>[0]) => EffectRef;
  onCleanup: (cleanup: () => void) => void;
}

@Injectable({
  providedIn: 'root',
})
export class OverlayRegistry {
  private openPortals = signal<Map<string, OverlayRef>>(new Map());
  private pendingAfterClose = new Map<
    string,
    {
      ref: OverlayRef;
      reason: OverlayCloseReason;
      handlers: Array<(overlay: OverlayRef, reason: OverlayCloseReason) => void>;
    }
  >();
  private zIndexCounter = 0;

  openPortalsList = computed(() => {
    const portals = Array.from(this.openPortals().values());
    return portals.sort((a, b) => a.zIndex - b.zIndex);
  });

  openDialogs = computed(() =>
    this.openPortalsList().filter(p => p.category === 'dialog')
  );

  hasOpenDialogs = computed(() => this.openDialogs().length > 0);

  dialogCount = computed(() => this.openDialogs().length);

  topmost = computed(() => {
    const list = this.openPortalsList();
    return list.length > 0 ? list[list.length - 1] : null;
  });

  byCategory(category: OverlayCategory) {
    return this.openPortalsList().filter(p => p.category === category);
  }

  private register(options: RegisterOverlayOptions): OverlayRef {
    const category = options.category ?? 'popover';
    const zIndex = BASE_Z_INDEX[category] + ++this.zIndexCounter;
    let ref!: OverlayRef;
    const firstInCategory = computed(() => {
      const firstOverlay = this.openPortalsList().find((portal) => portal.category === category);
      return firstOverlay?.id === ref.id;
    });

    ref = new OverlayRef({ ...options, zIndex, firstInCategory });

    this.openPortals.update(map => {
      const newMap = new Map(map);
      newMap.set(ref.id, ref);
      return newMap;
    });

    return ref;
  }

  private unregister(ref: OverlayRef): void {
    this.openPortals.update(map => {
      const newMap = new Map(map);
      newMap.delete(ref.id);
      return newMap;
    });
  }

  closeTopmost(): void {
    const list = this.openPortalsList();
    for (let i = list.length - 1; i >= 0; i--) {
      const ref = list[i];
      if (!ESCAPE_SKIP_CATEGORIES.has(ref.category)) {
        ref.close();
        return;
      }
    }
  }

  closeAllByCategory(category: OverlayCategory): void {
    const portals = this.byCategory(category);
    for (const ref of [...portals].reverse()) {
      ref.close();
    }
  }

  completeAfterClose(id: string): void {
    const pending = this.pendingAfterClose.get(id);
    if (!pending) {
      return;
    }

    this.pendingAfterClose.delete(id);
    for (const handler of pending.handlers) {
      handler(pending.ref, pending.reason);
    }
  }

  createOverlay(
    isOpen: WritableSignal<boolean>,
    config: Signal<OverlayConfig>,
    setup?: (overlay: OverlaySetupContext) => void,
  ): Signal<OverlayRef | null> {
    const overlayRef = signal<OverlayRef | null>(null);
    const destroyRef = inject(DestroyRef);
    const injector = inject(Injector);

    let currentRef: OverlayRef | null = null;
    let configSyncEffect: EffectRef | null = null;
    let setupCleanups: Array<() => void> = [];
    let afterOpenedHandlers: Array<(overlay: OverlayRef) => void> = [];
    let afterCloseHandlers: Array<(overlay: OverlayRef, reason: OverlayCloseReason) => void> = [];
    let beforeCloseHandlers: Array<
      (ctx: OverlayCloseContext, overlay: OverlayRef, reason: OverlayCloseReason) => void
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

    const destroyAfterOpenedRender = () => {
      afterOpenedRenderRef?.destroy();
      afterOpenedRenderRef = null;
    };

    const runBeforeClose = (ref: OverlayRef, reason: OverlayCloseReason) => {
      const ctx: OverlayCloseContext = {
        activeElement: document.activeElement as HTMLElement | null,
      };
      for (const handler of beforeCloseHandlers) {
        handler(ctx, ref, reason);
      }
    };

    const teardown = (reason: OverlayCloseReason) => {
      const ref = currentRef;
      if (!ref) {
        return;
      }

      destroyConfigSync();
      destroyAfterOpenedRender();
      cleanupSetup();

      if (!ref.closed) {
        runBeforeClose(ref, reason);
      }

      this.unregister(ref);
      if (afterCloseHandlers.length > 0) {
        this.pendingAfterClose.set(ref.id, {
          ref,
          reason,
          handlers: [...afterCloseHandlers],
        });
      }
      currentRef = null;
      afterOpenedHandlers = [];
      afterCloseHandlers = [];
      beforeCloseHandlers = [];
      overlayRef.set(null);
    };

    const requestClose = (ref: OverlayRef, reason: OverlayCloseReason, event?: Event) => {
      if (ref !== currentRef || ref.closed) {
        return;
      }

      ref._markClosed();
      runBeforeClose(ref, reason);
      isOpen.set(false);
    };

    effect(() => {
      if (isOpen()) {
        if (currentRef) {
          return;
        }

        const initialConfig = untracked(config);
        if (!initialConfig.templateRef) {
          return;
        }

        const ref = this.register({
          templateRef: initialConfig.templateRef,
          category: initialConfig.category,
          referenceElement: initialConfig.referenceElement,
        });

        ref._requestClose = (reason, event) => requestClose(ref, reason, event);
        currentRef = ref;
        overlayRef.set(ref);

        untracked(() => {
          configSyncEffect = effect(
            () => {
              const nextConfig = config();
              ref._syncConfig({
                templateRef: nextConfig.templateRef,
                referenceElement: nextConfig.referenceElement,
              });
            },
            { injector },
          );

          if (setup) {
            setup({
              ref,
              requestClose: (reason, event) => requestClose(ref, reason, event),
              afterOpened: (handler) => afterOpenedHandlers.push(handler),
              afterClose: (handler) => afterCloseHandlers.push(handler),
              beforeClose: (handler) => beforeCloseHandlers.push(handler),
              effect: (runner) => effect(runner, { injector }),
              onCleanup: (cleanup) => setupCleanups.push(cleanup),
            });
          }

          afterOpenedRenderRef = afterNextRender(
            () => {
              if (currentRef !== ref || ref.closed) {
                return;
              }

              for (const handler of afterOpenedHandlers) {
                handler(ref);
              }
              afterOpenedHandlers = [];
              afterOpenedRenderRef = null;
            },
            { injector },
          );
        });

        return;
      }

      if (currentRef) {
        teardown('state');
      }
    });

    destroyRef.onDestroy(() => {
      teardown('destroy');
    });

    return overlayRef.asReadonly();
  }
}

export function createOverlay(
  isOpen: WritableSignal<boolean>,
  config: Signal<OverlayConfig>,
  setup?: (overlay: OverlaySetupContext) => void,
): Signal<OverlayRef | null> {
  return inject(OverlayRegistry).createOverlay(isOpen, config, setup);
}
