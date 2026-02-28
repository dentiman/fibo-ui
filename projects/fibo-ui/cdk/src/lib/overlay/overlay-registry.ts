import { computed, Injectable, InjectionToken, signal } from '@angular/core';

export type OverlayKind =
  | 'modal'
  | 'drawer'
  | 'confirmation'
  | 'popover'
  | 'menu'
  | 'tooltip'
  | 'toast'
  | 'custom';

export interface OverlayContext {
  overlayId: string;
}

export const OVERLAY_CONTEXT = new InjectionToken<OverlayContext>('OVERLAY_CONTEXT');

export interface OverlayRegisterConfig {
  kind?: OverlayKind;
  parentId?: string | null;
  blocking?: boolean;
  baseZIndex?: number;
}

export interface OverlayEntry {
  id: string;
  kind: OverlayKind;
  parentId: string | null;
  blocking: boolean;
  openedAt: number;
  zIndex: number;
}

const DEFAULT_STEP = 10;

const DEFAULT_BASE_Z_INDEX: Record<OverlayKind, number> = {
  modal: 2000,
  drawer: 2100,
  confirmation: 2200,
  popover: 3000,
  menu: 3100,
  tooltip: 5000,
  toast: 6000,
  custom: 4000,
};

@Injectable({
  providedIn: 'root',
})
export class OverlayRegistry {
  private openEntries = signal<Map<string, OverlayEntry>>(new Map());
  private sequence = signal(0);

  openEntriesList = computed(() =>
    Array.from(this.openEntries().values()).sort((a, b) => {
      if (a.zIndex === b.zIndex) {
        return a.openedAt - b.openedAt;
      }
      return a.zIndex - b.zIndex;
    }),
  );

  topEntry = computed(() => this.openEntriesList().at(-1) ?? null);

  register(id: string, config: OverlayRegisterConfig = {}): OverlayEntry {
    const existing = this.openEntries().get(id);
    if (existing) {
      return existing;
    }

    const kind = config.kind ?? 'custom';
    const parentId = config.parentId ?? null;
    const openedAt = this.sequence() + 1;
    this.sequence.set(openedAt);
    const zIndex = this.calculateZIndex(kind, parentId, config.baseZIndex);
    const entry: OverlayEntry = {
      id,
      kind,
      parentId,
      blocking: config.blocking ?? false,
      openedAt,
      zIndex,
    };

    this.openEntries.update((entries) => {
      const next = new Map(entries);
      next.set(id, entry);
      return next;
    });

    return entry;
  }

  unregister(id: string): void {
    this.openEntries.update((entries) => {
      if (!entries.has(id)) {
        return entries;
      }

      const next = new Map(entries);
      next.delete(id);
      return next;
    });
  }

  entry(id: string): OverlayEntry | null {
    return this.openEntries().get(id) ?? null;
  }

  zIndex(id: string): number | null {
    return this.entry(id)?.zIndex ?? null;
  }

  count(kind?: OverlayKind): number {
    if (!kind) {
      return this.openEntries().size;
    }
    return this.openEntriesList().filter((entry) => entry.kind === kind).length;
  }

  hasOpen(kind?: OverlayKind): boolean {
    return this.count(kind) > 0;
  }

  isTop(id: string): boolean {
    return this.topEntry()?.id === id;
  }

  private calculateZIndex(kind: OverlayKind, parentId: string | null, baseZIndex?: number): number {
    const base = baseZIndex ?? DEFAULT_BASE_Z_INDEX[kind];
    const topZ = this.topEntry()?.zIndex ?? base - DEFAULT_STEP;
    const parentZ = parentId ? this.openEntries().get(parentId)?.zIndex ?? 0 : 0;

    return Math.max(base, parentZ + DEFAULT_STEP, topZ + DEFAULT_STEP);
  }
}
