import { Injectable, signal, TemplateRef } from '@angular/core';
import { createSingletonOverlay } from '@fibo-ui/cdk';
import { notificationConfig } from '../overlay-presets';

export type NotificationType = 'info' | 'success' | 'warning' | 'danger';
export interface NotificationConfig {
  type?: NotificationType;
  message?: string;
  title?: string;
  template?: TemplateRef<unknown>;
  duration?: number; // Duration in seconds
  id?: symbol; // Internal ID for tracking timers
}

@Injectable({
  providedIn: 'root',
})
export class Notifier {
  private readonly DEFAULT_DURATION = 5; // 5 seconds
  notifications = signal<NotificationConfig[]>([]);
  private readonly timers = new Map<symbol, ReturnType<typeof setTimeout>>();

  readonly overlay = createSingletonOverlay(tpl => notificationConfig({ content: tpl }));

  push(config: NotificationConfig) {
    const id = Symbol('notification-id');
    const duration = config.duration ?? this.DEFAULT_DURATION;
    const notification: NotificationConfig = { ...config, duration, id };

    this.notifications.update(value => [...value, notification]);
    this.overlay.isOpen.set(true);

    if (duration > 0) {
      const timerId = setTimeout(() => {
        this.removeNotification(notification);
      }, duration * 1000);

      this.timers.set(id, timerId);
    }
  }

  removeNotification(notification: NotificationConfig) {
    if (notification.id && this.timers.has(notification.id)) {
      clearTimeout(this.timers.get(notification.id)!);
      this.timers.delete(notification.id);
    }

    this.notifications.update(notifications => notifications.filter(n => n !== notification));

    if (this.notifications().length === 0) {
      this.overlay.isOpen.set(false);
    }
  }

  success(message: string, duration?: number) {
    this.push({ type: 'success', title: 'Success', message, duration: duration ?? this.DEFAULT_DURATION });
  }

  error(message: string, duration?: number) {
    this.push({ type: 'danger', title: 'Error', message, duration });
  }

  warning(message: string, duration?: number) {
    this.push({ type: 'warning', title: 'Warning', message, duration });
  }

  info(message: string, duration?: number) {
    this.push({ type: 'info', title: 'Information', message, duration });
  }
}
