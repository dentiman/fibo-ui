import {computed, Injectable, linkedSignal, signal, TemplateRef} from '@angular/core';


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

  isVisible = linkedSignal({
    source: this.isOpen,
    computation: (isOpen) => isOpen
  })

  open(config: ConfirmationConfig | null = null) {
    this.config.set(config);
    if(config) {
      this.config.set(config);
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
    this.isVisible.set(false);
    setTimeout(
      () => {
        this.config.set(null);
      }, 300);
  }
}
