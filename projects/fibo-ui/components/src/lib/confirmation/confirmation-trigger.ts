import {Directive, ElementRef, inject, input, model, output, signal, TemplateRef} from '@angular/core';
import {ConfirmationConfig, ConfirmationContent, ConfirmationService} from './confirmation-service';
import {DialogConfig} from '../modal-state';

@Directive({
  selector: '[confirm]',
  exportAs: 'FiboConfirmationTrigger',
  standalone: true,
  host: {
    '(click)': 'open()'
  }
})
export class ConfirmationTrigger {
  confirmation = inject(ConfirmationService);
  content = input<ConfirmationContent|null>(null,{alias: 'fiboConfirmationContent'});
  confirm = output()

  open() {
    this.confirmation.open({
      content: this.content(),
      onConfirm: ()=> {this.confirm.emit()}
    });
  }
}
