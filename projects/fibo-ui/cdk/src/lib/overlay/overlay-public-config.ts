import type {
  InjectionToken,
  TemplateRef,
  Type,
  WritableSignal,
} from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import type { TrapOverlayFocusOptions } from './overlay-behaviors';
import type { OverlayHandle } from './overlay-handle';
import type { OverlaySession } from './overlay-session';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';

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
