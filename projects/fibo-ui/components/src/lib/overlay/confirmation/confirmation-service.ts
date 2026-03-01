import {inject, Injectable, signal, TemplateRef} from '@angular/core';
import {OverlayRegistry} from '@fibo-ui/cdk';

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
}

// Must be >= outlet overlay leave animation duration (200ms)
// so confirmation content remains available until fade-out completes.
const CONFIRMATION_LEAVE_CLEANUP_DELAY = 220;

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private registry = inject(OverlayRegistry);
  private cleanupTimer: ReturnType<typeof setTimeout> | null = null;

  containerTemplateRef = signal<TemplateRef<any> | null>(null);

  // Business state — reflects logical open/closed immediately.
  isOpen = signal(false);
  // Render data — stays valid during animate.leave so the template
  // content is visible while the outlet wrapper fades out.
  config = signal<ConfirmationConfig | null>(null);

  open(config: ConfirmationConfig) {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    this.config.set(config);
    this.isOpen.set(true);
    const tpl = this.containerTemplateRef();
    if (tpl) {
      this.registry.register('confirmation', tpl, undefined, 'confirmation', () => this.close());
    }
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
    this.registry.unregister('confirmation');

    // Keep config during leave animation, then release payload/callback references.
    this.cleanupTimer = setTimeout(() => {
      if (!this.isOpen()) {
        this.config.set(null);
      }
      this.cleanupTimer = null;
    }, CONFIRMATION_LEAVE_CLEANUP_DELAY);
  }
}
