import { Directive, InjectionToken, inject, input, signal } from '@angular/core';
import { OVERLAY_HANDLE } from './overlay-handle';

let nextOverlayElementId = 0;

function createOverlayElementId(kind: 'title' | 'desc'): string {
  nextOverlayElementId += 1;
  return `fibo-overlay-${kind}-${nextOverlayElementId}`;
}

/**
 * Injection token for the nearest OverlayPanel ancestor.
 * Used by OverlayTitle and OverlayDescription to register their IDs.
 */
export const OVERLAY_PANEL = new InjectionToken<OverlayPanel>('OverlayPanel');

/**
 * Marks the panel element inside an overlay container.
 *
 * Responsibilities:
 * - Sets `data-dialog-panel` so modal shells can distinguish the panel from
 *   the backdrop area
 * - Applies `role`, `aria-modal`, `aria-labelledby`, and `aria-describedby`
 *   attributes automatically
 *
 * `aria-labelledby` and `aria-describedby` are wired automatically when
 * `OverlayTitle` / `OverlayDescription` directives are used inside the panel.
 */
@Directive({
  selector: '[fiboOverlayPanel]',
  exportAs: 'overlayPanel',
  providers: [{ provide: OVERLAY_PANEL, useExisting: OverlayPanel }],
  host: {
    'data-dialog-panel': '',
    '[attr.role]': 'role()',
    '[attr.aria-modal]': 'modal() || null',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
  },
})
export class OverlayPanel {
  role = input<string>('dialog');
  modal = input(true);

  /** Set automatically by OverlayTitle */
  titleId = signal<string | null>(null);
  /** Set automatically by OverlayDescription */
  descriptionId = signal<string | null>(null);
}

/**
 * Marks the title element inside an overlay panel and wires `aria-labelledby`.
 *
 * Generates a stable ID from the overlay handle and registers it with the
 * nearest `OverlayPanel` so `aria-labelledby` is set automatically.
 */
@Directive({
  selector: '[fiboOverlayTitle]',
  host: { '[id]': 'id' },
})
export class OverlayTitle {
  private handle = inject(OVERLAY_HANDLE, { optional: true });
  private panel = inject(OVERLAY_PANEL, { optional: true });

  id = this.handle ? `${this.handle.id}-title` : createOverlayElementId('title');

  constructor() {
    this.panel?.titleId.set(this.id);
  }
}

/**
 * Marks the description element inside an overlay panel and wires `aria-describedby`.
 *
 * Generates a stable ID from the overlay handle and registers it with the
 * nearest `OverlayPanel` so `aria-describedby` is set automatically.
 */
@Directive({
  selector: '[fiboOverlayDescription]',
  host: { '[id]': 'id' },
})
export class OverlayDescription {
  private handle = inject(OVERLAY_HANDLE, { optional: true });
  private panel = inject(OVERLAY_PANEL, { optional: true });

  id = this.handle ? `${this.handle.id}-desc` : createOverlayElementId('desc');

  constructor() {
    this.panel?.descriptionId.set(this.id);
  }
}
