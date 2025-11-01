import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {Notifier} from './notifier';
import {CommonModule, NgTemplateOutlet} from '@angular/common';
import {NotificationConfig} from './notifier';
@Component({
  selector: 'fibo-notification',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './notification.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Notification {

  notifications =  inject(Notifier).notifications;

  removeNotification(notification: NotificationConfig) {
    this.notifications.update(notifications =>
      notifications.filter(n => n !== notification)
    );
  }

}
