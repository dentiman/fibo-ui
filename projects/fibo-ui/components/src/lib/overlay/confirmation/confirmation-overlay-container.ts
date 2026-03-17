import {
  afterNextRender,
  Component,
  computed,
  inject,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {ConfirmationService} from './confirmation-service';
import {LucideAngularModule} from 'lucide-angular';
import {FocusTrap} from '@fibo-ui/cdk';

const DEFAULT_CONFIG = {
  title: 'Confirmation',
  message: 'Do you really want to perform action?',
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
} as const;

@Component({
  selector: 'fibo-confirmation-overlay-container',
  imports: [NgTemplateOutlet, LucideAngularModule, FocusTrap],
  templateUrl: './confirmation-overlay-container.html',
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

    /* Leave — triggered by outlet's animate.leave="overlay-leave" */
    .overlay-leave .confirm-backdrop {
      animation: confirm-fade-out 150ms ease-in forwards;
    }
    .overlay-leave .confirm-content {
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
export class ConfirmationOverlayContainer {
  confirmation = inject(ConfirmationService);
  private root = viewChild.required<TemplateRef<any>>('root');
  defaultContent = viewChild.required<TemplateRef<unknown>>('defaultContent');

  content = computed(() => {
    const config = this.confirmation.config();
    if (!config) return DEFAULT_CONFIG;

    if (!config.content || config.content instanceof TemplateRef) {
      return DEFAULT_CONFIG;
    }

    return {...DEFAULT_CONFIG, ...config.content};
  });

  template = computed(() => {
    const config = this.confirmation.config();
    return config?.content instanceof TemplateRef ? config.content : this.defaultContent();
  });

  constructor() {
    afterNextRender(() => {
      this.confirmation.containerTemplateRef.set(this.root());
    });
  }
}
