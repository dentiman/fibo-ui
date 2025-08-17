import {Injectable, signal, TemplateRef} from '@angular/core';

export  type NotificationType = 'info' | 'success' | 'warning' | 'danger';
export interface NotificationConfig {
  type?: NotificationType;
  message?: string;
  title?: string;
  template?: TemplateRef<unknown>;
  duration?: number; // Duration in seconds
}

@Injectable({
  providedIn: 'root'
})
export class Notifier {
  private readonly DEFAULT_DURATION = 5; // 5 seconds
  notifications = signal<NotificationConfig[]>([]);

  push(config: NotificationConfig) {
    const notification = {
      ...config,
      duration: config.duration ?? this.DEFAULT_DURATION
    };

    this.notifications.update(value => [...value, notification]);

    if (notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration * 1000); // Convert seconds to milliseconds
    }
  }

  removeNotification(notification: NotificationConfig) {
    this.notifications.update(notifications =>
      notifications.filter(n => n !== notification)
    );
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
