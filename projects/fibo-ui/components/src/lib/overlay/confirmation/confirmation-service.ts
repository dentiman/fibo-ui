import { Injectable, signal, TemplateRef } from '@angular/core';
import { createSingletonOverlay } from '@fibo-ui/cdk';
import { dialogConfig } from '../overlay-presets';

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
  // Render data — stays valid during animate.leave so the template
  // content is visible while the outlet wrapper fades out.
  config = signal<ConfirmationConfig | null>(null);

  readonly overlay = createSingletonOverlay(
    tpl =>
      dialogConfig({
        content: tpl,
        referenceElement: this.config()?.referenceElement ?? null,
      }),
    session => {
      session.afterClose(() => {
        if (!this.overlay.isOpen()) {
          this.config.set(null);
        }
      });
    },
  );

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
