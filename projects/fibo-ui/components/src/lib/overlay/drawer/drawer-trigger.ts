import {Directive, inject, input, TemplateRef} from '@angular/core';
import {DrawerService} from './drawer-service';

@Directive({
  selector: '[fiboDrawerTrigger]',
  exportAs: 'FiboDrawerTrigger',
  host: {
    '(click)': 'open()'
  }
})
export class DrawerTrigger {
  drawer = inject(DrawerService);
  content = input.required<TemplateRef<unknown>>({alias: 'fiboDrawerTrigger'});

  open() {
    this.drawer.open(this.content());
  }

}
