import { InjectionToken, Type } from '@angular/core';

export const EXAMPLE_REGISTRY = new InjectionToken<Map<string, Type<unknown>>>(
  'EXAMPLE_REGISTRY'
);
