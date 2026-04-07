import { Injectable, signal } from '@angular/core';
import { createSingletonGlobalOverlay } from '@fibo-ui/cdk';
import type { TemplateRef } from '@angular/core';

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
  config = signal<ConfirmationConfig | null>(null);

  readonly overlay = createSingletonGlobalOverlay({
    restoreFocusTo: () => this.config()?.referenceElement ?? null,
    setup: session => {
      session.afterClose(() => {
        if (!this.overlay.isOpen()) {
          this.config.set(null);
        }
      });
    },
  });

  open(config: ConfirmationConfig) {
    this.config.set(config);
    this.overlay.isOpen.set(true);
  }

  confirm() {
    this.config()?.onConfirm();
    this.close();
  }

  cancel() {
    this.close();
  }

  close() {
    this.overlay.isOpen.set(false);
  }
}
