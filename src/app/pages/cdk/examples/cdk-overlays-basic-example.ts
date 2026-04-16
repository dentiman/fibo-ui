import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  signal,
  viewChild,
} from '@angular/core';
import { createOverlay } from '@fibo-ui/cdk';
import { Button } from '@fibo-ui/components';

@Component({
  selector: 'cdk-overlays-basic-example',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <button #btn type="button" fiboButton fiboAppearance="primary" (click)="toggle()">Open</button>

      <ng-template #tpl let-overlay>
        <div class="flex items-center justify-between gap-6 p-3">
          <span class="text-sm">Popover content</span>
          <button type="button" fiboButton fiboSize="sm" (click)="overlay.close()">Close</button>
        </div>
      </ng-template>
    </div>
  `,
})
export class CdkOverlaysBasicExample {
  private readonly btn = viewChild.required<ElementRef<HTMLElement>>('btn');
  private readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');

  readonly isOpen = signal(false);

  readonly overlay = createOverlay(() => ({
    state: this.isOpen,
    content: this.tpl(),
    position: { connectedTo: this.btn().nativeElement },
    focus: { restoreTo: () => this.btn().nativeElement },
  }));

  toggle() { this.isOpen.update(v => !v); }
}
