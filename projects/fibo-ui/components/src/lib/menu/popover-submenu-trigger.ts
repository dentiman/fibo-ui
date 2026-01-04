import {Directive, inject, OnDestroy, OnInit} from '@angular/core';
import {Option, PopoverTrigger} from '@fibo-ui/cdk';
import {MenuPanel} from './menu-panel';

// @ts-ignore
@Directive({
  selector: '[fiboSubmenuTrigger]',
  hostDirectives: [
    {
      directive: Option,
      inputs: ['disabled']
    },
    PopoverTrigger,
  ],
  host: {
    '(keydown.enter)': 'popoverTrigger.open()',
    '(keydown.escape)': 'popoverTrigger.close()',
    '(keydown.arrowright)': 'popoverTrigger.popover()?.dataList?.navigateNext($event)',
    '(click)': 'popoverTrigger.open()'
  }
})
export class PopoverSubmenuTrigger implements OnInit, OnDestroy {

  popoverTrigger = inject(PopoverTrigger);
  dataListItem = inject(Option);
  menuPanel = inject(MenuPanel);

  ngOnDestroy(): void {
    const currentItems = this.menuPanel.popoverSubmenuItems();
    this.menuPanel.popoverSubmenuItems.set(currentItems.filter(item => item !== this));
  }

  ngOnInit(): void {
    const currentItems = this.menuPanel.popoverSubmenuItems();
    if (!currentItems.includes(this)) {
      this.menuPanel.popoverSubmenuItems.set([...currentItems, this]);
    }
  }

}
