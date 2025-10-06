import { Routes } from '@angular/router';
import {AppLayoutComponent} from './layout/app-layout';
import {SelectPageComponent} from './pages/select/select-page';
import {TooltipPageComponent} from './pages/tooltip/tooltip-page';
import {MultipleSelectPageComponent} from './pages/multiple/multiple-select-page';
import {MenuPageComponent} from './pages/menu/menu-page';
import {DialogPageComponent} from './pages/dialog-page/dialog-page';
import {ConfirmationPageComponent} from './pages/confirmation-page/confirmation-page';
import {NotificationPageComponent} from './pages/notification-page/notification-page';
import {DatepickerPageComponent} from './pages/datepicker/datepicker';
import {InputPageComponent} from './pages/input/input-page';
import {FormExamplePageComponent} from './pages/form-example-page/form-example-page';
import {SwitchPageComponent} from './pages/switch/switch-page';
import {CheckboxPageComponent} from './pages/checkbox/checkbox-page';
import {LoadingSpinPageComponent} from './pages/loading-spin/loading-spin-page';
import {PlaygroundPageComponent} from './pages/playground-page/playground-page';
import {SideMenuPage} from './pages/side-menu/side-menu-page';
import {ThemeDemoComponent} from './pages/theme-demo/theme-demo';
import {ListboxPageComponent} from './pages/listbox/listbox-page';
import {ButtonDemoPageComponent} from './pages/button-demo/button-demo-page';
import {CdkDataListPageComponent} from './pages/cdk/data-list-page';
import {CdkPopoverPageComponent} from './pages/cdk/popover-page';
import {TablePageComponent} from './pages/grids/table-page/table-page';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: SelectPageComponent
      },
      {
        path: 'input',
        component: InputPageComponent
      },
      {
        path: 'select-multiple',
        component: MultipleSelectPageComponent
      },
      {
        path: 'tooltips',
        component: TooltipPageComponent
      },
      {
        path: 'menu',
        component: MenuPageComponent
      },
      {
        path: 'dialog',
        component: DialogPageComponent
      },
      {
        path: 'confirmation',
        component: ConfirmationPageComponent
      },
      {
        path: 'notifications',
        component: NotificationPageComponent
      },
      {
        path: 'datepicker',
        component: DatepickerPageComponent
      },
      {
        path: 'form-example',
        component: FormExamplePageComponent
      },
      {
        path: 'switch',
        component: SwitchPageComponent
      },
      {
        path: 'checkbox',
        component: CheckboxPageComponent
      },
      {
        path: 'loading-spin',
        component: LoadingSpinPageComponent
      },
      {
        path: 'playground',
        component: PlaygroundPageComponent
      },
      {
        path: 'side-menu',
        component: SideMenuPage
      },
      {
        path: 'theme-demo',
        component: ThemeDemoComponent
      },
      {
        path: 'listbox',
        component: ListboxPageComponent
      },
      {
        path: 'button-demo',
        component: ButtonDemoPageComponent
      },
      {
        path: 'table',
        component: TablePageComponent
      },
      {
        path: 'cdk',
        children: [
          { path: 'data-list', component: CdkDataListPageComponent },
          { path: 'popover', component: CdkPopoverPageComponent },
          { path: '', pathMatch: 'full', redirectTo: 'data-list' }
        ]
      }
    ]
  }
];
