import { TemplateRef, WritableSignal, signal } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import { OverlayHandle } from './overlay-handle';
import type { OverlayConfig } from './overlay-config';

export interface CreateOverlayHandleOptions {
  config: OverlayConfig;
  referenceElement?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
  zIndex: number;
}

class OverlayHandleImpl implements OverlayHandle {
  readonly id: string;
  readonly config: OverlayConfig;
  readonly zIndex: number;

  private readonly templateRefSignal: WritableSignal<TemplateRef<any> | undefined>;
  private readonly referenceElementSignal: WritableSignal<HTMLElement | null | undefined>;
  private readonly interactionRootSignal: WritableSignal<HTMLElement | null | undefined>;
  private readonly focusReturnTargetSignal: WritableSignal<HTMLElement | null | undefined>;

  private closedState = false;
  private requestClose?: (reason: OverlayCloseReason, event?: Event) => void;

  get templateRef(): TemplateRef<any> | undefined {
    return this.templateRefSignal();
  }

  get referenceElement(): HTMLElement | null | undefined {
    return this.referenceElementSignal();
  }

  get interactionRoot(): HTMLElement | null | undefined {
    return this.interactionRootSignal();
  }

  get focusReturnTarget(): HTMLElement | null | undefined {
    return this.focusReturnTargetSignal();
  }

  get closed(): boolean {
    return this.closedState;
  }

  constructor(options: CreateOverlayHandleOptions) {
    this.id = `overlay-${nextOverlayId++}`;
    this.config = options.config;
    this.templateRefSignal = signal(options.config.templateRef);
    this.referenceElementSignal = signal(options.referenceElement ?? options.config.referenceElement);
    this.interactionRootSignal = signal<HTMLElement | null | undefined>(undefined);
    this.focusReturnTargetSignal = signal(options.focusReturnTarget ?? options.config.focusReturnTarget);
    this.zIndex = options.zIndex;
  }

  close(reason?: OverlayCloseReason): void {
    if (this.closedState) return;
    this.requestClose?.(reason ?? 'programmatic');
  }

  setInteractionRoot(root: HTMLElement | null): void {
    this.interactionRootSignal.set(root);
  }

  setRequestClose(requestClose: (reason: OverlayCloseReason, event?: Event) => void): void {
    this.requestClose = requestClose;
  }

  markClosed(): void {
    this.closedState = true;
  }

  syncRenderConfig(config: {
    templateRef?: TemplateRef<any>;
    referenceElement?: HTMLElement | null;
    focusReturnTarget?: HTMLElement | null;
  }): void {
    this.templateRefSignal.set(config.templateRef);
    this.referenceElementSignal.set(config.referenceElement);
    this.focusReturnTargetSignal.set(config.focusReturnTarget);
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

export function syncOverlayHandleRenderConfigInternal(
  handle: OverlayHandle,
  config: {
    templateRef?: TemplateRef<any>;
    referenceElement?: HTMLElement | null;
    focusReturnTarget?: HTMLElement | null;
  },
): void {
  (handle as OverlayHandleImpl).syncRenderConfig(config);
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
