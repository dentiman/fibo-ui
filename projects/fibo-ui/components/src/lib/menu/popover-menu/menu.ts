import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataListItem, MenuPanel, SubmenuTrigger, OVERLAY_HANDLE } from '@fibo-ui/cdk';
import { LucideAngularModule } from 'lucide-angular';
import { MenuItemType } from '../menu-item.type';

@Component({
  selector: 'fibo-menu',
  hostDirectives: [
    {
      directive: MenuPanel,
      inputs: ['keyboardSource'],
    },
  ],
  host: {
    'class': 'group min-w-40',
    'role': 'menu',
  },
  imports: [CommonModule, DataListItem, SubmenuTrigger, LucideAngularModule],
  templateUrl: './menu.html',
})
export class Menu {
  items = input<MenuItemType[]>();
  menuContent = input<TemplateRef<any>>();
  itemsHaveIcons = computed(() => this.items()?.some((item) => !!item.icon));
  menuPanel = inject(MenuPanel);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlayHandle = inject(OVERLAY_HANDLE) as { setInteractionRoot(root: HTMLElement | null): void };
  private readonly router = inject(Router);

  constructor() {
    this.overlayHandle.setInteractionRoot(this.elementRef.nativeElement);
  }

  navigate(url: string) {
    this.menuPanel.closeAllSoon();
    void this.router.navigateByUrl(url);
  }
}
