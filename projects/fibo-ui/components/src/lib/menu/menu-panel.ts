import {Directive, inject, signal} from '@angular/core';
import {DataList} from '@fibo-ui/cdk';
import {PopoverSubmenuTrigger} from './popover-submenu-trigger';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, filter} from 'rxjs';

@Directive({
  selector: '[fiboMenuPanel]',
  hostDirectives: [
    {
      directive: DataList,
      inputs: ['trigger']
    }
  ]
})
export class MenuPanel {
  dataList = inject(DataList);
  popoverSubmenuItems = signal<PopoverSubmenuTrigger[]>([]);

  constructor() {
    //  close popup submenus if active menu item changed
    toObservable(this.dataList.activeOption)
      .pipe(
        filter(activeItem => !!activeItem),
        takeUntilDestroyed()
      ).subscribe((activeItem) => {
      this.popoverSubmenuItems()
        .filter(submenuItem => submenuItem.dataListItem !== activeItem)
        .forEach(item => {
          item.popoverTrigger.close()
        });
    })

    // on activate option - open submenu if it is the same list-item
    toObservable(this.dataList.activeOption)
      .pipe(
        filter(activeItem => !!activeItem),
        debounceTime(300),
        takeUntilDestroyed()
      ).subscribe((activeItem) => {
      this.popoverSubmenuItems()
        .filter(submenuItem => submenuItem.dataListItem !== activeItem)
        .forEach(item => {
          item.popoverTrigger.close()
        });
      this.popoverSubmenuItems()
        .find(submenuItem => submenuItem.dataListItem === activeItem)?.popoverTrigger.open()
    })
  }

}
