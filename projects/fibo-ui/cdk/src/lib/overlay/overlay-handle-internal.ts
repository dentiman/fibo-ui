import { Signal, TemplateRef, WritableSignal, signal } from '@angular/core';
import type { OverlayCloseReason } from './overlay-session';
import { OverlayCategory, OverlayHandle } from './overlay-handle';

export interface CreateOverlayHandleOptions {
  templateRef: TemplateRef<any>;
  category?: OverlayCategory;
  referenceElement?: HTMLElement | null;
  zIndex: number;
  firstInCategory: Signal<boolean>;
}

class OverlayHandleImpl implements OverlayHandle {
  readonly id: string;
  readonly category: OverlayCategory;
  readonly zIndex: number;
  readonly firstInCategory: Signal<boolean>;

  private readonly templateRefSignal: WritableSignal<TemplateRef<any> | undefined>;
  private readonly referenceElementSignal: WritableSignal<HTMLElement | null | undefined>;

  private closedState = false;
  private requestClose?: (reason: OverlayCloseReason, event?: Event) => void;

  get templateRef(): TemplateRef<any> | undefined {
    return this.templateRefSignal();
  }

  get referenceElement(): HTMLElement | null | undefined {
    return this.referenceElementSignal();
  }

  get closed(): boolean {
    return this.closedState;
  }

  constructor(options: CreateOverlayHandleOptions) {
    this.id = `overlay-${nextOverlayId++}`;
    this.templateRefSignal = signal(options.templateRef);
    this.referenceElementSignal = signal(options.referenceElement);
    this.category = options.category ?? 'popover';
    this.zIndex = options.zIndex;
    this.firstInCategory = options.firstInCategory;
  }

  close(reason?: OverlayCloseReason): void {
    if (this.closedState) {
      return;
    }

    this.requestClose?.(reason ?? 'programmatic');
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
  }): void {
    this.templateRefSignal.set(config.templateRef);
    this.referenceElementSignal.set(config.referenceElement);
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
  },
): void {
  (handle as OverlayHandleImpl).syncRenderConfig(config);
}

let nextOverlayId = 1;
