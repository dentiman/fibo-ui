import {ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeHtml} from '@angular/platform-browser';
import {httpResource} from '@angular/common/http';
// Markdown rendering now handled by ShikiHighlighterService
import { ShikiHighlighterService } from './shiki-highlighter.service';

@Component({
  selector: 'app-usage-demo',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="grid grid-cols-1 divide-y-1 divide-dashed divide-border-primary border-border-primary border-1 rounded-md dark:bg-background ">
      <div class="p-8">
        <ng-content></ng-content>
      </div>
      <div class="px-3 py-1 flex space-x-1">
         @for (block of codeBlocks(); track block.path) {
           <button class="btn btn-sm rounded-full" [class.btn-inverse]="block.path === activeCodeBlockPath()" (click)="activeCodeBlockPath.set(block.path)">{{ block.name }}</button>
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


