import {Directive, ElementRef, inject, input, output} from '@angular/core';
import {ConfirmationContent, ConfirmationService} from './confirmation-service';

@Directive({
  // `(confirm)` usage is supported: when this directive is imported,
  // it is attached to buttons and only activates if the output is observed.
  selector: 'button, [confirm]',
  exportAs: 'FiboConfirmationTrigger',
  host: {
    '(click)': 'open()'
  }
})
export class ConfirmationTrigger {
  private element = inject(ElementRef<HTMLElement>).nativeElement;
  confirmation = inject(ConfirmationService);

  content = input<ConfirmationContent | null>(null);

  confirm = output<void>();

  private hasConfirmSubscribers(): boolean {
    return ((this.confirm as any).listeners?.length ?? 0) > 0;
  }

  open() {
    // Avoid affecting regular buttons when this directive is imported.
    if (!this.hasConfirmSubscribers() && !this.element.hasAttribute('confirm')) {
      return;
    }

    this.confirmation.open({
      content: this.content(),
      onConfirm: () => { this.confirm.emit(); }
    });
  }
}
