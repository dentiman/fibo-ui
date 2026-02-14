import {Directive, inject, input, TemplateRef} from '@angular/core';
import {DialogService} from './dialog-service';

@Directive({
  selector: '[fiboDialogTrigger]',
  exportAs: 'FiboDialogTrigger',
  host: {
    '(click)': 'open()'
  }
})
export class DialogTrigger {
  dialog = inject(DialogService);
  content = input.required<TemplateRef<unknown>>({alias: 'fiboDialogTrigger'});

  open() {
    this.dialog.open(this.content())
  }

}
