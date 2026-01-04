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
import {PopoverTrigger} from '../popover/popover-trigger';

@Directive({
  selector: 'ng-template[fiboPortalTemplate]',
  standalone: true
})
export class PortalTemplateDirective implements OnDestroy {
  isOpen =   model<boolean>();

  trigger = inject( PopoverTrigger, {optional: true})

  templateRef = inject<TemplateRef<any>>(TemplateRef);

  private portalRegistry = inject(PortalRegistry);


  // Generate unique ID for this portal instance
  private id = 'portal-' + Math.random().toString(36).substring(2, 10);

  constructor() {
    // If trigger exists, sync isOpen with trigger's isOpen signal
    if (this.trigger) {
      // Sync from trigger to model
      effect(() => {
        const triggerIsOpen = this.trigger!.isOpen();
        const modelIsOpen = this.isOpen();
        
        if (triggerIsOpen !== modelIsOpen) {
          this.isOpen.set(triggerIsOpen);
        }
      });

      // Sync from model to trigger
      effect(() => {
        const modelIsOpen = this.isOpen();
        const triggerIsOpen = this.trigger!.isOpen();
        
        if (modelIsOpen !== triggerIsOpen) {
          if (modelIsOpen) {
            this.trigger!.open();
          } else {
            this.trigger!.close();
          }
        }
      });
    }

    // Watch the isOpen signal and register/unregister accordingly
    effect(() => {
      const isOpen = this.isOpen();

      if (isOpen) {
        // Portal is opening - register it
        this.portalRegistry.register(this.id, this.templateRef, this.trigger ?? null);
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
