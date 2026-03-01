import {inject, Injectable, signal, TemplateRef} from '@angular/core';
import {OverlayRegistry} from '@fibo-ui/cdk';

export type NotificationType = 'info' | 'success' | 'warning' | 'danger';
export interface NotificationConfig {
  type?: NotificationType;
  message?: string;
  title?: string;
  template?: TemplateRef<unknown>;
  duration?: number; // Duration in seconds
  id?: symbol; // Internal ID for tracking timers
}

// Delay before unregistering the notification container from the overlay outlet.
// Must match the notify-slide-out CSS animation duration so the last item's
// inner @for animate.leave finishes before the outer @for removes the container.
const NOTIFY_LEAVE_DURATION = 200;

@Injectable({
  providedIn: 'root',
})
export class Notifier {
  private registry = inject(OverlayRegistry);
  private readonly DEFAULT_DURATION = 5; // 5 seconds
  notifications = signal<NotificationConfig[]>([]);
  private readonly timers = new Map<symbol, ReturnType<typeof setTimeout>>();
  private unregisterTimer: ReturnType<typeof setTimeout> | null = null;

  containerTemplateRef = signal<TemplateRef<any> | null>(null);

  push(config: NotificationConfig) {
    const id = Symbol('notification-id');
    const duration = config.duration ?? this.DEFAULT_DURATION;
    const notification: NotificationConfig = {
      ...config,
      duration,
      id,
    };

    const wasEmpty = this.notifications().length === 0;
    this.notifications.update(value => [...value, notification]);

    if (wasEmpty) {
      // Cancel pending container removal if a new notification arrives
      // during the leave animation window.
      if (this.unregisterTimer) {
        clearTimeout(this.unregisterTimer);
        this.unregisterTimer = null;
      }
      const tpl = this.containerTemplateRef();
      if (tpl) {
        this.registry.register('notification', tpl, undefined, 'notification');
      }
    }

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
      // Defer container removal so the last notification item's
      // animate.leave="notify-leave" (inner @for) can finish its slide-out
      // before the outlet's @for removes the container wrapper.
      this.unregisterTimer = setTimeout(() => {
        if (this.notifications().length === 0) {
          this.registry.unregister('notification');
        }
        this.unregisterTimer = null;
      }, NOTIFY_LEAVE_DURATION);
    }
  }

  success(message: string, duration?: number) {
    this.push({
      type: 'success',
      title: 'Success',
      message,
      duration: duration ?? this.DEFAULT_DURATION
    });
  }

  error(message: string, duration?: number) {
    this.push({
      type: 'danger',
      title: 'Error',
      message,
      duration
    });
  }

  warning(message: string, duration?: number) {
    this.push({
      type: 'warning',
      title: 'Warning',
      message,
      duration
    });
  }

  info(message: string, duration?: number) {
    this.push({
      type: 'info',
      title: 'Information',
      message,
      duration
    });
  }
}
