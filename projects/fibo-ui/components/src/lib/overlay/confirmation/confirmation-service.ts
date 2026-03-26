import {computed, Injectable, signal, TemplateRef} from '@angular/core';
import {
  blockScroll,
  closeOnBackdropClick,
  createOverlay,
  guardModalFocus,
  restoreTriggerFocusOnClose,
} from '@fibo-ui/cdk';

export type ConfirmationContent =
  | {
      title: string;
      message: string;
      confirmLabel?: string;
      cancelLabel?: string;
    }
  | TemplateRef<unknown>;

export interface ConfirmationConfig {
  content?: ConfirmationContent | null;
  onConfirm: () => void;
  referenceElement?: HTMLElement | null;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  containerTemplateRef = signal<TemplateRef<any> | null>(null);

  // Business state — reflects logical open/closed immediately.
  isOpen = signal(false);
  // Render data — stays valid during animate.leave so the template
  // content is visible while the outlet wrapper fades out.
  config = signal<ConfirmationConfig | null>(null);

  overlayConfig = computed(() => ({
    templateRef: this.containerTemplateRef() ?? undefined,
    referenceElement: this.config()?.referenceElement ?? null,
    category: 'confirmation' as const,
  }));

  overlayHandle = createOverlay(
    this.isOpen,
    this.overlayConfig,
    overlay => {
      closeOnBackdropClick(overlay);
      restoreTriggerFocusOnClose(overlay);
      blockScroll(overlay);
      guardModalFocus(overlay);
      overlay.afterClose(() => {
        if (!this.isOpen()) {
          this.config.set(null);
        }
      });
    },
  );

  open(config: ConfirmationConfig) {
    this.config.set(config);
    this.isOpen.set(true);
  }

  confirm() {
    this.config()?.onConfirm();
    this.close();
  }

  cancel() {
    this.close();
  }

  close() {
    this.isOpen.set(false);
  }
}
