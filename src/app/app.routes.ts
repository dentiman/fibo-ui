import { Routes } from '@angular/router';
import {AppLayoutComponent} from './layout/app-layout.component';
import {SelectPageComponent} from './pages/select/select-page.component';
import {TooltipPageComponent} from './pages/tooltip/tooltip-page.component';
import {MultipleSelectPageComponent} from './pages/multiple/multiple-select-page.component';
import {MenuPageComponent} from './pages/menu/menu-page.component';
import {DialogPageComponent} from './pages/dialog-page/dialog-page.component';
import {ConfirmationPageComponent} from './pages/confirmation-page/confirmation-page.component';
import {NotificationPageComponent} from './pages/notification-page/notification-page.component';
import {DatepickerPageComponent} from './pages/datepicker/datepicker.component';
import {InputPageComponent} from './pages/input/input-page.component';
import {FormExamplePageComponent} from './pages/form-example-page/form-example-page.component';
import {SwitchPageComponent} from './pages/switch/switch-page.component';
import {CheckboxPageComponent} from './pages/checkbox/checkbox-page.component';
import {LoadingSpinPageComponent} from './pages/loading-spin/loading-spin-page.component';

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
      }
    ]
  }
];
