import {Component, inject, ViewEncapsulation} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {DialogService} from './dialog-service';

@Component({
  selector: 'fibo-dialog',
  imports: [NgTemplateOutlet],
  templateUrl: './dialog.html',
  encapsulation: ViewEncapsulation.None,
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
  state = inject(DialogService);
}
