import {Directive, inject, input, output} from '@angular/core';
import {ConfirmationContent, ConfirmationService} from './confirmation-service';

@Directive({
  selector: '[fiboConfirm]',
  exportAs: 'FiboConfirmationTrigger',
  host: {
    '(click)': 'open()'
  }
})
export class ConfirmationTrigger {
  confirmation = inject(ConfirmationService);

  content = input<ConfirmationContent | null>(null);

  confirm = output<void>();

  open() {
    this.confirmation.open({
      content: this.content(),
      onConfirm: () => { this.confirm.emit(); }
    });
  }
}
