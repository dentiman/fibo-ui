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
import {PopoverArrow, PopoverPosition} from '@fibo-ui/cdk';
import {TooltipService} from './tooltip-service';

@Component({
  selector: 'fibo-tooltip-container',
  imports: [NgTemplateOutlet, PopoverPosition, PopoverArrow],
  templateUrl: './tooltip-container.html',
  encapsulation: ViewEncapsulation.None,
  styles: `
    .tooltip-enter {
      animation: tooltip-in 150ms ease-out;
    }
    .tooltip-leave {
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
export class TooltipContainer {
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
