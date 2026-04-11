import { Injectable, signal } from '@angular/core';
import { createOverlay } from '@fibo-ui/cdk';
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

  private readonly _state = signal(false);
  readonly templateRef = signal<TemplateRef<unknown> | null>(null);

  readonly overlay = createOverlay(() => ({
    state: this._state,
    content: this.templateRef(),
    focus: {
      restoreTo: () => this.config()?.referenceElement ?? null,
    },
    lifecycle: {
      afterClose: [
        () => {
          if (!this._state()) this.config.set(null);
        },
      ],
    },
  }));

  open(config: ConfirmationConfig) {
    this.config.set(config);
    this._state.set(true);
  }

  confirm() {
    this.config()?.onConfirm();
    this.close();
  }

  cancel() {
    this.close();
  }

  close() {
    this._state.set(false);
  }
}
