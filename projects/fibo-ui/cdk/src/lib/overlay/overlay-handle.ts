import { InjectionToken, Signal, TemplateRef, WritableSignal, signal } from '@angular/core';
import type { OverlayCloseReason } from './overlay-session';

export type OverlayCategory =
  | 'popover'
  | 'menu'
  | 'dialog'
  | 'tooltip'
  | 'confirmation'
  | 'notification';

export interface CreateOverlayHandleOptions {
  templateRef: TemplateRef<any>;
  category?: OverlayCategory;
  referenceElement?: HTMLElement | null;
  zIndex: number;
  firstInCategory: Signal<boolean>;
}

// Runtime object for one currently open overlay.
export interface OverlayHandle {
  readonly id: string;
  readonly category: OverlayCategory;
  readonly zIndex: number;
  readonly firstInCategory: Signal<boolean>;
  readonly templateRef: TemplateRef<any> | undefined;
  readonly referenceElement: HTMLElement | null | undefined;
  readonly closed: boolean;
  close(): void;
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

  close(): void {
    if (this.closedState) {
      return;
    }

    this.requestClose?.('programmatic');
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

export const OVERLAY_HANDLE = new InjectionToken<OverlayHandle>('OVERLAY_HANDLE');

export function ɵcreateOverlayHandle(options: CreateOverlayHandleOptions): OverlayHandle {
  return new OverlayHandleImpl(options);
}

export function ɵsetOverlayHandleRequestClose(
  handle: OverlayHandle,
  requestClose: (reason: OverlayCloseReason, event?: Event) => void,
): void {
  (handle as OverlayHandleImpl).setRequestClose(requestClose);
}

export function ɵmarkOverlayHandleClosed(handle: OverlayHandle): void {
  (handle as OverlayHandleImpl).markClosed();
}

export function ɵsyncOverlayHandleRenderConfig(
  handle: OverlayHandle,
  config: {
    templateRef?: TemplateRef<any>;
    referenceElement?: HTMLElement | null;
  },
): void {
  (handle as OverlayHandleImpl).syncRenderConfig(config);
}

let nextOverlayId = 1;
