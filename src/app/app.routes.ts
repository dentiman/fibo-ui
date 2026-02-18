import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout';
import { InstallationPageComponent } from './pages/getting-started/installation-page';
import { IntroductionPageComponent } from './pages/getting-started/introduction-page';
import { CdkDataListPageComponent } from './pages/cdk/data-list-page';
import { CdkPopoverPageComponent } from './pages/cdk/popover-page';
import { ButtonDemoPageComponent } from './pages/components/data-display/button-demo-page';
import { ListboxPageComponent } from './pages/components/data-display/listbox-page';
import { LoadingSpinPageComponent } from './pages/components/data-display/loading-spin-page';
import { TablePageComponent } from './pages/components/data-display/table-page';
import { ComponentsFieldsFormComponent } from './pages/components/examples/components-fields-form';
import { FormExamplePageComponent } from './pages/components/examples/form-example-page';
import { PlaygroundPageComponent } from './pages/components/examples/playground-page';
import { ThemeDemoComponent } from './pages/components/examples/theme-demo';
import { TreeMenuPage } from './pages/components/examples/tree-menu-page';
import { CheckboxPageComponent } from './pages/components/form-controls/checkbox/checkbox-page';
import { DatepickerPageComponent } from './pages/components/form-controls/datepicker';
import { InputPageComponent } from './pages/components/form-controls/input-page';
import { MultipleSelectPageComponent } from './pages/components/form-controls/multiple-select-page';
import { SelectPageComponent } from './pages/components/form-controls/select-page';
import { SwitchPageComponent } from './pages/components/form-controls/switch/switch-page';
import { ConfirmationPageComponent } from './pages/components/overlays/confirmation-page';
import { DialogPageComponent } from './pages/components/overlays/dialog-page';
import { DrawerPageComponent } from './pages/components/overlays/drawer-page';
import { MenuMultiLevelDataDrivenPageComponent } from './pages/components/overlays/menu-multi-level-data-driven-page';
import { MenuOneLevelPageComponent } from './pages/components/overlays/menu-one-level-page';
import { MenuPageComponent } from './pages/components/overlays/menu-page';
import { NotificationPageComponent } from './pages/components/overlays/notification-page';
import { TooltipPageComponent } from './pages/components/overlays/tooltip-page';

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
        path: 'getting-started/introduction',
        component: IntroductionPageComponent,
      },
      {
        path: 'getting-started/installation',
        component: InstallationPageComponent,
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
        path: 'menu-one-level',
        component: MenuOneLevelPageComponent
      },
      {
        path: 'menu-multi-level-data-driven',
        component: MenuMultiLevelDataDrivenPageComponent
      },
      {
        path: 'dialog',
        component: DialogPageComponent
      },
      {
        path: 'drawer',
        component: DrawerPageComponent
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
        path: 'components-fields-form',
        component: ComponentsFieldsFormComponent
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
        path: 'tree-menu',
        component: TreeMenuPage
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
