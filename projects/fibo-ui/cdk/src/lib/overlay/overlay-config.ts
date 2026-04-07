import { computed } from '@angular/core';
import type { InjectionToken, Signal, Type } from '@angular/core';
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

export function globalPosition(): GlobalPosition {
  return { type: 'global' };
}

export function connectedPosition(factory: () => Omit<ConnectedPosition, 'type'>): Signal<ConnectedPosition>;
export function connectedPosition(options?: Omit<ConnectedPosition, 'type'>): ConnectedPosition;
export function connectedPosition(
  factoryOrOptions?: (() => Omit<ConnectedPosition, 'type'>) | Omit<ConnectedPosition, 'type'>,
): Signal<ConnectedPosition> | ConnectedPosition {
  if (typeof factoryOrOptions === 'function') {
    const factory = factoryOrOptions;
    return computed(() => ({ type: 'connected', ...factory() }));
  }
  return { type: 'connected', referenceElement: null, ...factoryOrOptions };
}

export function coordinatePosition(
  factory: () => Omit<CoordinatePosition, 'type'>,
): Signal<CoordinatePosition>;
export function coordinatePosition(
  x: number,
  y: number,
  options?: Pick<CoordinatePosition, 'placement'>,
): CoordinatePosition;
export function coordinatePosition(
  factoryOrX: (() => Omit<CoordinatePosition, 'type'>) | number,
  y?: number,
  options?: Pick<CoordinatePosition, 'placement'>,
): Signal<CoordinatePosition> | CoordinatePosition {
  if (typeof factoryOrX === 'function') {
    const factory = factoryOrX;
    return computed(() => ({ type: 'coordinate', ...factory() }));
  }
  return { type: 'coordinate', x: factoryOrX, y: y!, ...options };
}
