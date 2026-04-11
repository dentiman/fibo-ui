import {
  type InjectionToken,
  type Signal,
  type TemplateRef,
  type Type,
  type WritableSignal,
  computed,
  effect,
  isDevMode,
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
  // 1. Snapshot-секції читаємо в untracked, без підписок.
  const initial = untracked(() => factory());
  const state = initial.state;
  const initialFamily = detectFamily(initial.position);
  const behavior = buildBehavior(initial, initialFamily);
  const composedSetup = buildComposedSetup(initial, initialFamily);

  // 2. Reactive content / position — через computed.
  const contentSignal = computed<TemplateRef<any> | string | null>(
    () => factory().content,
  );
  const positionSignal = computed<OverlayPositionConfig>(
    () => normalizePosition(factory().position),
  );

  // 3. Dev-mode: position family guard.
  if (isDevMode()) {
    effect(() => {
      const current = positionSignal();
      if (current.type !== initialFamily) {
        throw new Error(
          `[fibo-ui overlay] position family cannot change within a session: ` +
          `${initialFamily} → ${current.type}. Close the overlay and open a new one.`,
        );
      }
    });
  }

  // 4. Делегуємо існуючому runtime.
  return createOverlayInternal(state, behavior, positionSignal, contentSignal, composedSetup);
}
