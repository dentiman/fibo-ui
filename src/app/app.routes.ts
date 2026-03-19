import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/components/form-controls/select-page').then(
            (m) => m.SelectPageComponent,
          ),
      },
      {
        path: 'getting-started/introduction',
        loadComponent: () =>
          import('./pages/getting-started/introduction-page').then(
            (m) => m.IntroductionPageComponent,
          ),
      },
      {
        path: 'getting-started/installation',
        loadComponent: () =>
          import('./pages/getting-started/installation-page').then(
            (m) => m.InstallationPageComponent,
          ),
      },
      {
        path: 'form-field-control',
        loadComponent: () =>
          import('./pages/components/form-controls/form-field-control-page').then(
            (m) => m.FormFieldControlPageComponent,
          ),
      },
      {
        path: 'input',
        loadComponent: () =>
          import('./pages/components/form-controls/input-page').then(
            (m) => m.InputPageComponent,
          ),
      },
      {
        path: 'combobox',
        loadComponent: () =>
          import('./pages/components/form-controls/combobox-page').then(
            (m) => m.ComboboxPageComponent,
          ),
      },
      {
        path: 'select-multiple',
        loadComponent: () =>
          import('./pages/components/form-controls/multiple-select-page').then(
            (m) => m.MultipleSelectPageComponent,
          ),
      },
      {
        path: 'tooltips',
        loadComponent: () =>
          import('./pages/components/overlays/tooltip-page').then(
            (m) => m.TooltipPageComponent,
          ),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./pages/components/overlays/menu-page').then((m) => m.MenuPageComponent),
      },
      {
        path: 'dialog',
        loadComponent: () =>
          import('./pages/components/overlays/dialog-page').then(
            (m) => m.DialogPageComponent,
          ),
      },
      {
        path: 'drawer',
        loadComponent: () =>
          import('./pages/components/overlays/drawer-page').then(
            (m) => m.DrawerPageComponent,
          ),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./pages/components/overlays/confirmation-page').then(
            (m) => m.ConfirmationPageComponent,
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/components/overlays/notification-page').then(
            (m) => m.NotificationPageComponent,
          ),
      },
      {
        path: 'datepicker',
        loadComponent: () =>
          import('./pages/components/form-controls/datepicker').then(
            (m) => m.DatepickerPageComponent,
          ),
      },
      {
        path: 'datepicker-range',
        loadComponent: () =>
          import('./pages/components/form-controls/datepicker-range').then(
            (m) => m.DatepickerRangePageComponent,
          ),
      },
      {
        path: 'form-example',
        pathMatch: 'full',
        redirectTo: 'form-examples',
      },
      {
        path: 'form-examples',
        loadComponent: () =>
          import('./pages/components/form-controls/form-examples-page').then(
            (m) => m.FormExamplesPageComponent,
          ),
      },
      {
        path: 'components-fields-form',
        loadComponent: () =>
          import('./pages/components/examples/components-fields-form').then(
            (m) => m.ComponentsFieldsFormComponent,
          ),
      },
      {
        path: 'switch',
        loadComponent: () =>
          import('./pages/components/form-controls/switch/switch-page').then(
            (m) => m.SwitchPageComponent,
          ),
      },
      {
        path: 'checkbox',
        loadComponent: () =>
          import('./pages/components/form-controls/checkbox/checkbox-page').then(
            (m) => m.CheckboxPageComponent,
          ),
      },
      {
        path: 'loading-spin',
        loadComponent: () =>
          import('./pages/components/data-display/loading-spin-page').then(
            (m) => m.LoadingSpinPageComponent,
          ),
      },
      {
        path: 'playground',
        loadComponent: () =>
          import('./pages/components/examples/playground-page').then(
            (m) => m.PlaygroundPageComponent,
          ),
      },
      {
        path: 'tree-menu',
        loadComponent: () =>
          import('./pages/components/examples/tree-menu-page').then((m) => m.TreeMenuPage),
      },
      {
        path: 'theme-demo',
        loadComponent: () =>
          import('./pages/components/examples/theme-demo').then(
            (m) => m.ThemeDemoComponent,
          ),
      },
      {
        path: 'listbox',
        loadComponent: () =>
          import('./pages/components/data-display/listbox-page').then(
            (m) => m.ListboxPageComponent,
          ),
      },
      {
        path: 'button-demo',
        loadComponent: () =>
          import('./pages/components/data-display/button-demo-page').then(
            (m) => m.ButtonDemoPageComponent,
          ),
      },
      {
        path: 'table',
        loadComponent: () =>
          import('./pages/components/data-display/table-page').then(
            (m) => m.TablePageComponent,
          ),
      },
      {
        path: 'cdk',
        children: [
          {
            path: 'data-list',
            loadComponent: () =>
              import('./pages/cdk/data-list-page').then(
                (m) => m.CdkDataListPageComponent,
              ),
          },
          {
            path: 'overlay',
            loadComponent: () =>
              import('./pages/cdk/overlay-page').then(
                (m) => m.CdkOverlaysPageComponent,
              ),
          },
          {
            path: 'selection-model',
            loadComponent: () =>
              import('./pages/cdk/selection-model-page').then(
                (m) => m.CdkSelectionModelPageComponent,
              ),
          },
          {
            path: 'composition',
            loadComponent: () =>
              import('./pages/cdk/composition-page').then(
                (m) => m.CdkCompositionPageComponent,
              ),
          },
          { path: '', pathMatch: 'full', redirectTo: 'data-list' },
        ],
      },
    ],
  },
];
