import {computed, inject, Injectable, signal, TemplateRef} from '@angular/core';
import {createOverlay} from '@fibo-ui/cdk';

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
  private cleanupTimer: ReturnType<typeof setTimeout> | null = null;

  containerTemplateRef = signal<TemplateRef<any> | null>(null);

  // Business state — reflects logical open/closed immediately.
  isOpen = signal(false);
  // Render data — stays valid during animate.leave so the template
  // content is visible while the outlet wrapper fades out.
  config = signal<ConfirmationConfig | null>(null);

  private content = computed(() => this.containerTemplateRef() ?? undefined);

  overlayRef = createOverlay({
    isOpen: this.isOpen,
    content: this.content,
    category: 'confirmation',
    onCloseRequest: () => this.scheduleConfigCleanup(),
  });

  open(config: ConfirmationConfig) {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }

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
    const ref = this.overlayRef();
    if (ref) {
      ref.close({ reason: 'programmatic' });
      return;
    }

    this.isOpen.set(false);
    this.scheduleConfigCleanup();
  }

  // Keep config during leave animation, then release payload/callback references.
  private scheduleConfigCleanup() {
    this.cleanupTimer = setTimeout(() => {
      if (!this.isOpen()) {
        this.config.set(null);
      }
      this.cleanupTimer = null;
    }, CONFIRMATION_LEAVE_CLEANUP_DELAY);
  }
}
