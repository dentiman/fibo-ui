import {Directive, inject, input} from '@angular/core';
import {Menu} from './menu';
import {DataListItem} from '@fibo-ui/cdk';


@Directive({
  selector: '[fiboMenuItem]',
  standalone: true,
  hostDirectives: [{
    directive: DataListItem,
    inputs: ['disabled'],
    outputs: ['itemTrigger']
  }],
  host: {
    'class': 'datalist-item w-full text-left',
    'role': 'menuitem',
    '(itemTrigger)': 'menu.menuPanel.closeAll()',
  }
})
export class MenuItem {
  menu = inject(Menu)
}
