import type { TemplateRef } from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import {
  type OverlayConfig,
  connectedPosition,
  globalPosition,
  CONNECTED_SHELL_TOKEN,
  DRAWER_SHELL_TOKEN,
  MODAL_SHELL_TOKEN,
  NOTIFICATION_SHELL_TOKEN,
} from '@fibo-ui/cdk';

export interface DialogConfigOptions {
  templateRef: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
}

export function dialogConfig(options: DialogConfigOptions): OverlayConfig {
  return {
    templateRef: options.templateRef,
    position: globalPosition(),
    shell: MODAL_SHELL_TOKEN,
    needsBackdrop: true,
    blockScroll: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    trapFocus: true,
    restoreFocus: true,
    referenceElement: options.referenceElement,
    focusReturnTarget: options.focusReturnTarget,
  };
}

export interface DrawerConfigOptions {
  templateRef: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
}

export function drawerConfig(options: DrawerConfigOptions): OverlayConfig {
  return {
    templateRef: options.templateRef,
    position: globalPosition(),
    shell: DRAWER_SHELL_TOKEN,
    needsBackdrop: true,
    blockScroll: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    trapFocus: true,
    restoreFocus: true,
    referenceElement: options.referenceElement,
    focusReturnTarget: options.focusReturnTarget,
  };
}

export interface ConnectedConfigOptions {
  templateRef: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  placement?: Placement;
  offset?: number;
  matchWidth?: boolean;
  focusReturnTarget?: HTMLElement | null;
  trapFocus?: boolean;
  restoreFocus?: boolean;
}

export function connectedConfig(options: ConnectedConfigOptions): OverlayConfig {
  return {
    templateRef: options.templateRef,
    position: connectedPosition({
      placement: options.placement,
      offset: options.offset,
      matchWidth: options.matchWidth,
    }),
    shell: CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: true,
    closeOnFocusLeave: true,
    closeOnEscape: true,
    restoreFocus: options.restoreFocus ?? true,
    trapFocus: options.trapFocus,
    referenceElement: options.referenceElement,
    focusReturnTarget: options.focusReturnTarget,
  };
}

export interface MenuConfigOptions {
  templateRef: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  placement?: Placement;
  offset?: number;
  focusReturnTarget?: HTMLElement | null;
}

export function menuConfig(options: MenuConfigOptions): OverlayConfig {
  return {
    templateRef: options.templateRef,
    position: connectedPosition({
      placement: options.placement ?? 'right-start',
      offset: options.offset ?? 1,
    }),
    shell: CONNECTED_SHELL_TOKEN,
    tag: 'menu',
    closeOnOutsideClick: true,
    closeOnFocusLeave: true,
    closeOnEscape: true,
    restoreFocus: true,
    referenceElement: options.referenceElement,
    focusReturnTarget: options.focusReturnTarget,
  };
}

export interface TooltipConfigOptions {
  templateRef: TemplateRef<any>;
  referenceElement?: HTMLElement | null;
  placement?: Placement;
}

export function tooltipConfig(options: TooltipConfigOptions): OverlayConfig {
  return {
    templateRef: options.templateRef,
    position: connectedPosition({ placement: options.placement ?? 'top' }),
    shell: CONNECTED_SHELL_TOKEN,
    closeOnScroll: true,
    closeOnEscape: false,
    referenceElement: options.referenceElement,
  };
}

export interface NotificationConfigOptions {
  templateRef: TemplateRef<any>;
}

export function notificationConfig(options: NotificationConfigOptions): OverlayConfig {
  return {
    templateRef: options.templateRef,
    position: globalPosition(),
    shell: NOTIFICATION_SHELL_TOKEN,
    closeOnEscape: false,
  };
}
