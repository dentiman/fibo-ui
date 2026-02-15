import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  createComponent,
  effect,
  inject,
  input,
  computed,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ShikiHighlighterService } from '../shiki-highlighter.service';
import { EXAMPLE_REGISTRY } from './example-registry';

@Component({
  selector: 'doc-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (docHtml()) {
      <div
        class="prose dark:prose-invert max-w-none"
        [innerHTML]="docHtml()"
      ></div>
    }
  `,
})
export class DocViewer {
  readonly docUrl = input.required<string>();

  private readonly highlighter = inject(ShikiHighlighterService);
  private readonly elRef = inject(ElementRef);
  private readonly appRef = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly registry = inject(EXAMPLE_REGISTRY, { optional: true });

  private readonly docResource = this.highlighter.createDocResource(
    computed(() => this.docUrl())
  );

  protected readonly docHtml = computed(() => this.docResource.value()?.html ?? null);

  private readonly componentRefs: ComponentRef<unknown>[] = [];

  constructor() {
    effect(() => {
      const result = this.docResource.value();
      if (!result) return;

      // Defer to next microtask so Angular renders innerHTML first
      queueMicrotask(() => this.mountExamples(result.examples));
    });

    this.destroyRef.onDestroy(() => this.destroyComponents());
  }

  private mountExamples(
    examples: Map<string, { lang: string; code: string; highlighted: SafeHtml }[]>
  ): void {
    this.destroyComponents();

    const host: HTMLElement = this.elRef.nativeElement;
    const markers = host.querySelectorAll<HTMLElement>('docs-example');

    markers.forEach(marker => {
      const name = marker.getAttribute('name');
      if (!name) return;

      const componentType = this.registry?.get(name);
      const codeBlocks = examples.get(name);

      if (!componentType) return;

      const wrapper = document.createElement('div');
      wrapper.className =
        'not-prose grid grid-cols-1 divide-y-1 divide-dashed divide-border-primary ' +
        'outline-1 -outline-offset-1 outline-black/13 dark:outline-white/5 rounded-md ' +
        'dark:bg-background my-6';

      // Live example area
      const exampleHost = document.createElement('div');
      wrapper.appendChild(exampleHost);

      const exampleRef = createComponent(componentType, {
        hostElement: exampleHost,
        environmentInjector: this.appRef.injector,
      });
      this.appRef.attachView(exampleRef.hostView);
      this.componentRefs.push(exampleRef);

      // Code tabs
      if (codeBlocks?.length) {
        const tabBar = document.createElement('div');
        tabBar.className = 'px-3 py-1 flex space-x-1';

        const codeContainer = document.createElement('div');
        codeContainer.className =
          'px-3 py-1 pb-3 prose dark:prose-invert max-w-none font-normal ' +
          'text-[14px] overflow-x-auto overflow-y-auto';

        const showBlock = (index: number) => {
          codeContainer.innerHTML = '';
          const div = document.createElement('div');
          div.innerHTML = codeBlocks[index].highlighted as unknown as string;
          codeContainer.appendChild(div);

          tabBar.querySelectorAll('button').forEach((btn, i) => {
            btn.classList.toggle('btn-inverse', i === index);
          });
        };

        codeBlocks.forEach((block, i) => {
          const btn = document.createElement('button');
          btn.className = 'btn btn-sm rounded-full';
          btn.textContent = block.lang;
          btn.addEventListener('click', () => showBlock(i));
          tabBar.appendChild(btn);
        });

        wrapper.appendChild(tabBar);
        wrapper.appendChild(codeContainer);

        showBlock(0);
      }

      marker.replaceWith(wrapper);
    });
  }

  private destroyComponents(): void {
    this.componentRefs.forEach(ref => ref.destroy());
    this.componentRefs.length = 0;
  }
}
