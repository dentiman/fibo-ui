import {
  Component,
  effect,
  inject,
  Injector,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OVERLAY_REF, OverlayRef, OverlayRegistry } from './overlay-registry';

@Component({
  selector: 'fibo-cdk-overlay-outlet',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './overlay-outlet.html',
  host: {
    '(document:keydown.escape)': 'registry.closeTopmost()',
  },
  // Leave animation strategy:
  // The @for wrapper uses animate.leave="overlay-leave" which tells Angular to apply
  // the CSS class and delay DOM removal until the animation completes.
  // Each overlay component defines its own `.overlay-leave .specific-element` descendant
  // selectors for per-overlay animations (slide, scale, etc.).
  // This generic fade serves as the base; overlays override with specifics.
  styles: `
    .overlay-leave {
      animation: overlay-fade-out 200ms ease-in forwards;
    }
    @keyframes overlay-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
})
export class OverlayOutletComponent {
  registry = inject(OverlayRegistry);
  private parentInjector = inject(Injector);
  private injectorCache = new Map<string, Injector>();

  constructor() {
    effect(() => {
      const list = this.registry.openPortalsList();
      const needsScrollLock = list.some(
        p => p.category === 'dialog' || p.category === 'confirmation'
      );
      document.documentElement.style.overflow = needsScrollLock ? 'hidden' : '';
    });

    effect(() => {
      const activePortalIds = new Set(this.registry.openPortalsList().map(portal => portal.id));
      for (const id of this.injectorCache.keys()) {
        if (!activePortalIds.has(id)) {
          this.injectorCache.delete(id);
        }
      }
    });
  }

  portalInjector(ref: OverlayRef): Injector {
    let injector = this.injectorCache.get(ref.id);
    if (!injector) {
      injector = Injector.create({
        providers: [{ provide: OVERLAY_REF, useValue: ref }],
        parent: this.parentInjector,
      });
      this.injectorCache.set(ref.id, injector);
    }
    return injector;
  }

  handlePortalAnimationEnd(portalId: string, event: AnimationEvent) {
    if (event.target !== event.currentTarget || event.animationName !== 'overlay-fade-out') {
      return;
    }

    this.registry.completeAfterClose(portalId);
  }
}
