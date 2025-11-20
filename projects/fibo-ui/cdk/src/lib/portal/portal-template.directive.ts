import {
  Directive,
  inject,
  input,
  OnDestroy,
  TemplateRef,
  Signal,
  effect,
  DestroyRef, model
} from '@angular/core';
import { PortalRegistry } from './portal-registry';

@Directive({
  selector: 'ng-template[fiboPortalTemplate]',
  standalone: true
})
export class PortalTemplateDirective implements OnDestroy {
  isOpen =   model<boolean>();

  templateRef = inject<TemplateRef<any>>(TemplateRef);

  private portalRegistry = inject(PortalRegistry);


  // Generate unique ID for this portal instance
  private id = 'portal-' + Math.random().toString(36).substring(2, 10);

  constructor() {
    // Watch the isOpen signal and register/unregister accordingly
    effect(() => {
      const isOpen = this.isOpen();

      if (isOpen) {
        // Portal is opening - register it
        this.portalRegistry.register(this.id, this.templateRef);
      } else {
        // Portal is closing - unregister it
        this.portalRegistry.unregister(this.id);
      }
    });
  }

  ngOnDestroy(): void {
    // Safety cleanup: ensure portal is unregistered if directive is destroyed
    // (this handles edge case where directive is destroyed while portal is still open)
    this.portalRegistry.unregister(this.id);
  }
}
