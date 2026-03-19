import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  closeOnFocusLeave,
  closeOnOutsideClick,
  createOverlay,
  restoreTriggerFocusOnClose,
} from '@fibo-ui/cdk';

@Component({
  selector: 'cdk-overlays-basic-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto w-full max-w-xl p-6">
      <div class="flex items-center gap-3">
        <button #triggerButton type="button" class="btn btn-primary" (click)="toggle()">
          Toggle overlay
        </button>
        <span class="text-sm text-foreground-secondary">
          Open: {{ isOpen() ? 'yes' : 'no' }}
        </span>
      </div>

      <p class="mt-3 text-sm text-foreground-secondary">
        This overlay is created directly from component state through
        <code>createOverlay(...)</code>.
      </p>

      <ng-template #overlayTpl>
        <div
          class="fixed top-28 left-1/2 z-10 w-80 -translate-x-1/2 rounded-xl bg-background p-4 shadow-lg outline-1 -outline-offset-1 outline-black/13 dark:outline-white/5"
        >
          <div class="text-sm font-medium">Overlay lifecycle</div>
          <p class="mt-2 text-sm text-foreground-secondary">
            Close it with outside click, focus leave, or the explicit action below.
          </p>

          <div class="mt-4 flex items-center gap-2">
            <button type="button" class="btn btn-sm" (click)="increment()">
              Action
            </button>
            <button type="button" class="btn btn-sm btn-inverse" (click)="close()">
              Close
            </button>
          </div>

          <div class="mt-3 text-xs text-foreground-secondary">
            Action count: {{ actionCount() }}
          </div>
        </div>
      </ng-template>
    </section>
  `,
})
export class CdkOverlaysBasicExample {
  private readonly triggerButton = viewChild.required<ElementRef<HTMLElement>>('triggerButton');
  private readonly overlayTpl = viewChild.required<TemplateRef<any>>('overlayTpl');

  readonly isOpen = signal(false);
  readonly actionCount = signal(0);

  readonly overlayConfig = computed(() => ({
    templateRef: this.overlayTpl(),
    referenceElement: this.triggerButton().nativeElement,
    category: 'popover' as const,
  }));

  readonly overlayHandle = createOverlay(this.isOpen, this.overlayConfig, overlay => {
    closeOnFocusLeave(overlay);
    closeOnOutsideClick(overlay);
    restoreTriggerFocusOnClose(overlay);
  });

  toggle() {
    this.isOpen.update(value => !value);
  }

  close() {
    this.isOpen.set(false);
  }

  increment() {
    this.actionCount.update(v => v + 1);
  }
}
