import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Notifier, Button } from '@fibo-ui/components';

@Component({
  selector: 'app-notification-page',
  imports: [Button],
  template: `
    <div class="flex flex-row gap-2 p-4">
      <button fiboButton fiboAppearance="primary" (click)="showSuccessNotification()">Success Notification</button>
      <button fiboButton fiboAppearance="primary" (click)="showInfoNotification()">Info Notification</button>
      <button fiboButton fiboAppearance="primary" (click)="showWarningNotification()">Warning Notification</button>
      <button fiboButton fiboAppearance="primary" (click)="showDangerNotification()">Danger Notification</button>
      <button fiboButton fiboAppearance="primary" (click)="showInfoNotification()">Info Notification</button>
      <button fiboButton fiboAppearance="primary" (click)="showCustomNotification()">Custom Notification </button>
    </div>

    <ng-template #defaultTemplate>
      <div class="flex">
        <div class="w-0 flex-1 p-4">
          <div class="flex items-start">
            <div class="shrink-0 pt-0.5">
              <img class="size-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80" alt="">
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-sm font-medium text-gray-900">Emilia Gates</p>
              <p class="mt-1 text-sm text-gray-500">Sure! 8:30pm works great!</p>
            </div>
          </div>
        </div>
        <div class="flex border-l border-gray-200">
          <button type="button" class="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden">Reply</button>
        </div>
      </div>
    </ng-template>
  `
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
