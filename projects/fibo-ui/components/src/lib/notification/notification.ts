import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {Notifier} from './notifier';
import {CommonModule, NgTemplateOutlet} from '@angular/common';
import {NotificationConfig} from './notifier';
import {LucideAngularModule} from 'lucide-angular';
@Component({
  selector: 'fibo-notification',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, LucideAngularModule],
  templateUrl: './notification.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-live': 'assertive',
    'class': 'pointer-events-none fixed inset-0 flex items-end sm:items-start '
  }
})
export class Notification {

  notifications =  inject(Notifier).notifications;

  removeNotification(notification: NotificationConfig) {
    this.notifications.update(notifications =>
      notifications.filter(n => n !== notification)
    );
  }

}
