import type { TemplateRef } from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import type { OverlayRenderConfig } from './overlay-session';

export type OverlayStrategyKind = 'connected' | 'modal' | 'menu' | 'tooltip' | 'notification';

export type OverlayShellKind = OverlayStrategyKind;

export type OverlayRuntimeCategory = 'popover' | 'menu' | 'dialog' | 'tooltip' | 'notification';

export type OverlayBehaviorId =
  | 'closeOnOutsideClick'
  | 'closeOnFocusLeave'
  | 'trapOverlayFocus'
  | 'restoreTriggerFocusOnClose'
  | 'closeOnScroll'
  | 'blockScroll';

export interface BaseOverlayStrategyOptions {
  templateRef: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  interactionRoot?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
}

export interface ConnectedOverlayOptions extends BaseOverlayStrategyOptions {
  placement?: Placement;
  matchWidth?: boolean;
  offset?: number;
}

export interface ModalOverlayOptions extends BaseOverlayStrategyOptions {}

export interface MenuOverlayOptions extends BaseOverlayStrategyOptions {
  placement?: Placement;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
}

export interface TooltipOverlayOptions extends BaseOverlayStrategyOptions {
  placement?: Placement;
  showDelay?: number;
  hideDelay?: number;
}

export interface NotificationOverlayOptions extends BaseOverlayStrategyOptions {}

export interface OverlayStrategyBase<TKind extends OverlayStrategyKind, TOptions> {
  readonly kind: TKind;
  readonly shell: OverlayShellKind;
  readonly category: OverlayRuntimeCategory;
  readonly options: Readonly<TOptions>;
  readonly config: {
    readonly templateRef: TemplateRef<any>;
    readonly referenceElement?: HTMLElement | null;
    readonly interactionRoot?: HTMLElement | null;
    readonly focusReturnTarget?: HTMLElement | null;
    readonly category: OverlayRuntimeCategory;
  };
  readonly defaultBehaviors: ReadonlyArray<OverlayBehaviorId>;
}

export type ConnectedOverlayStrategy = OverlayStrategyBase<'connected', ConnectedOverlayOptions>;
export type ModalOverlayStrategy = OverlayStrategyBase<'modal', ModalOverlayOptions>;
export type MenuOverlayStrategy = OverlayStrategyBase<'menu', MenuOverlayOptions>;
export type TooltipOverlayStrategy = OverlayStrategyBase<'tooltip', TooltipOverlayOptions>;
export type NotificationOverlayStrategy = OverlayStrategyBase<'notification', NotificationOverlayOptions>;

function normalizeRenderConfig(
  options: BaseOverlayStrategyOptions,
  category: OverlayRuntimeCategory,
): OverlayStrategyBase<'connected', ConnectedOverlayOptions>['config'] {
  return {
    templateRef: options.templateRef,
    referenceElement: options.referenceElement,
    interactionRoot: options.interactionRoot,
    focusReturnTarget: options.focusReturnTarget,
    category,
  };
}

export function connectedOverlay(options: ConnectedOverlayOptions): ConnectedOverlayStrategy {
  return {
    kind: 'connected',
    shell: 'connected',
    category: 'popover',
    options: Object.freeze({ ...options }),
    config: normalizeRenderConfig(options, 'popover'),
    defaultBehaviors: Object.freeze([
      'closeOnOutsideClick',
      'closeOnFocusLeave',
      'restoreTriggerFocusOnClose',
    ]),
  };
}

export function modalOverlay(options: ModalOverlayOptions): ModalOverlayStrategy {
  return {
    kind: 'modal',
    shell: 'modal',
    category: 'dialog',
    options: Object.freeze({ ...options }),
    config: normalizeRenderConfig(options, 'dialog'),
    defaultBehaviors: Object.freeze([
      'blockScroll',
      'closeOnOutsideClick',
      'trapOverlayFocus',
      'restoreTriggerFocusOnClose',
    ]),
  };
}

export function menuOverlay(options: MenuOverlayOptions): MenuOverlayStrategy {
  return {
    kind: 'menu',
    shell: 'menu',
    category: 'menu',
    options: Object.freeze({ placement: 'right-start', offset: 1, openDelay: 0, closeDelay: 0, ...options }),
    config: normalizeRenderConfig(options, 'menu'),
    defaultBehaviors: Object.freeze([
      'closeOnOutsideClick',
      'closeOnFocusLeave',
      'restoreTriggerFocusOnClose',
    ]),
  };
}

export function tooltipOverlay(options: TooltipOverlayOptions): TooltipOverlayStrategy {
  return {
    kind: 'tooltip',
    shell: 'tooltip',
    category: 'tooltip',
    options: Object.freeze({ showDelay: 0, hideDelay: 0, ...options }),
    config: normalizeRenderConfig(options, 'tooltip'),
    defaultBehaviors: Object.freeze(['closeOnScroll']),
  };
}

export function notificationOverlay(options: NotificationOverlayOptions): NotificationOverlayStrategy {
  return {
    kind: 'notification',
    shell: 'notification',
    category: 'notification',
    options: Object.freeze({ ...options }),
    config: normalizeRenderConfig(options, 'notification'),
    defaultBehaviors: Object.freeze([]),
  };
}

export type OverlayStrategy =
  | ConnectedOverlayStrategy
  | ModalOverlayStrategy
  | MenuOverlayStrategy
  | TooltipOverlayStrategy
  | NotificationOverlayStrategy;
