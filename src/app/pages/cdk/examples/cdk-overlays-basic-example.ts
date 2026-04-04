import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  signal,
  viewChild,
} from '@angular/core';
import { createOverlay, connectedPosition, restoreTriggerFocusOnClose } from '@fibo-ui/cdk';
import { connectedBehavior } from '@fibo-ui/components';

@Component({
  selector: 'cdk-overlays-basic-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <button #btn type="button" class="btn btn-primary" (click)="toggle()">Open</button>

      <ng-template #tpl>
        <div class="flex items-center justify-between gap-6 p-3">
          <span class="text-sm">Popover content</span>
          <button type="button" class="btn btn-sm" (click)="close()">Close</button>
        </div>
      </ng-template>
    </div>
  `,
})
export class CdkOverlaysBasicExample {
  private readonly btn = viewChild.required<ElementRef<HTMLElement>>('btn');
  private readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');

  readonly isOpen = signal(false);

  readonly handle = createOverlay(
    this.isOpen,
    connectedBehavior(),
    connectedPosition(() => ({ referenceElement: this.btn().nativeElement })),
    this.tpl,
    session => { restoreTriggerFocusOnClose(session, () => this.btn().nativeElement); },
  );

  toggle() { this.isOpen.update(v => !v); }
  close() { this.isOpen.set(false); }
}
