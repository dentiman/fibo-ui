import {Directive, ElementRef, inject, input, model, signal, TemplateRef} from '@angular/core';
import {DialogService} from './dialog-service';
import {DialogConfig} from '../modal-state';


@Directive({
  selector: '[fiboDialogTrigger]',
  exportAs: 'FiboDialogTrigger',
  standalone: true,
  host: {
    '(click)': 'open()'
  }
})
export class DialogTrigger {
  dialog = inject(DialogService);
  content = input.required<TemplateRef<unknown>>({alias: 'fiboDialogTrigger'});
  config = input<DialogConfig|null>(null,{alias:'fiboDialogConfig'});

  open() {
    this.dialog.open(this.content(),this.config())
  }

}
