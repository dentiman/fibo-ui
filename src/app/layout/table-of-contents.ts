import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { DataList, DataListItem, SelectOne } from '@fibo-ui/cdk';
import { TocEntry } from '../common/doc-viewer/heading-anchor-plugin';

@Component({
  selector: 'app-table-of-contents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataListItem],
  hostDirectives: [DataList, SelectOne],
  host: { class: 'block' },
  template: `
    @if (entries().length) {
      <div class="flex w-full items-center gap-x-2 px-2 py-1.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
          On this page
        </span>
      </div>

      @for (entry of entries(); track entry.id) {
        <a
          fiboDataListItem
          [value]="entry.id"
          class="group relative flex items-center gap-x-3 rounded-md py-1 text-sm cursor-pointer
            text-foreground-secondary hover:bg-black/3 dark:hover:bg-white/4 hover:text-foreground
            aria-selected:bg-black/6 dark:aria-selected:bg-white/8 aria-selected:text-foreground"
          [style.padding-left.px]="entry.level === 3 ? 28 : 8"
        >
          <span class="flex-auto">{{ entry.text }}</span>
        </a>
      }
    }
  `,
})
export class TableOfContents {
  readonly entries = input<TocEntry[]>([]);
  readonly scrollContainer = input<HTMLElement | null>(null);

  private readonly dataList = inject(DataList);
  private readonly selectOne = inject(SelectOne);
  private readonly destroyRef = inject(DestroyRef);
  private observer: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      const entries = this.entries();
      const container = this.scrollContainer();

      untracked(() => {
        this.cleanup();
        if (entries.length && container) {
          requestAnimationFrame(() => this.observe(entries, container));
        }
      });
    });

    // Scroll to heading on item triggered (click or Enter)
    this.dataList.itemTriggered.subscribe(event => {
      event.preventDefault();
      const id = this.selectOne.value() as string | null;
      if (!id) return;
      const container = this.scrollContainer();
      const target = container?.querySelector(`#${CSS.escape(id)}`);
      target?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });

    this.destroyRef.onDestroy(() => this.cleanup());
  }

  private observe(entries: TocEntry[], container: HTMLElement): void {
    const headingEls = entries
      .map(e => container.querySelector(`#${CSS.escape(e.id)}`))
      .filter((el): el is Element => el !== null);

    if (!headingEls.length) return;

    this.observer = new IntersectionObserver(
      intersections => {
        const visible = intersections
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) {
          this.selectOne.value.set(visible[0].target.id);
        }
      },
      {
        root: container,
        rootMargin: '0px 0px -70% 0px',
        threshold: 0,
      }
    );

    headingEls.forEach(el => this.observer!.observe(el));
  }

  private cleanup(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.selectOne.value.set(null);
  }
}
