import {computed, Injectable, signal, TemplateRef} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  content = signal<TemplateRef<unknown> | null>(null);

  isOpen = computed(() => !!this.content());

  open(content: TemplateRef<unknown>) {
    this.content.set(content);
  }

  close() {
    this.content.set(null);
  }

}
