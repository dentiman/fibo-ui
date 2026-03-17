import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import { FiboDrawer } from '@fibo-ui/components';
import { OverlaySetupContext, createOverlay, restoreFocusOnBeforeClose } from '@fibo-ui/cdk';

@Component({
  selector: 'drawer-basic-example',
  imports: [FiboDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <button #drawerTrigger class="btn btn-primary" (click)="isOpen.set(true)">
        Open Drawer
      </button>

      <ng-template #drawerTpl>
        <fibo-drawer>
          <div class="flex h-full flex-col p-6">
            <h2 class="text-lg font-semibold mb-4">Drawer Title</h2>
            <p class="text-sm text-muted">Drawer content goes here.</p>
            <div class="mt-6">
              <button class="btn btn-primary" (click)="isOpen.set(false)">Close Drawer</button>
            </div>
          </div>
        </fibo-drawer>
      </ng-template>
    </div>
  `,
})
export class DrawerBasicExample {
  private drawerTemplate = viewChild.required<TemplateRef<any>>('drawerTpl');
  private drawerTrigger = viewChild.required<ElementRef<HTMLElement>>('drawerTrigger');

  isOpen = signal(false);

  private setupDrawerOverlay = (overlay: OverlaySetupContext) => {
    restoreFocusOnBeforeClose(overlay);
  };

  private overlayConfig = computed(() => ({
    templateRef: this.drawerTemplate(),
    referenceElement: this.drawerTrigger().nativeElement,
    category: 'dialog' as const,
  }));

  overlayRef = createOverlay(this.isOpen, this.overlayConfig, this.setupDrawerOverlay);
}
