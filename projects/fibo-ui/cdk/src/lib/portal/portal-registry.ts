import { Injectable, computed, signal } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { PopoverTrigger } from '../popover/popover-trigger';

export interface PortalEntry {
  id: string;
  templateRef: TemplateRef<any>;
  trigger: PopoverTrigger | null;
}

@Injectable({
  providedIn: 'root'
})
export class PortalRegistry {
  // Signal tracking ONLY currently open portals
  private openPortals = signal<Map<string, PortalEntry>>(new Map());

  // Computed property that returns array of open portals for easy iteration
  openPortalsList = computed(() => {
    return Array.from(this.openPortals().values());
  });

  register(id: string, templateRef: TemplateRef<any>, trigger: PopoverTrigger | null = null): void {
    this.openPortals.update(map => {
      const newMap = new Map(map);
      newMap.set(id, { id, templateRef, trigger });
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
}
