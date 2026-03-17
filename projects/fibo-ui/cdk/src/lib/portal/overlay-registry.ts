import {
  Injectable,
  InjectionToken,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
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
  context?: Record<string, any>;
  category?: OverlayCategory;
  referenceElement?: HTMLElement;
}

let nextOverlayId = 0;

export class OverlayRef {
  readonly id: string;
  readonly templateRef: TemplateRef<any>;
  readonly context: Record<string, any>;
  readonly category: OverlayCategory;
  readonly zIndex: number;
  readonly firstInCategory: Signal<boolean>;
  readonly referenceElement?: HTMLElement;

  private _closed = false;

  /** Set by createOverlay — captures close side-effects and isOpen.set(false). */
  _onClose?: () => void;

  get closed() {
    return this._closed;
  }

  constructor(
    options: RegisterOverlayOptions & { zIndex: number; firstInCategory: Signal<boolean> }
  ) {
    this.id = `overlay-${++nextOverlayId}`;
    this.templateRef = options.templateRef;
    this.context = options.context ?? {};
    this.category = options.category ?? 'popover';
    this.zIndex = options.zIndex;
    this.firstInCategory = options.firstInCategory;
    this.referenceElement = options.referenceElement;
  }

  close() {
    if (this._closed) return;
    this._closed = true;
    this._onClose?.();
  }
}

export const OVERLAY_REF = new InjectionToken<OverlayRef>('OVERLAY_REF');

@Injectable({
  providedIn: 'root',
})
export class OverlayRegistry {
  private openPortals = signal<Map<string, OverlayRef>>(new Map());
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

  /**
   * Creates a reactive overlay binding. Must be called in injection context.
   *
   * Reacts to `isOpen` signal: when true — registers overlay in OverlayRegistry,
   * when false — unregisters. Returns a signal holding the current OverlayRef or null.
   *
   * When external code calls `overlayRef.close()` (e.g. Escape via registry,
   * click outside via Popover directive), the flow is:
   * 1. `activeElement` is captured, `onCloseRequest` callback is invoked
   * 2. `isOpen` is set to false automatically
   * 3. Effect cleanup unregisters the overlay
   */
  createOverlay(options: CreateOverlayOptions): Signal<OverlayRef | null> {
    const overlayRef = signal<OverlayRef | null>(null);

    effect(onCleanup => {
      const template = options.content();
      if (options.isOpen() && template) {
        const category =
          typeof options.category === 'function'
            ? options.category()
            : (options.category ?? 'popover');

        const ref = this.register({
          templateRef: template,
          context: options.context,
          category,
          referenceElement: options.referenceElement,
        });

        ref._onClose = () => {
          const ctx: OverlayCloseContext = {
            activeElement: document.activeElement as HTMLElement | null,
          };
          options.onCloseRequest?.(ctx, ref);
          options.isOpen.set(false);
        };

        overlayRef.set(ref);

        onCleanup(() => {
          // If ref.close() wasn't called (e.g. parent set isOpen to false directly),
          // fire onCloseRequest here so side-effects (focus restore, etc.) still run.
          if (!ref.closed) {
            const ctx: OverlayCloseContext = {
              activeElement: document.activeElement as HTMLElement | null,
            };
            options.onCloseRequest?.(ctx, ref);
          }
          this.unregister(ref);
          overlayRef.set(null);
        });
      }
    });

    return overlayRef.asReadonly();
  }
}

export interface CreateOverlayOptions {
  isOpen: WritableSignal<boolean>;
  content: Signal<TemplateRef<any> | undefined>;
  category?: OverlayCategory | Signal<OverlayCategory>;
  referenceElement?: HTMLElement;
  context?: Record<string, any>;
  onCloseRequest?: (ctx: OverlayCloseContext, overlay: OverlayRef) => void;
}

/**
 * Creates a reactive overlay binding. Must be called in injection context.
 *
 * Usage:
 * ```ts
 * overlayRef = createOverlay({
 *   isOpen: this.isOpen,
 *   content: this.templateRef,
 *   category: 'popover',
 *   referenceElement: this.element,
 *   onCloseRequest: (ctx, overlay) => {
 *     // side effects only — isOpen.set(false) is handled automatically
 *     restoreOverlayFocus(ctx, overlay, this.element);
 *   },
 * });
 * ```
 */
export function createOverlay(options: CreateOverlayOptions): Signal<OverlayRef | null> {
  return inject(OverlayRegistry).createOverlay(options);
}
