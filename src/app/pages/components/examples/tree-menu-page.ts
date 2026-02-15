import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeMenu, MenuItemType } from '@fibo-ui/components';
import { ChangeDetectionStrategy } from '@angular/core';
import { DataList, RouterSelectOne } from '@fibo-ui/cdk';

@Component({
  selector: 'app-tree-menu-page',
  imports: [CommonModule, TreeMenu, DataList, RouterSelectOne],
  template: `
    <fibo-tree-menu fiboDataList fiboRouterSelectOne [items]="menuItems"></fibo-tree-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeMenuPage {
  menuItems: MenuItemType[] = [
    {
      label: '.github',
      icon: 'git-branch',
      children: [
        {
          label: 'workflows',
          children: [
            { label: 'ci.yml', icon: 'settings', value: 'ci.yml' },
            { label: 'deploy.yml', icon: 'cloud', value: 'deploy.yml' },
            { label: 'lint.yml', icon: 'settings', value: 'lint.yml' },
            { label: 'test.yml', icon: 'bug', value: 'test.yml' },
            { label: 'release.yml', icon: 'settings', value: 'release.yml' },
          ],
        },
        { label: 'CODEOWNERS', icon: 'file-text', value: 'CODEOWNERS' },
        { label: 'dependabot.yml', icon: 'settings', value: 'dependabot.yml' },
        { label: 'ISSUE_TEMPLATE.md', icon: 'file-text', value: 'ISSUE_TEMPLATE.md' },
        { label: 'PULL_REQUEST_TEMPLATE.md', icon: 'file-text', value: 'PULL_REQUEST_TEMPLATE.md' },
        { label: 'FUNDING.yml', icon: 'file-text', value: 'FUNDING.yml' },
      ],
    },
    {
      label: 'src',
      children: [
        {
          label: 'app',
          children: [
            {
              label: 'features',
              children: [
                {
                  label: 'auth',
                  icon: 'shield-check',
                  children: [
                    {
                      label: 'components',
                      icon: 'component',
                      children: [
                        { label: 'login-form.component.ts', icon: 'code', value: 'login-form' },
                        { label: 'register-form.component.ts', icon: 'code', value: 'register-form' },
                        { label: 'forgot-password.component.ts', icon: 'code', value: 'forgot-password' },
                        { label: 'reset-password.component.ts', icon: 'code', value: 'reset-password' },
                        { label: 'two-factor.component.ts', icon: 'code', value: 'two-factor' },
                      ],
                    },
                    {
                      label: 'guards',
                      icon: 'shield-check',
                      children: [
                        { label: 'auth.guard.ts', icon: 'code', value: 'auth.guard' },
                        { label: 'role.guard.ts', icon: 'code', value: 'role.guard' },
                        { label: 'admin.guard.ts', icon: 'code', value: 'admin.guard' },
                        { label: 'session.guard.ts', icon: 'code', value: 'session.guard' },
                        { label: 'permissions.guard.ts', icon: 'code', value: 'permissions.guard' },
                      ],
                    },
                    { label: 'auth.service.ts', icon: 'wrench', value: 'auth.service' },
                    { label: 'auth.interceptor.ts', icon: 'code', value: 'auth.interceptor' },
                    { label: 'auth.models.ts', icon: 'file', value: 'auth.models' },
                    { label: 'token.service.ts', icon: 'wrench', value: 'token.service' },
                    { label: 'auth.config.ts', icon: 'settings', value: 'auth.config' },
                  ],
                },
                {
                  label: 'dashboard',
                  icon: 'layout-template',
                  children: [
                    {
                      label: 'widgets',
                      icon: 'component',
                      children: [
                        {
                          label: 'charts',
                          icon: 'layers',
                          children: [
                            { label: 'line-chart.component.ts', icon: 'code', value: 'line-chart' },
                            { label: 'bar-chart.component.ts', icon: 'code', value: 'bar-chart' },
                            { label: 'pie-chart.component.ts', icon: 'code', value: 'pie-chart' },
                            { label: 'chart.service.ts', icon: 'wrench', value: 'chart.service' },
                            { label: 'chart.types.ts', icon: 'file', value: 'chart.types' },
                          ],
                        },
                        { label: 'stats-card.component.ts', icon: 'code', value: 'stats-card' },
                        { label: 'recent-activity.component.ts', icon: 'code', value: 'recent-activity' },
                        { label: 'quick-actions.component.ts', icon: 'code', value: 'quick-actions' },
                        { label: 'notifications-panel.component.ts', icon: 'code', value: 'notifications-panel' },
                        { label: 'user-summary.component.ts', icon: 'code', value: 'user-summary' },
                      ],
                    },
                    { label: 'dashboard.component.ts', icon: 'code', value: 'dashboard.component' },
                    { label: 'dashboard.routes.ts', icon: 'code', value: 'dashboard.routes' },
                    { label: 'dashboard.service.ts', icon: 'wrench', value: 'dashboard.service' },
                    { label: 'dashboard.models.ts', icon: 'file', value: 'dashboard.models' },
                    { label: 'dashboard.resolver.ts', icon: 'code', value: 'dashboard.resolver' },
                  ],
                },
                {
                  label: 'users',
                  icon: 'user',
                  children: [
                    {
                      label: 'components',
                      icon: 'component',
                      children: [
                        {
                          label: 'user-list',
                          children: [
                            { label: 'user-list.component.ts', icon: 'code', value: 'user-list.ts' },
                            { label: 'user-list.component.html', icon: 'layout-template', value: 'user-list.html' },
                            { label: 'user-table.component.ts', icon: 'code', value: 'user-table' },
                            { label: 'user-filters.component.ts', icon: 'code', value: 'user-filters' },
                            { label: 'user-list.component.spec.ts', icon: 'bug', value: 'user-list.spec' },
                          ],
                        },
                        {
                          label: 'user-detail',
                          children: [
                            { label: 'user-detail.component.ts', icon: 'code', value: 'user-detail.ts' },
                            { label: 'user-detail.component.html', icon: 'layout-template', value: 'user-detail.html' },
                            { label: 'user-avatar.component.ts', icon: 'code', value: 'user-avatar' },
                            { label: 'user-activity.component.ts', icon: 'code', value: 'user-activity' },
                            { label: 'user-detail.component.spec.ts', icon: 'bug', value: 'user-detail.spec' },
                          ],
                        },
                        {
                          label: 'user-form',
                          children: [
                            { label: 'user-form.component.ts', icon: 'code', value: 'user-form.ts' },
                            { label: 'user-form.component.html', icon: 'layout-template', value: 'user-form.html' },
                            { label: 'user-form.validators.ts', icon: 'code', value: 'user-form.validators' },
                            { label: 'user-form.service.ts', icon: 'wrench', value: 'user-form.service' },
                            { label: 'user-form.component.spec.ts', icon: 'bug', value: 'user-form.spec' },
                          ],
                        },
                      ],
                    },
                    { label: 'users.service.ts', icon: 'wrench', value: 'users.service' },
                    { label: 'users.routes.ts', icon: 'code', value: 'users.routes' },
                    { label: 'users.models.ts', icon: 'file', value: 'users.models' },
                    { label: 'users.resolver.ts', icon: 'code', value: 'users.resolver' },
                    { label: 'users.store.ts', icon: 'database', value: 'users.store' },
                  ],
                },
                {
                  label: 'settings',
                  icon: 'settings',
                  children: [
                    {
                      label: 'sections',
                      children: [
                        { label: 'profile-settings.component.ts', icon: 'code', value: 'profile-settings' },
                        { label: 'security-settings.component.ts', icon: 'shield-check', value: 'security-settings' },
                        { label: 'notification-prefs.component.ts', icon: 'bell', value: 'notification-prefs' },
                        { label: 'appearance-settings.component.ts', icon: 'code', value: 'appearance-settings' },
                        { label: 'api-keys.component.ts', icon: 'lock', value: 'api-keys' },
                      ],
                    },
                    { label: 'settings.component.ts', icon: 'code', value: 'settings.component' },
                    { label: 'settings.routes.ts', icon: 'code', value: 'settings.routes' },
                    { label: 'settings.service.ts', icon: 'wrench', value: 'settings.service' },
                    { label: 'settings.models.ts', icon: 'file', value: 'settings.models' },
                    { label: 'settings.resolver.ts', icon: 'code', value: 'settings.resolver' },
                  ],
                },
                {
                  label: 'notifications',
                  icon: 'bell',
                  children: [
                    { label: 'notification-list.component.ts', icon: 'code', value: 'notification-list' },
                    { label: 'notification-item.component.ts', icon: 'code', value: 'notification-item' },
                    { label: 'notifications.service.ts', icon: 'wrench', value: 'notifications.service' },
                    { label: 'notifications.models.ts', icon: 'file', value: 'notifications.models' },
                    { label: 'notifications.store.ts', icon: 'database', value: 'notifications.store' },
                  ],
                },
              ],
            },
            {
              label: 'core',
              icon: 'layers',
              children: [
                {
                  label: 'services',
                  icon: 'wrench',
                  children: [
                    {
                      label: 'api',
                      icon: 'cloud',
                      children: [
                        { label: 'http-client.service.ts', icon: 'code', value: 'http-client' },
                        { label: 'api.interceptor.ts', icon: 'code', value: 'api.interceptor' },
                        { label: 'error-handler.service.ts', icon: 'wrench', value: 'error-handler' },
                        { label: 'cache.service.ts', icon: 'database', value: 'cache.service' },
                        { label: 'retry.interceptor.ts', icon: 'code', value: 'retry.interceptor' },
                      ],
                    },
                    { label: 'logger.service.ts', icon: 'wrench', value: 'logger.service' },
                    { label: 'storage.service.ts', icon: 'database', value: 'storage.service' },
                    { label: 'theme.service.ts', icon: 'wrench', value: 'theme.service' },
                    { label: 'analytics.service.ts', icon: 'wrench', value: 'analytics.service' },
                    { label: 'websocket.service.ts', icon: 'cloud', value: 'websocket.service' },
                  ],
                },
                {
                  label: 'models',
                  children: [
                    { label: 'user.model.ts', icon: 'file', value: 'user.model' },
                    { label: 'api-response.model.ts', icon: 'file', value: 'api-response.model' },
                    { label: 'pagination.model.ts', icon: 'file', value: 'pagination.model' },
                    { label: 'error.model.ts', icon: 'file', value: 'error.model' },
                    { label: 'config.model.ts', icon: 'file', value: 'config.model' },
                  ],
                },
                {
                  label: 'interceptors',
                  children: [
                    { label: 'auth.interceptor.ts', icon: 'code', value: 'core.auth.interceptor' },
                    { label: 'logging.interceptor.ts', icon: 'code', value: 'logging.interceptor' },
                    { label: 'error.interceptor.ts', icon: 'code', value: 'error.interceptor' },
                    { label: 'loading.interceptor.ts', icon: 'code', value: 'loading.interceptor' },
                    { label: 'headers.interceptor.ts', icon: 'code', value: 'headers.interceptor' },
                  ],
                },
                {
                  label: 'guards',
                  icon: 'shield-check',
                  children: [
                    { label: 'auth.guard.ts', icon: 'code', value: 'core.auth.guard' },
                    { label: 'role.guard.ts', icon: 'code', value: 'core.role.guard' },
                    { label: 'feature-flag.guard.ts', icon: 'code', value: 'feature-flag.guard' },
                    { label: 'maintenance.guard.ts', icon: 'code', value: 'maintenance.guard' },
                    { label: 'unsaved-changes.guard.ts', icon: 'code', value: 'unsaved-changes.guard' },
                  ],
                },
                {
                  label: 'utils',
                  icon: 'wrench',
                  children: [
                    { label: 'date.utils.ts', icon: 'code', value: 'date.utils' },
                    { label: 'string.utils.ts', icon: 'code', value: 'string.utils' },
                    { label: 'validators.ts', icon: 'code', value: 'validators' },
                    { label: 'constants.ts', icon: 'file', value: 'constants' },
                    { label: 'type-helpers.ts', icon: 'code', value: 'type-helpers' },
                  ],
                },
              ],
            },
            {
              label: 'shared',
              icon: 'component',
              children: [
                {
                  label: 'components',
                  icon: 'component',
                  children: [
                    { label: 'page-header.component.ts', icon: 'code', value: 'page-header' },
                    { label: 'breadcrumbs.component.ts', icon: 'code', value: 'breadcrumbs' },
                    { label: 'empty-state.component.ts', icon: 'code', value: 'empty-state' },
                    { label: 'loading-skeleton.component.ts', icon: 'code', value: 'loading-skeleton' },
                    { label: 'confirm-dialog.component.ts', icon: 'code', value: 'confirm-dialog' },
                  ],
                },
                {
                  label: 'directives',
                  children: [
                    { label: 'click-outside.directive.ts', icon: 'code', value: 'click-outside' },
                    { label: 'lazy-load.directive.ts', icon: 'code', value: 'lazy-load' },
                    { label: 'tooltip.directive.ts', icon: 'code', value: 'tooltip' },
                    { label: 'permission.directive.ts', icon: 'code', value: 'permission' },
                    { label: 'autofocus.directive.ts', icon: 'code', value: 'autofocus' },
                  ],
                },
                {
                  label: 'pipes',
                  children: [
                    { label: 'relative-time.pipe.ts', icon: 'code', value: 'relative-time' },
                    { label: 'truncate.pipe.ts', icon: 'code', value: 'truncate' },
                    { label: 'file-size.pipe.ts', icon: 'code', value: 'file-size' },
                    { label: 'highlight.pipe.ts', icon: 'code', value: 'highlight' },
                    { label: 'safe-html.pipe.ts', icon: 'code', value: 'safe-html' },
                  ],
                },
                {
                  label: 'layouts',
                  icon: 'layout-template',
                  children: [
                    { label: 'main-layout.component.ts', icon: 'code', value: 'main-layout' },
                    { label: 'sidebar-layout.component.ts', icon: 'code', value: 'sidebar-layout' },
                    { label: 'auth-layout.component.ts', icon: 'code', value: 'auth-layout' },
                    { label: 'error-layout.component.ts', icon: 'code', value: 'error-layout' },
                    { label: 'blank-layout.component.ts', icon: 'code', value: 'blank-layout' },
                  ],
                },
                { label: 'shared.module.ts', icon: 'code', value: 'shared.module' },
              ],
            },
            { label: 'app.config.ts', icon: 'settings', value: 'app.config' },
            { label: 'app.routes.ts', icon: 'code', value: 'app.routes' },
            { label: 'app.component.ts', icon: 'code', value: 'app.component' },
            { label: 'app.component.html', icon: 'layout-template', value: 'app.component.html' },
            { label: 'app.component.spec.ts', icon: 'bug', value: 'app.component.spec' },
          ],
        },
        {
          label: 'assets',
          children: [
            {
              label: 'images',
              children: [
                { label: 'logo.svg', icon: 'file', value: 'logo.svg' },
                { label: 'logo-dark.svg', icon: 'file', value: 'logo-dark.svg' },
                { label: 'favicon.ico', icon: 'file', value: 'favicon.ico' },
                { label: 'placeholder.png', icon: 'file', value: 'placeholder.png' },
                { label: 'avatar-default.svg', icon: 'file', value: 'avatar-default.svg' },
              ],
            },
            {
              label: 'fonts',
              children: [
                { label: 'inter-regular.woff2', icon: 'file', value: 'inter-regular' },
                { label: 'inter-medium.woff2', icon: 'file', value: 'inter-medium' },
                { label: 'inter-bold.woff2', icon: 'file', value: 'inter-bold' },
                { label: 'jetbrains-mono.woff2', icon: 'file', value: 'jetbrains-mono' },
                { label: 'icons.woff2', icon: 'file', value: 'icons' },
              ],
            },
            {
              label: 'i18n',
              children: [
                { label: 'en.json', icon: 'settings', value: 'en.json' },
                { label: 'es.json', icon: 'settings', value: 'es.json' },
                { label: 'fr.json', icon: 'settings', value: 'fr.json' },
                { label: 'de.json', icon: 'settings', value: 'de.json' },
                { label: 'ja.json', icon: 'settings', value: 'ja.json' },
              ],
            },
            { label: '.gitkeep', icon: 'file', value: '.gitkeep' },
          ],
        },
        {
          label: 'environments',
          icon: 'leaf',
          children: [
            { label: 'environment.ts', icon: 'code', value: 'environment.ts' },
            { label: 'environment.dev.ts', icon: 'code', value: 'environment.dev' },
            { label: 'environment.staging.ts', icon: 'code', value: 'environment.staging' },
            { label: 'environment.prod.ts', icon: 'code', value: 'environment.prod' },
            { label: 'environment.test.ts', icon: 'code', value: 'environment.test' },
          ],
        },
        {
          label: 'styles',
          children: [
            { label: 'globals.css', icon: 'file', value: 'globals.css' },
            { label: 'variables.css', icon: 'file', value: 'variables.css' },
            { label: 'typography.css', icon: 'file', value: 'typography.css' },
            { label: 'animations.css', icon: 'file', value: 'animations.css' },
            { label: 'utilities.css', icon: 'file', value: 'utilities.css' },
          ],
        },
        { label: 'main.ts', icon: 'code', value: 'main.ts' },
        { label: 'index.html', icon: 'layout-template', value: 'index.html' },
      ],
    },
    {
      label: 'server',
      icon: 'server',
      children: [
        {
          label: 'api',
          icon: 'cloud',
          children: [
            {
              label: 'routes',
              children: [
                { label: 'auth.routes.ts', icon: 'code', value: 'server.auth.routes' },
                { label: 'users.routes.ts', icon: 'code', value: 'server.users.routes' },
                { label: 'dashboard.routes.ts', icon: 'code', value: 'server.dashboard.routes' },
                { label: 'settings.routes.ts', icon: 'code', value: 'server.settings.routes' },
                { label: 'upload.routes.ts', icon: 'code', value: 'server.upload.routes' },
              ],
            },
            {
              label: 'controllers',
              children: [
                { label: 'auth.controller.ts', icon: 'code', value: 'auth.controller' },
                { label: 'users.controller.ts', icon: 'code', value: 'users.controller' },
                { label: 'dashboard.controller.ts', icon: 'code', value: 'dashboard.controller' },
                { label: 'settings.controller.ts', icon: 'code', value: 'settings.controller' },
                { label: 'upload.controller.ts', icon: 'code', value: 'upload.controller' },
              ],
            },
          ],
        },
        {
          label: 'middleware',
          children: [
            { label: 'auth.middleware.ts', icon: 'shield-check', value: 'auth.middleware' },
            { label: 'cors.middleware.ts', icon: 'code', value: 'cors.middleware' },
            { label: 'rate-limit.middleware.ts', icon: 'code', value: 'rate-limit.middleware' },
            { label: 'logger.middleware.ts', icon: 'code', value: 'logger.middleware' },
            { label: 'validation.middleware.ts', icon: 'code', value: 'validation.middleware' },
          ],
        },
        {
          label: 'models',
          icon: 'database',
          children: [
            { label: 'user.model.ts', icon: 'file', value: 'server.user.model' },
            { label: 'session.model.ts', icon: 'file', value: 'session.model' },
            { label: 'notification.model.ts', icon: 'file', value: 'notification.model' },
            { label: 'audit-log.model.ts', icon: 'file', value: 'audit-log.model' },
            { label: 'file-upload.model.ts', icon: 'file', value: 'file-upload.model' },
          ],
        },
        {
          label: 'config',
          icon: 'settings',
          children: [
            { label: 'database.config.ts', icon: 'database', value: 'database.config' },
            { label: 'redis.config.ts', icon: 'database', value: 'redis.config' },
            { label: 'mail.config.ts', icon: 'settings', value: 'mail.config' },
            { label: 'storage.config.ts', icon: 'settings', value: 'storage.config' },
            { label: 'cors.config.ts', icon: 'settings', value: 'cors.config' },
          ],
        },
        { label: 'server.ts', icon: 'code', value: 'server.ts' },
        { label: 'app.ts', icon: 'code', value: 'server.app.ts' },
      ],
    },
    {
      label: 'docker',
      icon: 'container',
      children: [
        { label: 'Dockerfile', icon: 'container', value: 'Dockerfile' },
        { label: 'Dockerfile.dev', icon: 'container', value: 'Dockerfile.dev' },
        { label: 'docker-compose.yml', icon: 'settings', value: 'docker-compose.yml' },
        { label: 'docker-compose.prod.yml', icon: 'settings', value: 'docker-compose.prod' },
        { label: '.dockerignore', icon: 'file', value: '.dockerignore' },
        {
          label: 'nginx',
          children: [
            { label: 'nginx.conf', icon: 'settings', value: 'nginx.conf' },
            { label: 'default.conf', icon: 'settings', value: 'default.conf' },
            { label: 'ssl.conf', icon: 'lock', value: 'ssl.conf' },
            { label: 'gzip.conf', icon: 'settings', value: 'gzip.conf' },
            { label: 'security-headers.conf', icon: 'shield-check', value: 'security-headers.conf' },
          ],
        },
      ],
    },
    {
      label: 'tests',
      icon: 'bug',
      children: [
        {
          label: 'e2e',
          children: [
            { label: 'auth.e2e-spec.ts', icon: 'bug', value: 'auth.e2e' },
            { label: 'dashboard.e2e-spec.ts', icon: 'bug', value: 'dashboard.e2e' },
            { label: 'users.e2e-spec.ts', icon: 'bug', value: 'users.e2e' },
            { label: 'settings.e2e-spec.ts', icon: 'bug', value: 'settings.e2e' },
            { label: 'navigation.e2e-spec.ts', icon: 'bug', value: 'navigation.e2e' },
          ],
        },
        {
          label: 'integration',
          children: [
            { label: 'api.integration-spec.ts', icon: 'bug', value: 'api.integration' },
            { label: 'database.integration-spec.ts', icon: 'bug', value: 'db.integration' },
            { label: 'auth-flow.integration-spec.ts', icon: 'bug', value: 'auth-flow.integration' },
            { label: 'websocket.integration-spec.ts', icon: 'bug', value: 'ws.integration' },
            { label: 'upload.integration-spec.ts', icon: 'bug', value: 'upload.integration' },
          ],
        },
        {
          label: 'fixtures',
          children: [
            { label: 'users.fixture.ts', icon: 'file', value: 'users.fixture' },
            { label: 'auth.fixture.ts', icon: 'file', value: 'auth.fixture' },
            { label: 'dashboard.fixture.ts', icon: 'file', value: 'dashboard.fixture' },
            { label: 'settings.fixture.ts', icon: 'file', value: 'settings.fixture' },
            { label: 'notifications.fixture.ts', icon: 'file', value: 'notifications.fixture' },
          ],
        },
        { label: 'setup.ts', icon: 'code', value: 'test.setup' },
        { label: 'helpers.ts', icon: 'code', value: 'test.helpers' },
        { label: 'jest.config.ts', icon: 'settings', value: 'jest.config' },
        { label: 'playwright.config.ts', icon: 'settings', value: 'playwright.config' },
        { label: 'test-utils.ts', icon: 'code', value: 'test-utils' },
      ],
    },
    {
      label: 'scripts',
      icon: 'terminal',
      children: [
        { label: 'seed-database.ts', icon: 'terminal', value: 'seed-database' },
        { label: 'migrate.ts', icon: 'terminal', value: 'migrate' },
        { label: 'generate-api-docs.ts', icon: 'terminal', value: 'generate-api-docs' },
        { label: 'analyze-bundle.ts', icon: 'terminal', value: 'analyze-bundle' },
        { label: 'deploy.sh', icon: 'terminal', value: 'deploy.sh' },
      ],
    },
    { label: 'package.json', icon: 'settings', value: 'package.json' },
    { label: 'package-lock.json', icon: 'lock', value: 'package-lock.json' },
    { label: 'tsconfig.json', icon: 'settings', value: 'tsconfig.json' },
    { label: 'angular.json', icon: 'settings', value: 'angular.json' },
    { label: '.eslintrc.json', icon: 'settings', value: '.eslintrc.json' },
    { label: '.prettierrc', icon: 'settings', value: '.prettierrc' },
    { label: '.gitignore', icon: 'git-branch', value: '.gitignore' },
    { label: 'README.md', icon: 'file-text', value: 'README.md' },
    { label: 'LICENSE', icon: 'file-text', value: 'LICENSE' },
  ];
}
