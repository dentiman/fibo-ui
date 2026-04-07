import { signal } from '@angular/core';
import type { InjectionToken, Signal, TemplateRef, Type, WritableSignal } from '@angular/core';
import type { OverlayHandle } from './overlay-handle';
import type { OverlaySession } from './overlay-session';
import type { ConnectedPosition, CoordinatePosition } from './overlay-config';
import type { OverlayBehaviorConfig } from './overlay-config';
import type { TrapOverlayFocusOptions } from './overlay-behaviors';
import { globalPosition } from './overlay-config';
import { CONNECTED_SHELL_TOKEN, MODAL_SHELL_TOKEN } from './overlay-shell-tokens';
import { trapOverlayFocus, restoreTriggerFocusOnClose } from './overlay-behaviors';
import { createOverlay } from './overlay-stack';
import { createSingletonOverlay as createSingletonOverlayPrimitive } from './overlay-singleton';
import type { SingletonOverlay } from './overlay-singleton';

// ─── Connected Overlay ──────────────────────────────────────

export interface ConnectedOverlayOptions {
  /** Shell token override. Default: CONNECTED_SHELL_TOKEN */
  readonly shell?: InjectionToken<Type<any>>;
  /** Default: true */
  readonly closeOnOutsideClick?: boolean;
  /** Default: true */
  readonly closeOnEscape?: boolean;
  /** Default: true */
  readonly closeOnFocusLeave?: boolean;
  /** Default: false */
  readonly closeOnScroll?: boolean;
  /** Enable focus trapping. Default: false (connected overlays don't trap) */
  readonly trapFocus?: boolean | TrapOverlayFocusOptions;
  /** Element to restore focus to on close */
  readonly restoreFocusTo?: () => HTMLElement | null;
  /** Custom per-open-cycle logic (runs after focus wiring) */
  readonly setup?: (session: OverlaySession) => void;
}

export function createConnectedOverlay(
  isOpen: WritableSignal<boolean>,
  position: Signal<ConnectedPosition>,
  content: Signal<TemplateRef<any> | string | null>,
  options?: ConnectedOverlayOptions,
): Signal<OverlayHandle | null> {
  const behavior: OverlayBehaviorConfig = {
    shell: options?.shell ?? CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: options?.closeOnOutsideClick ?? true,
    closeOnEscape: options?.closeOnEscape ?? true,
    closeOnFocusLeave: options?.closeOnFocusLeave ?? true,
    closeOnScroll: options?.closeOnScroll ?? false,
  };

  return createOverlay(isOpen, behavior, position, content, session => {
    if (options?.trapFocus) {
      trapOverlayFocus(session, typeof options.trapFocus === 'object' ? options.trapFocus : undefined);
    }
    if (options?.restoreFocusTo) {
      restoreTriggerFocusOnClose(session, options.restoreFocusTo);
    }
    options?.setup?.(session);
  });
}

// ─── Global Overlay ─────────────────────────────────────────

export interface GlobalOverlayOptions {
  /** Shell token. Default: MODAL_SHELL_TOKEN */
  readonly shell?: InjectionToken<Type<any>>;
  /** Render backdrop. Default: true */
  readonly backdrop?: boolean;
  /** Block document scroll. Default: true */
  readonly blockScroll?: boolean;
  /** Default: true */
  readonly closeOnOutsideClick?: boolean;
  /** Default: true */
  readonly closeOnEscape?: boolean;
  /** Focus trap. Default: { guard: true }. Set false to disable. */
  readonly trapFocus?: false | TrapOverlayFocusOptions;
  /** Element to restore focus to on close */
  readonly restoreFocusTo?: () => HTMLElement | null;
  /** Custom per-open-cycle logic (runs after focus wiring) */
  readonly setup?: (session: OverlaySession) => void;
}

