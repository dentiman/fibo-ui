import { InjectionToken, TemplateRef } from '@angular/core';

export interface PortalOwner {
  setPortalTemplate(templateRef: TemplateRef<any> | null): void;
}

export const PORTAL_OWNER = new InjectionToken<PortalOwner>('PortalOwner');
