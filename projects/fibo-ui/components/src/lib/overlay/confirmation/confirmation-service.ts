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

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private registry = inject(OverlayRegistry);

  containerTemplateRef = signal<TemplateRef<any> | null>(null);

  // Business state — reflects logical open/closed immediately.
  isOpen = signal(false);
  // Render data — stays valid during animate.leave so the template
  // content is visible while the outlet wrapper fades out.
  config = signal<ConfirmationConfig | null>(null);

  open(config: ConfirmationConfig) {
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
    // Don't clear config — data must stay valid during the outlet's
    // animate.leave="overlay-leave" fade. It gets overwritten on next open().
    this.registry.unregister('confirmation');
  }
}
