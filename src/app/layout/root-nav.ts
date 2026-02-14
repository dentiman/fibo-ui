import { Component } from '@angular/core';
import { SideMenuGroup, SideMenuItem } from '@fibo-ui/components';
import { RouterSelectOne } from '@fibo-ui/cdk';

@Component({
  selector: 'app-root-nav',
  imports: [SideMenuGroup, SideMenuItem, RouterSelectOne],
  templateUrl: './root-nav.html',
})
export class RootNavComponent {}
