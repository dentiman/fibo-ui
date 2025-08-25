import {Component, computed, inject, TemplateRef, viewChild} from '@angular/core';
import {CommonModule, NgTemplateOutlet} from '@angular/common';
import {ClickOutside} from 'ngxtension/click-outside';
import {ConfirmationService} from './confirmation-service';


const DEFAULT_CONFIG = {
  title: 'Confirmation',
  message: 'Do you really want to perform action?',
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm'
} as const;

@Component({
  selector: 'fibo-confirmation',
  standalone: true,
  imports: [ClickOutside, NgTemplateOutlet, CommonModule],
  templateUrl: './confirmation.html',
})
export class FiboConfirmation {
  confirmation = inject(ConfirmationService);
  defaultContent = viewChild.required<TemplateRef<unknown>>('defaultContent');

  content = computed(() => {
    const config = this.confirmation.config();
    if (!config) return DEFAULT_CONFIG;

    return config.content instanceof TemplateRef
      ? DEFAULT_CONFIG
      : {...DEFAULT_CONFIG, ...config};
  });

  template = computed(() => {
    const config = this.confirmation.config();
    return config?.content instanceof TemplateRef
      ? config.content
      : this.defaultContent();
  });
}

