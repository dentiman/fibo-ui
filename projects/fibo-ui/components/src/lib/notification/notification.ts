import {Component, inject} from '@angular/core';
import {Notifier} from './notifier';
import {CommonModule} from '@angular/common';
import {NotificationConfig} from './notifier';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'sui-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({
          transform: 'translateX(0.5rem)',
          opacity: 0
        }),
        animate('200ms ease-out', style({
          transform: 'translateX(0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0)',
          opacity: 1
        }),
        animate('200ms ease-in', style({
          transform: 'translateX(0.5rem)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class Notification {

  notifications =  inject(Notifier).notifications;

  removeNotification(notification: NotificationConfig) {
    this.notifications.update(notifications =>
      notifications.filter(n => n !== notification)
    );
  }

}
