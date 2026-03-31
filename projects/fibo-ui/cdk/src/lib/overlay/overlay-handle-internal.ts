import { TemplateRef, WritableSignal, signal } from '@angular/core';
import type { Signal } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import { OverlayHandle } from './overlay-handle';
import type { OverlayBehaviorConfig, OverlayPositionConfig } from './overlay-config';

export interface CreateOverlayHandleOptions {
  behavior: OverlayBehaviorConfig;
  position: OverlayPositionConfig;
  content: TemplateRef<any> | string;
}

class OverlayHandleImpl implements OverlayHandle {
  readonly id: string;
  readonly behavior: OverlayBehaviorConfig;

  private readonly positionSignal: WritableSignal<OverlayPositionConfig>;
  private readonly contentSignal: WritableSignal<TemplateRef<any> | string | undefined>;
  private readonly interactionRootSignal: WritableSignal<HTMLElement | null | undefined>;

  private closedState = false;
  private requestCloseFn?: (reason: OverlayCloseReason, event?: Event) => void;

  get position(): Signal<OverlayPositionConfig> {
    return this.positionSignal.asReadonly();
  }

  get content(): Signal<TemplateRef<any> | string | undefined> {
    return this.contentSignal.asReadonly();
  }

  get interactionRoot(): HTMLElement | null | undefined {
    return this.interactionRootSignal();
  }

  get closed(): boolean {
    return this.closedState;
  }

  constructor(options: CreateOverlayHandleOptions) {
    this.id = `overlay-${nextOverlayId++}`;
    this.behavior = options.behavior;
    this.positionSignal = signal(options.position);
    this.contentSignal = signal<TemplateRef<any> | string | undefined>(options.content);
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

  updatePosition(position: OverlayPositionConfig): void {
    this.positionSignal.set(position);
  }

  updateContent(content: TemplateRef<any> | string): void {
    this.contentSignal.set(content);
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

export function syncOverlayHandlePositionInternal(
  handle: OverlayHandle,
  position: OverlayPositionConfig,
): void {
  (handle as OverlayHandleImpl).updatePosition(position);
}

export function syncOverlayHandleContentInternal(
  handle: OverlayHandle,
  content: TemplateRef<any> | string,
): void {
  (handle as OverlayHandleImpl).updateContent(content);
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