export function createGlobalOverlay(
  isOpen: WritableSignal<boolean>,
  content: Signal<TemplateRef<any> | string | null>,
  options?: GlobalOverlayOptions,
): Signal<OverlayHandle | null> {
  const behavior: OverlayBehaviorConfig = {
    shell: options?.shell ?? MODAL_SHELL_TOKEN,
    needsBackdrop: options?.backdrop ?? true,
    blockScroll: options?.blockScroll ?? true,
    closeOnOutsideClick: options?.closeOnOutsideClick ?? true,
    closeOnEscape: options?.closeOnEscape ?? true,
  };

  const position = signal(globalPosition());

  return createOverlay(isOpen, behavior, position, content, session => {
    if (options?.trapFocus !== false) {
      trapOverlayFocus(session, options?.trapFocus ?? { guard: true });
    }
    if (options?.restoreFocusTo) {
      restoreTriggerFocusOnClose(session, options.restoreFocusTo);
    }
    options?.setup?.(session);
  });
}

// ─── Coordinate Overlay ─────────────────────────────────────

export interface CoordinateOverlayOptions {
  /** Shell token. Default: CONNECTED_SHELL_TOKEN */
  readonly shell?: InjectionToken<Type<any>>;
  /** Default: true */
  readonly closeOnOutsideClick?: boolean;
  /** Default: true */
  readonly closeOnEscape?: boolean;
  /** Default: false */
  readonly closeOnFocusLeave?: boolean;
  /** Focus trap. Default: { guard: true } for a11y (context menus). Set false to disable. */
  readonly trapFocus?: false | TrapOverlayFocusOptions;
  /** Element to restore focus to on close */
  readonly restoreFocusTo?: () => HTMLElement | null;
  /** Custom per-open-cycle logic (runs after focus wiring) */
  readonly setup?: (session: OverlaySession) => void;
}

export function createCoordinateOverlay(
  isOpen: WritableSignal<boolean>,
  position: Signal<CoordinatePosition>,
  content: Signal<TemplateRef<any> | string | null>,
  options?: CoordinateOverlayOptions,
): Signal<OverlayHandle | null> {
  const behavior: OverlayBehaviorConfig = {
    shell: options?.shell ?? CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: options?.closeOnOutsideClick ?? true,
    closeOnEscape: options?.closeOnEscape ?? true,
    closeOnFocusLeave: options?.closeOnFocusLeave ?? false,
  };

  return createOverlay(isOpen, behavior, position, content, session => {
    if (options?.trapFocus !== false) {
      trapOverlayFocus(session, options?.trapFocus ?? { guard: true });
    }
    if (options?.restoreFocusTo) {
      restoreTriggerFocusOnClose(session, options.restoreFocusTo);
    }
    options?.setup?.(session);
  });
}

// ─── Singleton Variants ─────────────────────────────────────

export function createSingletonConnectedOverlay(
  position: Signal<ConnectedPosition>,
  options?: ConnectedOverlayOptions,
): SingletonOverlay {
  const behavior: OverlayBehaviorConfig = {
    shell: options?.shell ?? CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: options?.closeOnOutsideClick ?? true,
    closeOnEscape: options?.closeOnEscape ?? true,
    closeOnFocusLeave: options?.closeOnFocusLeave ?? true,
    closeOnScroll: options?.closeOnScroll ?? false,
  };

  return createSingletonOverlayPrimitive(behavior, position, session => {
    if (options?.trapFocus) {
      trapOverlayFocus(session, typeof options.trapFocus === 'object' ? options.trapFocus : undefined);
    }
    if (options?.restoreFocusTo) {
      restoreTriggerFocusOnClose(session, options.restoreFocusTo);
    }
    options?.setup?.(session);
  });
}

export function createSingletonGlobalOverlay(
  options?: GlobalOverlayOptions,
): SingletonOverlay {
  const behavior: OverlayBehaviorConfig = {
    shell: options?.shell ?? MODAL_SHELL_TOKEN,
    needsBackdrop: options?.backdrop ?? true,
    blockScroll: options?.blockScroll ?? true,
    closeOnOutsideClick: options?.closeOnOutsideClick ?? true,
    closeOnEscape: options?.closeOnEscape ?? true,
  };

  const position = signal(globalPosition());

  return createSingletonOverlayPrimitive(behavior, position, session => {
    if (options?.trapFocus !== false) {
      trapOverlayFocus(session, options?.trapFocus ?? { guard: true });
    }
    if (options?.restoreFocusTo) {
      restoreTriggerFocusOnClose(session, options.restoreFocusTo);
    }
    options?.setup?.(session);
  });
}
