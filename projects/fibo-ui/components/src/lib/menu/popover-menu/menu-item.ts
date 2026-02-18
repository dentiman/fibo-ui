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
    'class': 'menu-item',
    '(itemTrigger)': 'menu.menuPanel.closeMenuWithParent()'
  }
})
export class MenuItem {
  menu = inject(Menu)
}
