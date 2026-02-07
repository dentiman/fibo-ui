import { Component } from '@angular/core';
import { SideMenuGroup, SideMenuItem } from '@fibo-ui/components';

@Component({
  selector: 'app-root-nav',
  imports: [SideMenuGroup, SideMenuItem],
  templateUrl: './root-nav.html',
})
export class RootNavComponent {}
