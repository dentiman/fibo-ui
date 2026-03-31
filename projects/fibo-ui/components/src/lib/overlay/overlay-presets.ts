import type { OverlayBehaviorConfig } from '@fibo-ui/cdk';
import {
  CONNECTED_SHELL_TOKEN,
  DRAWER_SHELL_TOKEN,
  MODAL_SHELL_TOKEN,
  NOTIFICATION_SHELL_TOKEN,
  TOOLTIP_SHELL_TOKEN,
} from '@fibo-ui/cdk';

export function dialogBehavior(): OverlayBehaviorConfig {
  return {
    shell: MODAL_SHELL_TOKEN,
    needsBackdrop: true,
    blockScroll: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
  };
}

export function drawerBehavior(): OverlayBehaviorConfig {
  return {
    shell: DRAWER_SHELL_TOKEN,
    needsBackdrop: true,
    blockScroll: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
  };
}

export function connectedBehavior(): OverlayBehaviorConfig {
  return {
    shell: CONNECTED_SHELL_TOKEN,
    closeOnOutsideClick: true,
    closeOnFocusLeave: true,
    closeOnEscape: true,
  };
}

export function menuBehavior(): OverlayBehaviorConfig {
  return {
    shell: CONNECTED_SHELL_TOKEN,
    tag: 'menu',
    closeOnOutsideClick: true,
    closeOnFocusLeave: true,
    closeOnEscape: true,
  };
}

export function tooltipBehavior(): OverlayBehaviorConfig {
  return {
    shell: TOOLTIP_SHELL_TOKEN,
    closeOnScroll: true,
    closeOnEscape: false,
  };
}

export function notificationBehavior(): OverlayBehaviorConfig {
  return {
    shell: NOTIFICATION_SHELL_TOKEN,
    closeOnEscape: false,
  };
}
