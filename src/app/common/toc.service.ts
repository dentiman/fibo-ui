import { Injectable, signal } from '@angular/core';
import { TocEntry } from './doc-viewer/heading-anchor-plugin';

@Injectable({ providedIn: 'root' })
export class TocService {
  readonly entries = signal<TocEntry[]>([]);

  set(entries: TocEntry[]): void {
    this.entries.set(entries);
  }

  clear(): void {
    this.entries.set([]);
  }
}
