import { Directive, inject, OnDestroy, TemplateRef } from '@angular/core';
import { PORTAL_OWNER } from './portal-owner';

@Directive({
  selector: 'ng-template[fiboPortalContent]',
})
export class PortalContent implements OnDestroy {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private owner = inject(PORTAL_OWNER, { optional: true });

  constructor() {
    this.owner?.setPortalTemplate(this.templateRef);
  }

  ngOnDestroy(): void {
    this.owner?.setPortalTemplate(null);
  }
}
