import {computed, linkedSignal, signal, TemplateRef} from '@angular/core';

export type DialogConfig = {
  mode?: 'dialog'|'drawer'
}

export default class ModalState {

  content = signal<TemplateRef<unknown>|null>(null);

  isOpen = computed(()=> !!this.content());
  isVisible = linkedSignal({
    source: this.isOpen,
    computation: (isOpen) => isOpen
  })

  config = signal< DialogConfig | null >(null);

  open(content: TemplateRef<unknown>, config: DialogConfig|null = null) {
    this.content.set(content);
    if(config) {
        this.config.set(config);
    }
  }

  close () {
    this.isVisible.set(false);
    setTimeout(
      () => {
        this.content.set(null);
        this.config.set(null);
      },300)
  };

}
