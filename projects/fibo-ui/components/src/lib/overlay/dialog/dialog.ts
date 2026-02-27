import {ChangeDetectionStrategy, Component, effect, model, signal, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'fibo-dialog',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50"
         animate.enter="dialog-enter"
         animate.leave="dialog-leave">

      <div (click)="isOpen.set(false)"
           [class]="'dialog-backdrop fixed inset-0' + (firstDialog() ? ' bg-black/30 dark:bg-black/50' : '')">
      </div>

      <div tabindex="0"
           class="flex min-h-full items-end justify-center text-center focus:outline-none sm:items-center sm:p-0 py-4">
        <div class="dialog-content relative max-h-[90vh] overflow-y-auto rounded-lg bg-background text-left shadow-xl sm:p-2 dark:outline
              dark:-outline-offset-1 dark:outline-white/8 my-4">
          <ng-content />
        </div>
      </div>

    </div>
  `,
  styles: `
    /* Enter */
    .dialog-enter {
      animation: dialog-fade-in 200ms ease-out;
    }
    .dialog-enter .dialog-backdrop {
      animation: dialog-fade-in 200ms ease-out;
    }
    .dialog-enter .dialog-content {
      animation: dialog-content-in 200ms ease-out;
    }

    /* Leave */
    .dialog-leave {
      animation: dialog-fade-out 150ms ease-in forwards;
    }
    .dialog-leave .dialog-backdrop {
      animation: dialog-fade-out 150ms ease-in forwards;
    }
    .dialog-leave .dialog-content {
      animation: dialog-content-out 150ms ease-in forwards;
    }

    @keyframes dialog-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes dialog-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes dialog-content-in {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(8px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    @keyframes dialog-content-out {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.95) translateY(8px);
      }
    }
  `,
})
export class FiboDialog {
  private static openCount = 0;

  isOpen = model(false);
  firstDialog = signal(false);

  constructor() {
    effect((onCleanup) => {
      if (this.isOpen()) {
        this.firstDialog.set(FiboDialog.openCount === 0);
        FiboDialog.openCount++;
        document.documentElement.style.overflow = 'hidden';
        onCleanup(() => {
          FiboDialog.openCount = Math.max(0, FiboDialog.openCount - 1);
          if (FiboDialog.openCount === 0) {
            document.documentElement.style.overflow = '';
          }
        });
      }
    });
  }
}
