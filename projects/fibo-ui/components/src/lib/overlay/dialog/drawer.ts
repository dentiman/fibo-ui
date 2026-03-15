import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FocusTrap, OVERLAY_REF } from '@fibo-ui/cdk';

@Component({
  selector: 'fibo-drawer',
  imports: [FocusTrap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0"
         animate.enter="drawer-enter">

      <div (click)="close()"
           [class]="'drawer-backdrop fixed inset-0' + (firstDrawer() ? ' bg-black/30 dark:bg-black/50' : '')">
      </div>

      <div class="drawer-panel pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
           role="dialog" aria-modal="true">
        <div fiboFocusTrap class="pointer-events-auto w-screen max-w-md shadow-xl focus:outline-none">
          <div class="flex h-full flex-col overflow-y-scroll bg-background dark:outline dark:-outline-offset-1 dark:outline-white/8">
            <ng-content />
          </div>
        </div>
      </div>

    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: `
    /* Enter */
    .drawer-enter {
      animation: drawer-fade-in 200ms ease-out;
    }
    .drawer-enter .drawer-backdrop {
      animation: drawer-fade-in 200ms ease-out;
    }
    .drawer-enter .drawer-panel {
      animation: drawer-slide-in 200ms ease-out;
    }

    /* Leave — triggered by outlet's animate.leave="overlay-leave" */
    .overlay-leave .drawer-backdrop {
      animation: drawer-fade-out 150ms ease-in forwards;
    }
    .overlay-leave .drawer-panel {
      animation: drawer-slide-out 150ms ease-in forwards;
    }

    @keyframes drawer-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes drawer-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes drawer-slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes drawer-slide-out {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `,
})
export class FiboDrawer {
  private overlayRef = inject(OVERLAY_REF);

  firstDrawer = this.overlayRef.firstInCategory;

  close() {
    this.overlayRef.close();
  }
}
