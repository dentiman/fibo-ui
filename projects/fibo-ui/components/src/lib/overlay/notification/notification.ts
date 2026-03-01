import {Component, inject, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import {Notifier, NotificationConfig} from './notifier';
import {NgTemplateOutlet} from '@angular/common';
import {LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'fibo-notification',
  imports: [NgTemplateOutlet, LucideAngularModule],
  templateUrl: './notification.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'aria-live': 'assertive',
    'class': 'pointer-events-none fixed inset-0 flex items-end sm:items-start '
  },
  styles: `
    .notify-enter {
      animation: notify-slide-in 200ms ease-out;
    }
    .notify-leave {
      animation: notify-slide-out 200ms ease-in forwards;
    }

    @keyframes notify-slide-in {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes notify-slide-out {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  `,
})
export class Notification {
  private notifier = inject(Notifier);

  notifications = this.notifier.notifications;

  removeNotification(notification: NotificationConfig) {
    this.notifier.removeNotification(notification);
  }

}
