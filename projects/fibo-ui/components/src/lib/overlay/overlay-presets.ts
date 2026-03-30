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
  content: TemplateRef<any> | string;
  referenceElement?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
}

export function dialogConfig(options: DialogConfigOptions): OverlayConfig {
  return {
    content: options.content,
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
  content: TemplateRef<any> | string;
  referenceElement?: HTMLElement | null;
  focusReturnTarget?: HTMLElement | null;
}

export function drawerConfig(options: DrawerConfigOptions): OverlayConfig {
  return {
    content: options.content,
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
  content: TemplateRef<any> | string;
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
    content: options.content,
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
  content: TemplateRef<any> | string;
  referenceElement?: HTMLElement | null;
  placement?: Placement;
  offset?: number;
  focusReturnTarget?: HTMLElement | null;
}

export function menuConfig(options: MenuConfigOptions): OverlayConfig {
  return {
    content: options.content,
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

export interface NotificationConfigOptions {
  content: TemplateRef<any> | string;
}

export function notificationConfig(options: NotificationConfigOptions): OverlayConfig {
  return {
    content: options.content,
    position: globalPosition(),
    shell: NOTIFICATION_SHELL_TOKEN,
    closeOnEscape: false,
  };
}
