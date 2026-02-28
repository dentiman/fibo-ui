import { Injectable, InjectionToken, computed, signal, untracked } from '@angular/core';
import { TemplateRef } from '@angular/core';

export type OverlayCategory = 'popover' | 'menu' | 'dialog' | 'drawer' | 'tooltip';

const BASE_Z_INDEX: Record<OverlayCategory, number> = {
  dialog: 500,
  drawer: 500,
  popover: 1000,
  menu: 1000,
  tooltip: 2000,
};

export interface OverlayEntry {
  id: string;
  templateRef: TemplateRef<any>;
  context?: Record<string, any>;
  category: OverlayCategory;
  zIndex: number;
  close?: () => void;
  firstInCategory: boolean;
  referenceElement?: HTMLElement;
}

@Injectable({
  providedIn: 'root',
})
export class OverlayRegistry {
  private openPortals = signal<Map<string, OverlayEntry>>(new Map());
  private zIndexCounter = 0;

  openPortalsList = computed(() => {
    const portals = Array.from(this.openPortals().values());
    return portals.sort((a, b) => a.zIndex - b.zIndex);
  });

  openDialogs = computed(() =>
    this.openPortalsList().filter(p => p.category === 'dialog')
  );

  hasOpenDialogs = computed(() => this.openDialogs().length > 0);

  dialogCount = computed(() => this.openDialogs().length);

  topmost = computed(() => {
    const list = this.openPortalsList();
    return list.length > 0 ? list[list.length - 1] : null;
  });

  byCategory(category: OverlayCategory) {
    return this.openPortalsList().filter(p => p.category === category);
  }

  register(
    id: string,
    templateRef: TemplateRef<any>,
    context?: Record<string, any>,
    category: OverlayCategory = 'popover',
    close?: () => void,
    referenceElement?: HTMLElement
  ): void {
    const zIndex = BASE_Z_INDEX[category] + ++this.zIndexCounter;
    // untracked: prevent signal read from being tracked by calling effect
    const firstInCategory = untracked(() =>
      Array.from(this.openPortals().values()).every(p => p.category !== category)
    );
    this.openPortals.update(map => {
      const newMap = new Map(map);
      newMap.set(id, {
        id, templateRef, context, category, zIndex, close, firstInCategory, referenceElement,
      });
      return newMap;
    });
  }

  unregister(id: string): void {
    this.openPortals.update(map => {
      const newMap = new Map(map);
      newMap.delete(id);
      return newMap;
    });
  }

  closeTopmost(): void {
    const top = this.topmost();
    if (top?.close) {
      top.close();
    }
  }

  closeAllByCategory(category: OverlayCategory): void {
    const portals = this.byCategory(category);
    for (const portal of [...portals].reverse()) {
      portal.close?.();
    }
  }
}

export class OverlayRef {
  constructor(
    readonly category: OverlayCategory,
    readonly zIndex: number,
    readonly firstInCategory: boolean,
    private closeFn: () => void,
    readonly referenceElement?: HTMLElement
  ) {}

  close() {
    this.closeFn();
  }
}

export const OVERLAY_REF = new InjectionToken<OverlayRef>('OVERLAY_REF');
