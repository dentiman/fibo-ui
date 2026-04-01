import { TemplateRef, WritableSignal, signal } from '@angular/core';
import type { Signal } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import { OverlayHandle } from './overlay-handle';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

export interface CreateOverlayHandleOptions {
  behavior: OverlayBehaviorConfig;
  position: Signal<OverlayPositionConfig>;
  content: Signal<TemplateRef<any> | string | undefined>;
}

class OverlayHandleImpl implements OverlayHandle {
  readonly id: string;
  readonly behavior: OverlayBehaviorConfig;
  readonly position: Signal<OverlayPositionConfig>;
  readonly content: Signal<TemplateRef<any> | string | undefined>;

  private readonly interactionRootSignal: WritableSignal<HTMLElement | null | undefined>;

  private closedState = false;
  private requestCloseFn?: (reason: OverlayCloseReason, event?: Event) => void;

  get interactionRoot(): HTMLElement | null | undefined {
    return this.interactionRootSignal();
  }

  get closed(): boolean {
    return this.closedState;
  }

  constructor(options: CreateOverlayHandleOptions) {
    this.id = `overlay-${nextOverlayId++}`;
    this.behavior = options.behavior;
    this.position = options.position;
    this.content = options.content;
    this.interactionRootSignal = signal<HTMLElement | null | undefined>(undefined);
  }

  close(reason?: OverlayCloseReason): void {
    if (this.closedState) return;
    this.requestCloseFn?.(reason ?? 'programmatic');
  }

  setInteractionRoot(root: HTMLElement | null): void {
    this.interactionRootSignal.set(root);
  }

  setRequestClose(cb: (reason: OverlayCloseReason, event?: Event) => void): void {
    this.requestCloseFn = cb;
  }

  markClosed(): void {
    this.closedState = true;
  }
}

export function createOverlayHandleInternal(options: CreateOverlayHandleOptions): OverlayHandle {
  return new OverlayHandleImpl(options);
}

export function setOverlayHandleRequestCloseInternal(
  handle: OverlayHandle,
  requestClose: (reason: OverlayCloseReason, event?: Event) => void,
): void {
  (handle as OverlayHandleImpl).setRequestClose(requestClose);
}

export function markOverlayHandleClosedInternal(handle: OverlayHandle): void {
  (handle as OverlayHandleImpl).markClosed();
}

export function setOverlayHandleInteractionRootInternal(
  handle: OverlayHandle,
  root: HTMLElement | null,
): void {
  (handle as OverlayHandleImpl).setInteractionRoot(root);
}

export function getOverlayHandleInteractionRootInternal(
  handle: OverlayHandle,
): HTMLElement | null | undefined {
  return (handle as OverlayHandleImpl).interactionRoot;
}

let nextOverlayId = 1;
