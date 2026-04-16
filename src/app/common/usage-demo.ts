import {ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ShikiHighlighterService } from './shiki-highlighter.service';
import { Button } from '@fibo-ui/components';

@Component({
  selector: 'app-usage-demo',
  imports: [CommonModule, Button],
  providers: [ShikiHighlighterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="grid grid-cols-1 divide-y-1 divide-dashed divide-border-primary outline-1  -outline-offset-1  outline-black/13 dark:outline-white/5 rounded-md dark:bg-background ">
      <div class="">
        <ng-content></ng-content>
      </div>
      <div class="px-3 py-1 flex space-x-1">
         @for (block of codeBlocks(); track block.path) {
           <button fiboButton fiboSize="sm" class="rounded-full" [fiboAppearance]="block.path === activeCodeBlockPath() ? 'inverse' : null" (click)="activeCodeBlockPath.set(block.path)">{{ block.name }}</button>
         }
      </div>

        <div class="px-3 py-1 pb-3">
          @if (markdownTextResource.hasValue()) {
            <div class="prose dark:prose-invert max-w-none font-normal text-[14px] overflow-x-auto overflow-y-auto"
                 [innerHTML]="markdownTextResource.value()"></div>
          }
        </div>

    </div>
  `,
})
export class UsageDemo {

  readonly codeBlocks = input<{name: string, path: string}[]>([]);

  readonly activeCodeBlockPath = linkedSignal({
    source: this.codeBlocks,
    computation: blocks => blocks.length > 0 ? blocks[0].path : undefined,
  })
  readonly markdownTextResource = inject(ShikiHighlighterService).createMarkdownResource(this.activeCodeBlockPath);

}


