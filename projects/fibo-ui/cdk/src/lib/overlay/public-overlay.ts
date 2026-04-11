import {
  type InjectionToken,
  Injector,
  type Signal,
  type TemplateRef,
  type Type,
  type WritableSignal,
  computed,
  effect,
  inject,
  isDevMode,
  runInInjectionContext,
  signal,
  untracked,
} from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import type {
  ConnectedPosition,
  CoordinatePosition,
  GlobalPosition,
  OverlayBehaviorConfig,
  OverlayPositionConfig,
} from './overlay-config';
import type { OverlayHandle } from './overlay-handle';
import type { OverlaySession } from './overlay-session';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';
import {
  type TrapOverlayFocusOptions,
  restoreTriggerFocusOnClose,
  trapOverlayFocus,
} from './overlay-behaviors';
import { CONNECTED_SHELL_TOKEN, MODAL_SHELL_TOKEN } from './overlay-shell-tokens';
import { createOverlayInternal } from './overlay-stack';

// ─── Публічні типи ────────────────────────────────────────

export interface PublicOverlayFocusConfig {
  trap?: boolean | TrapOverlayFocusOptions;
  restoreTo?: () => HTMLElement | null;
}

export interface PublicOverlayCloseConfig {
  outsideClick?: boolean;
  escape?: boolean;
  focusLeave?: boolean;
  scroll?: boolean;
}

export interface PublicOverlayLifecycleConfig {
  afterOpened?: Array<(overlay: OverlayHandle) => void>;
  beforeClose?: Array<
    (ctx: OverlayCloseContext, overlay: OverlayHandle, reason: OverlayCloseReason) => void
  >;
  afterClose?: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void>;
  canClose?: Array<(reason: OverlayCloseReason, event?: Event) => boolean | void>;
}

export interface PublicConnectedPositionConfig {
  connectedTo: HTMLElement | null;
  placement?: Placement;
  matchWidth?: boolean;
  offset?: number;
}

export interface PublicCoordinatePositionConfig {
  x: number;
  y: number;
  placement?: Placement;
}

export type PublicOverlayPositionConfig =
  | PublicConnectedPositionConfig
  | PublicCoordinatePositionConfig
  | undefined;

export interface PublicOverlayConfig {
  state: WritableSignal<boolean>;
  content: TemplateRef<unknown> | string | null;
  position?: PublicOverlayPositionConfig;

  shell?: InjectionToken<Type<any>>;
  backdrop?: boolean;
  blockScroll?: boolean;

  focus?: PublicOverlayFocusConfig;
  close?: PublicOverlayCloseConfig;
  lifecycle?: PublicOverlayLifecycleConfig;

  setup?: (session: OverlaySession) => void;
}

// ─── Normalization helpers (module-private) ────────────────

type OverlayFamily = 'global' | 'connected' | 'coordinate';

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

function defaultShellFor(family: OverlayFamily): InjectionToken<Type<any>> {
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

function buildBehavior(
  initial: PublicOverlayConfig,
  family: OverlayFamily,
): OverlayBehaviorConfig {
  return {
    shell: initial.shell ?? defaultShellFor(family),
    needsBackdrop: initial.backdrop ?? defaultBackdropFor(family),
    blockScroll: initial.blockScroll ?? defaultBlockScrollFor(family),
    closeOnEscape: initial.close?.escape ?? true,
    closeOnOutsideClick: initial.close?.outsideClick ?? true,
    closeOnFocusLeave: initial.close?.focusLeave ?? defaultCloseFocusLeaveFor(family),
    closeOnScroll: initial.close?.scroll ?? false,
  };
}

function buildComposedSetup(
  initial: PublicOverlayConfig,
  family: OverlayFamily,
): ((session: OverlaySession) => void) | undefined {
  const trap = initial.focus?.trap ?? defaultTrapFor(family);
  const hasTrap = !!trap;
  const hasRestore = !!initial.focus?.restoreTo;
  const hasLifecycle = !!(
    initial.lifecycle?.afterOpened?.length ||
    initial.lifecycle?.beforeClose?.length ||
    initial.lifecycle?.afterClose?.length ||
    initial.lifecycle?.canClose?.length
  );
  const hasUserSetup = !!initial.setup;

  if (!hasTrap && !hasRestore && !hasLifecycle && !hasUserSetup) {
    return undefined;
  }

  return (session: OverlaySession) => {
    if (trap) {
      trapOverlayFocus(session, typeof trap === 'object' ? trap : undefined);
    }
    if (initial.focus?.restoreTo) {
      restoreTriggerFocusOnClose(session, initial.focus.restoreTo);
    }
    initial.lifecycle?.afterOpened?.forEach(h => session.afterOpened(h));
    initial.lifecycle?.beforeClose?.forEach(h => session.beforeClose(h));
    initial.lifecycle?.afterClose?.forEach(h => session.afterClose(h));
    initial.lifecycle?.canClose?.forEach(g => session.canClose(g));
    initial.setup?.(session);
  };
}

// ─── Публічний API ─────────────────────────────────────────

export function createOverlay(
  factory: () => PublicOverlayConfig,
): Signal<OverlayHandle | null> {
  const injector = inject(Injector);

  // 1. Reactive content / position — через computed; factory() не викликається
  //    під час конструктора, тому input.required() / viewChild.required() безпечні.
  const contentSignal = computed<TemplateRef<any> | string | null>(
    () => factory().content,
  );
  const positionSignal = computed<OverlayPositionConfig>(
    () => normalizePosition(factory().position),
  );

  // 2. Холдер внутрішнього handle — null до першого запуску ефекту.
  const innerRef = signal<Signal<OverlayHandle | null> | null>(null);

  // 3. Плаский результат: прозоро делегує внутрішньому handle після ініціалізації.
  const result = computed<OverlayHandle | null>(() => innerRef()?.() ?? null);

  // 4. Відкладена ініціалізація: ефект запускається ОДИН РАЗ після першого CD-циклу,
  //    коли required inputs і viewChild.required() вже доступні.
  //    Усі читання factory() обгорнуті в untracked → ефект не має реактивних залежностей
  //    і більше ніколи не перезапускається.
  effect(() => {
    const initial = untracked(() => factory());
    const state = initial.state;
    const initialFamily = detectFamily(initial.position);
    const behavior = buildBehavior(initial, initialFamily);
    const composedSetup = buildComposedSetup(initial, initialFamily);

    // 5. Виходимо з реактивного контексту (untracked обнуляє activeConsumer),
    //    щоб effect() / createOverlayInternal() не отримали NG0602
    //    ("effect() cannot be called from within a reactive context").
    untracked(() => {
      // 6. Dev-mode: position family guard.
      if (isDevMode()) {
        runInInjectionContext(injector, () => {
          effect(() => {
            const current = positionSignal();
            if (current.type !== initialFamily) {
              throw new Error(
                `[fibo-ui overlay] position family cannot change within a session: ` +
                `${initialFamily} → ${current.type}. Close the overlay and open a new one.`,
              );
            }
          });
        });
      }

      // 7. Делегуємо існуючому runtime через runInInjectionContext,
      //    щоб inject(DestroyRef) / inject(Injector) всередині отримали правильний контекст.
      const handle = runInInjectionContext(injector, () =>
        createOverlayInternal(state, behavior, positionSignal, contentSignal, composedSetup),
      );

      innerRef.set(handle);
    });
  });

  return result;
}
