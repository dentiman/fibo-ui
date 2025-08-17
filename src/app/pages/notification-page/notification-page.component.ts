import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Notifier } from '@fibo-ui/components';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html'
})
export class NotificationPageComponent {
  private notifier = inject(Notifier);
  @ViewChild('defaultTemplate') defaultTemplate!: TemplateRef<unknown>;

  showSuccessNotification() {
    this.notifier.success('Operation completed successfully', 3);
  }

  showInfoNotification() {
    this.notifier.info('Here is some important information for you.', 5);
  }

  showWarningNotification() {
    this.notifier.warning('Please be careful with this operation.', 8);
  }

  showDangerNotification() {
    this.notifier.error('Something went wrong. Please try again.', 0);
  }

  showCustomNotification() {
    this.notifier.push({
      template: this.defaultTemplate,
      duration: 5 // 5 seconds
    });
  }
}
