import {Component, computed, inject, TemplateRef, viewChild} from '@angular/core';
import {CommonModule, NgTemplateOutlet} from '@angular/common';
import {ClickOutside} from 'ngxtension/click-outside';
import {animate, style, transition, trigger,} from '@angular/animations';
import {ConfirmationService} from './confirmation-service';
import {fadeIn} from '../../common/animations/fade';

const DEFAULT_CONFIG = {
  title: 'Confirmation',
  message: 'Do you really want to perform action?',
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm'
} as const;

@Component({
  selector: 'sui-confirmation',
  standalone: true,
  imports: [ClickOutside, NgTemplateOutlet, CommonModule],
  templateUrl: './confirmation.html',
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'scale(0.95)'}),
        animate('200ms ease-out', style({opacity: 1, transform: 'scale(1)'})),
      ]),
      transition(':leave', [
        style({opacity: 1, transform: 'scale(1)'}),
        animate('200ms ease-in', style({opacity: 0, transform: 'scale(0.95)'})),
      ]),
    ]),
    trigger('backdropAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease-out', style({opacity: 1})),
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('200ms ease-in', style({opacity: 0})),
      ]),
    ]),
  ],
})
export class SuiConfirmation {
  confirmation = inject(ConfirmationService);
  defaultContent = viewChild.required<TemplateRef<unknown>>('defaultContent');

  content = computed(() => {
    const config = this.confirmation.config();
    if (!config) return DEFAULT_CONFIG;

    return config.content instanceof TemplateRef
      ? DEFAULT_CONFIG
      : {...DEFAULT_CONFIG, ...config};
  });

  template = computed(() => {
    const config = this.confirmation.config();
    return config?.content instanceof TemplateRef
      ? config.content
      : this.defaultContent();
  });
}

