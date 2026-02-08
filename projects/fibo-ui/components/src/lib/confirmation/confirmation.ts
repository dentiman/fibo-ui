import {Component, computed, inject, TemplateRef, viewChild, ViewEncapsulation} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {ConfirmationService} from './confirmation-service';
import {LucideAngularModule} from 'lucide-angular';

const DEFAULT_CONFIG = {
  title: 'Confirmation',
  message: 'Do you really want to perform action?',
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm'
} as const;

@Component({
  selector: 'fibo-confirmation',
  imports: [NgTemplateOutlet, LucideAngularModule],
  templateUrl: './confirmation.html',
  encapsulation: ViewEncapsulation.None,
  styles: `
    /* Enter */
    .confirm-enter {
      animation: confirm-fade-in 200ms ease-out;
    }
    .confirm-enter .confirm-backdrop {
      animation: confirm-fade-in 200ms ease-out;
    }
    .confirm-enter .confirm-content {
      animation: confirm-content-in 200ms ease-out;
    }

    /* Leave */
    .confirm-leave {
      animation: confirm-fade-out 150ms ease-in forwards;
    }
    .confirm-leave .confirm-backdrop {
      animation: confirm-fade-out 150ms ease-in forwards;
    }
    .confirm-leave .confirm-content {
      animation: confirm-content-out 150ms ease-in forwards;
    }

    @keyframes confirm-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes confirm-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes confirm-content-in {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(8px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    @keyframes confirm-content-out {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.95) translateY(8px);
      }
    }
  `,
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
