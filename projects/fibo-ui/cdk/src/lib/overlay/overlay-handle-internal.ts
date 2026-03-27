import { Signal, TemplateRef, WritableSignal, signal } from '@angular/core';
import type { OverlayCloseReason } from './overlay-types';
import { OverlayCategory, OverlayHandle } from './overlay-handle';
import type { OverlayStrategy } from './overlay-strategy';

export interface CreateOverlayHandleOptions {
  templateRef: TemplateRef<any>;
  category?: OverlayCategory;
  strategy: OverlayStrategy;
  referenceElement?: HTMLElement | null;
  interactionRoot?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
  zIndex: number;
  firstInCategory: Signal<boolean>;
}

class OverlayHandleImpl implements OverlayHandle {
  readonly id: string;
  readonly category: OverlayCategory;
  readonly zIndex: number;
  readonly firstInCategory: Signal<boolean>;
  readonly strategy: OverlayStrategy;

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
    this.templateRefSignal = signal(options.templateRef);
    this.referenceElementSignal = signal(options.referenceElement);
    this.interactionRootSignal = signal(options.interactionRoot);
    this.focusReturnTargetSignal = signal(options.focusReturnTarget);
    this.strategy = options.strategy;
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
    interactionRoot?: HTMLElement | null;
    focusReturnTarget?: HTMLElement | null;
  }): void {
    this.templateRefSignal.set(config.templateRef);
    this.referenceElementSignal.set(config.referenceElement);
    this.interactionRootSignal.set(config.interactionRoot);
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
    interactionRoot?: HTMLElement | null;
    focusReturnTarget?: HTMLElement | null;
  },
): void {
  (handle as OverlayHandleImpl).syncRenderConfig(config);
}

let nextOverlayId = 1;
