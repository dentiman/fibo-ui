import {computed, Injectable, signal} from '@angular/core';
import {TemplateRef} from '@angular/core';

export type ConfirmationContent = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
} | TemplateRef<unknown>

export interface ConfirmationConfig {
  content?: ConfirmationContent | null;
  onConfirm: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  config = signal<ConfirmationConfig | null>(null);
  isOpen = computed(() => !!this.config());

  open(config: ConfirmationConfig) {
    this.config.set(config);
  }

  confirm() {
    this.config()?.onConfirm();
    this.close();
  }

  cancel() {
    this.close();
  }

  close() {
    this.config.set(null);
  }
}
