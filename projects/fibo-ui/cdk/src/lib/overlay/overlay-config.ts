import type { InjectionToken, Type } from '@angular/core';
import type { Placement } from '@floating-ui/dom';

export interface OverlayBehaviorConfig {
  readonly shell: InjectionToken<Type<any>>;
  readonly needsBackdrop?: boolean;
  readonly closeOnEscape?: boolean;
  readonly closeOnOutsideClick?: boolean;
  readonly closeOnFocusLeave?: boolean;
  readonly closeOnScroll?: boolean;
  readonly blockScroll?: boolean;
}

export interface GlobalPosition {
  readonly type: 'global';
}

export interface ConnectedPosition {
  readonly type: 'connected';
  readonly referenceElement: HTMLElement | null;
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

