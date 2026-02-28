import { Component, effect, inject, Injector, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OVERLAY_REF, OverlayRef, OverlayEntry, OverlayRegistry } from './overlay-registry';

@Component({
  selector: 'fibo-overlay-outlet',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overlay-outlet.html',
  host: {
    '(document:keydown.escape)': 'registry.closeTopmost()',
  },
})
export class OverlayOutletComponent {
  registry = inject(OverlayRegistry);
  private parentInjector = inject(Injector);
  private injectorCache = new Map<string, Injector>();

  constructor() {
    effect(() => {
      const hasDialogs = this.registry.hasOpenDialogs();
      if (hasDialogs) {
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = '';
      }
    });
  }

  portalInjector(portal: OverlayEntry): Injector {
    let injector = this.injectorCache.get(portal.id);
    if (!injector) {
      injector = Injector.create({
        providers: [
          {
            provide: OVERLAY_REF,
            useValue: new OverlayRef(
              portal.category,
              portal.zIndex,
              portal.firstInCategory,
              portal.close ?? (() => {}),
              portal.referenceElement
            ),
          },
        ],
        parent: this.parentInjector,
      });
      this.injectorCache.set(portal.id, injector);
    }
    return injector;
  }
}
