import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {Notifier, NotificationConfig} from './notifier';
import {NgTemplateOutlet} from '@angular/common';
import {LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'fibo-notification-overlay-container',
  imports: [NgTemplateOutlet, LucideAngularModule],
  templateUrl: './notification-overlay-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
export class NotificationOverlayContainer {
  private notifier = inject(Notifier);
  private root = viewChild.required<TemplateRef<any>>('root');

  notifications = this.notifier.notifications;

  removeNotification(notification: NotificationConfig) {
    this.notifier.removeNotification(notification);
  }

  constructor() {
    afterNextRender(() => {
      this.notifier.overlay.templateRef.set(this.root());
    });
  }
}
