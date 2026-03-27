import {
  afterNextRender,
  Component,
  computed,
  inject,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {TooltipService} from './tooltip-service';

@Component({
  selector: 'fibo-tooltip-overlay-container',
  imports: [NgTemplateOutlet],
  templateUrl: './tooltip-overlay-container.html',
  encapsulation: ViewEncapsulation.None,
  styles: `
    .tooltip-enter {
      animation: tooltip-in 150ms ease-out;
    }
    /* Leave — triggered by outlet's animate.leave="overlay-leave" */
    .overlay-leave .fibo-tooltip-container {
      animation: tooltip-out 100ms ease-in forwards;
    }

    @keyframes tooltip-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes tooltip-out {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
  `,
})
export class TooltipOverlayContainer {
  tooltipService = inject(TooltipService);
  private root = viewChild.required<TemplateRef<any>>('root');

  content = computed(() =>
    typeof this.tooltipService.tooltipRef()?.content === 'string'
      ? (this.tooltipService.tooltipRef()?.content as string)
      : null
  );
  templateRef = computed(() =>
    this.tooltipService.tooltipRef()?.content instanceof TemplateRef
      ? (this.tooltipService.tooltipRef()?.content as TemplateRef<any>)
      : null
  );

  constructor() {
    afterNextRender(() => {
      this.tooltipService.containerTemplateRef.set(this.root());
    });
  }
}
