import type { InjectionToken, TemplateRef, Type } from '@angular/core';
import type { Placement } from '@floating-ui/dom';

export interface GlobalPosition {
  readonly type: 'global';
}

export interface ConnectedPosition {
  readonly type: 'connected';
  readonly placement?: Placement;
  readonly matchWidth?: boolean;
  readonly offset?: number;
}

export interface CoordinatePosition {
  readonly type: 'coordinate';
  readonly x: number;
  readonly y: number;
  readonly placement?: Placement;
}

export type OverlayPositionConfig = GlobalPosition | ConnectedPosition | CoordinatePosition;

export interface OverlayConfig {
  readonly content: TemplateRef<any> | string;
  readonly position: OverlayPositionConfig;
  readonly shell: InjectionToken<Type<any>>;
  readonly tag?: string;

  readonly needsBackdrop?: boolean;
  readonly closeOnEscape?: boolean;
  readonly closeOnOutsideClick?: boolean;
  readonly closeOnFocusLeave?: boolean;
  readonly closeOnScroll?: boolean;
  readonly blockScroll?: boolean;
  readonly trapFocus?: boolean;
  readonly restoreFocus?: boolean;

  readonly referenceElement?: HTMLElement | null;
  readonly focusReturnTarget?: HTMLElement | null;
}

export function globalPosition(): GlobalPosition {
  return { type: 'global' };
}

export function connectedPosition(options?: Omit<ConnectedPosition, 'type'>): ConnectedPosition {
  return { type: 'connected', ...options };
}

export function coordinatePosition(
  x: number,
  y: number,
  options?: Pick<CoordinatePosition, 'placement'>,
): CoordinatePosition {
  return { type: 'coordinate', x, y, ...options };
}
