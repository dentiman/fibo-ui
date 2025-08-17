import {
  Component, computed,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import { ClickOutside } from 'ngxtension/click-outside';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import OverlayState from '../overlay-state';
import { CommonModule } from '@angular/common';
import {DialogService} from './dialog-service';
import {slideInRight, slideOutRight} from '../../common/animations/slide';
import {fadeIn} from '../../common/animations/fade';
@Component({
  selector: 'sui-dialog',
  standalone: true,
  imports: [ClickOutside,  NgTemplateOutlet, CommonModule],
  templateUrl: './dialog.html',
  animations: [
    slideInRight,
    slideOutRight,
    fadeIn,
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(2rem) scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0) scale(1)' }),
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(2rem) scale(0.95)' })),
      ]),
    ]),
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SuiDialog {
  state = inject(DialogService)

  isDrawerMode = computed(()=> !!this.state.config() && this.state.config()?.mode === 'drawer' );

}
