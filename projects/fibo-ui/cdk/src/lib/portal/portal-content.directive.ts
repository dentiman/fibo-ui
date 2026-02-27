import {
  Directive,
  inject,
  OnDestroy,
  TemplateRef,
  effect,
  model
} from '@angular/core';
import { PortalRegistry } from './portal-registry';

@Directive({
  selector: 'ng-template[fiboPortalContent]',
})
export class PortalContent implements OnDestroy {
  isOpen = model<boolean>(false);

  templateRef = inject<TemplateRef<any>>(TemplateRef);

  private portalRegistry = inject(PortalRegistry);

  // Generate unique ID for this portal instance
  private id = 'portal-' + Math.random().toString(36).substring(2, 10);

  constructor() {
    // Watch the isOpen signal and register/unregister accordingly
    effect(() => {
      const isOpen = this.isOpen();

      if (isOpen) {
        this.portalRegistry.register(this.id, this.templateRef);
      } else {
        this.portalRegistry.unregister(this.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.portalRegistry.unregister(this.id);
  }
}
