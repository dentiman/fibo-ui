import { signal } from '@angular/core';
import type { InjectionToken, Signal, TemplateRef, Type, WritableSignal } from '@angular/core';
import type { OverlayHandle } from './overlay-handle';
import type { OverlaySession } from './overlay-session';
import type { ConnectedPosition, CoordinatePosition, OverlayBehaviorConfig } from './overlay-config';
import type { TrapOverlayFocusOptions } from './overlay-behaviors';
import { globalPosition } from './overlay-config';
import { CONNECTED_SHELL_TOKEN, MODAL_SHELL_TOKEN } from './overlay-shell-tokens';
import { trapOverlayFocus, restoreTriggerFocusOnClose } from './overlay-behaviors';
import { createOverlay } from './overlay-stack';
import { createSingletonOverlay as createSingletonOverlayPrimitive } from './overlay-singleton';
import type { SingletonOverlay } from './overlay-singleton';

// ─── Shared option types ────────────────────────────────────

interface FocusOptions {
  readonly trapFocus?: boolean | false | TrapOverlayFocusOptions;
  readonly restoreFocusTo?: () => HTMLElement | null;
  readonly setup?: (session: OverlaySession) => void;
}

// ─── Connected Overlay ──────────────────────────────────────

export interface ConnectedOverlayOptions extends FocusOptions {
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
}

export interface GlobalOverlayOptions extends FocusOptions {
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
}

export interface CoordinateOverlayOptions extends FocusOptions {
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
}

// ─── Internal helpers ───────────────────────────────────────

function buildConnectedBehavior(options?: ConnectedOverlayOptions): OverlayBehaviorConfig {
  return {
    shell: options?.shell ?? CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: options?.closeOnOutsideClick ?? true,
    closeOnEscape: options?.closeOnEscape ?? true,
    closeOnFocusLeave: options?.closeOnFocusLeave ?? true,
    closeOnScroll: options?.closeOnScroll ?? false,
  };
}

function buildGlobalBehavior(options?: GlobalOverlayOptions): OverlayBehaviorConfig {
  return {
    shell: options?.shell ?? MODAL_SHELL_TOKEN,
    needsBackdrop: options?.backdrop ?? true,
    blockScroll: options?.blockScroll ?? true,
    closeOnOutsideClick: options?.closeOnOutsideClick ?? true,
    closeOnEscape: options?.closeOnEscape ?? true,
  };
}

function buildCoordinateBehavior(options?: CoordinateOverlayOptions): OverlayBehaviorConfig {
  return {
    shell: options?.shell ?? CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: options?.closeOnOutsideClick ?? true,
    closeOnEscape: options?.closeOnEscape ?? true,
    closeOnFocusLeave: options?.closeOnFocusLeave ?? false,
  };
}

/**
 * Builds a setup callback that wires focus management from options,
 * then delegates to the caller's custom setup.
 *
 * Connected overlays: trapFocus defaults to off (pass `true` or options to enable).
 * Global/coordinate overlays: trapFocus defaults to `{ guard: true }` (pass `false` to disable).
 */
function buildSetup(
  options: FocusOptions | undefined,
  trapByDefault: false | TrapOverlayFocusOptions,
): ((session: OverlaySession) => void) | undefined {
  if (!options?.trapFocus && !trapByDefault && !options?.restoreFocusTo && !options?.setup) {
    return undefined;
  }

  return session => {
    const trap = options?.trapFocus ?? trapByDefault;
    if (trap) {
      trapOverlayFocus(session, typeof trap === 'object' ? trap : undefined);
    }
    if (options?.restoreFocusTo) {
      restoreTriggerFocusOnClose(session, options.restoreFocusTo);
    }
    options?.setup?.(session);
  };
}

// ─── Recipe functions ───────────────────────────────────────

/** Creates an overlay anchored to a trigger element (select, popover, menu, tooltip). */
export function createConnectedOverlay(
  isOpen: WritableSignal<boolean>,
  position: Signal<ConnectedPosition>,
  content: Signal<TemplateRef<any> | string | null>,
  options?: ConnectedOverlayOptions,
): Signal<OverlayHandle | null> {
  return createOverlay(
    isOpen,
    buildConnectedBehavior(options),
    position,
    content,
    buildSetup(options, false),
  );
}

/** Creates a centered/fixed overlay (dialog, drawer, notification). */
export function createGlobalOverlay(
  isOpen: WritableSignal<boolean>,
  content: Signal<TemplateRef<any> | string | null>,
  options?: GlobalOverlayOptions,
): Signal<OverlayHandle | null> {
  return createOverlay(
    isOpen,
    buildGlobalBehavior(options),
    signal(globalPosition()),
    content,
    buildSetup(options, { guard: true }),
  );
}

/** Creates an overlay positioned at x/y coordinates (context menu). */
export function createCoordinateOverlay(
  isOpen: WritableSignal<boolean>,
  position: Signal<CoordinatePosition>,
  content: Signal<TemplateRef<any> | string | null>,
  options?: CoordinateOverlayOptions,
): Signal<OverlayHandle | null> {
  return createOverlay(
    isOpen,
    buildCoordinateBehavior(options),
    position,
    content,
    buildSetup(options, { guard: true }),
  );
}

// ─── Singleton Variants ─────────────────────────────────────

/** Singleton connected overlay for service-driven patterns (e.g. TooltipService). */
export function createSingletonConnectedOverlay(
  position: Signal<ConnectedPosition>,
  options?: ConnectedOverlayOptions,
): SingletonOverlay {
  return createSingletonOverlayPrimitive(
    buildConnectedBehavior(options),
    position,
    buildSetup(options, false),
  );
}

/** Singleton global overlay for service-driven patterns (e.g. ConfirmationService, Notifier). */
export function createSingletonGlobalOverlay(
  options?: GlobalOverlayOptions,
): SingletonOverlay {
  return createSingletonOverlayPrimitive(
    buildGlobalBehavior(options),
    signal(globalPosition()),
    buildSetup(options, { guard: true }),
  );
}
