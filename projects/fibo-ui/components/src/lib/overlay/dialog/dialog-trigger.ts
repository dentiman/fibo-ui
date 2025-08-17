import {Directive, ElementRef, inject, input, model, signal, TemplateRef} from '@angular/core';
import {DialogService} from './dialog-service';
import {DialogConfig} from '../overlay-state';


@Directive({
  selector: '[suiDialogTrigger]',
  exportAs: 'SuiDialogTrigger',
  standalone: true,
  host: {
    '(click)': 'open()'
  }
})
export class DialogTrigger {
  dialog = inject(DialogService);
  content = input.required<TemplateRef<unknown>>({alias: 'suiDialogTrigger'});
  config = input<DialogConfig|null>(null,{alias:'suiDialogConfig'});

  open() {
    this.dialog.open(this.content(),this.config())
  }

}
