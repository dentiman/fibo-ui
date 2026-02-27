import {Component, inject, ViewEncapsulation} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {FocusTrap} from '@fibo-ui/cdk';
import {DrawerService} from './drawer-service';

@Component({
  selector: 'fibo-drawer',
  imports: [NgTemplateOutlet, FocusTrap],
  templateUrl: './drawer.html',
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

    /* Leave */
    .drawer-leave {
      animation: drawer-fade-out 150ms ease-in forwards;
    }
    .drawer-leave .drawer-backdrop {
      animation: drawer-fade-out 150ms ease-in forwards;
    }
    .drawer-leave .drawer-panel {
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
  state = inject(DrawerService);
}
