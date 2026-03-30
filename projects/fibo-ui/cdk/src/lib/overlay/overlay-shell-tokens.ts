import { InjectionToken, Type } from '@angular/core';

export const MODAL_SHELL_TOKEN = new InjectionToken<Type<any>>('fibo-ui/ModalShell', {
  factory: () => {
    throw new Error('[fibo-ui] No modal shell registered. Call provideOverlays() in app providers.');
  },
});

export const CONNECTED_SHELL_TOKEN = new InjectionToken<Type<any>>('fibo-ui/ConnectedShell', {
  factory: () => {
    throw new Error('[fibo-ui] No connected shell registered. Call provideOverlays() in app providers.');
  },
});

export const NOTIFICATION_SHELL_TOKEN = new InjectionToken<Type<any>>('fibo-ui/NotificationShell', {
  factory: () => {
    throw new Error('[fibo-ui] No notification shell registered. Call provideOverlays() in app providers.');
  },
});

export const DRAWER_SHELL_TOKEN = new InjectionToken<Type<any>>('fibo-ui/DrawerShell', {
  factory: () => {
    throw new Error(
      '[fibo-ui] No drawer shell registered. Call provideOverlays(withShell(DRAWER_SHELL_TOKEN, DrawerShellComponent)).',
    );
  },
});

export const TOOLTIP_SHELL_TOKEN = new InjectionToken<Type<any>>('fibo-ui/TooltipShell', {
  factory: () => {
    throw new Error('[fibo-ui] No tooltip shell registered. Call provideOverlays() in app providers.');
  },
});
