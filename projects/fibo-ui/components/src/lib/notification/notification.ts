import {Component, inject} from '@angular/core';
import {Notifier} from './notifier';
import {CommonModule} from '@angular/common';
import {NotificationConfig} from './notifier';
@Component({
  selector: 'sui-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',

})
export class Notification {

  notifications =  inject(Notifier).notifications;

  removeNotification(notification: NotificationConfig) {
    this.notifications.update(notifications =>
      notifications.filter(n => n !== notification)
    );
  }

}
