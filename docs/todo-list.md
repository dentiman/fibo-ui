# Remaining Findings (по приоритету)

## P1

- Прод-сборка падает по budget (`initial > 1MB`), из-за этого `npm run build` в production завершается ошибкой.
  - Референс: [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/angular.json:30](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/angular.json:30)

- A11y: `Tooltip` работает только через `mouseenter/mouseleave`, нет keyboard parity (`focus/blur`) и связки для screen readers.
  - Референс: [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/tooltip/tooltip.ts:10](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/tooltip/tooltip.ts:10)

- A11y: смешение listbox/menu-семантики (например, `DataListItem` всегда выставляет `aria-selected`, но меню-роли не формализованы).
  - Референс: [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list-item.directive.ts:13](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list-item.directive.ts:13)

## P2

- Overlay-архитектура смешанная: часть компонентов portal-based, часть service-based. Подход рабочий, но увеличивает когнитивную сложность и стоимость поддержки.
  - Референсы:
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/src/app/app.html:1](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/src/app/app.html:1)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/dialog/dialog-service.ts:1](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/dialog/dialog-service.ts:1)

- OverlayRegistry внедрён частично (стек + z-index), но пока не выполняет роль центрального диспетчера overlay lifecycle:
  - нет API/политик для `closeTop`, `closeGroup/tree`, маршрутизации `Esc` и `outside-click` только на top-most overlay;
  - нет unified причины закрытия (keyboard/backdrop/programmatic) для единообразной логики.
  - Референс: [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/overlay/overlay-registry.ts:51](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/overlay/overlay-registry.ts:51)

- Scroll lock всё ещё локальный в `FiboDialog` через `static openCount`, а не через агрегированное состояние `blocking` overlays в `OverlayRegistry`.
  - Референсы:
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/dialog/dialog.ts:91](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/dialog/dialog.ts:91)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/overlay/overlay-registry.ts:22](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/overlay/overlay-registry.ts:22)

- Service overlays (`Drawer`, `Confirmation`, `Tooltip`, `Notification`) не подключены к `OverlayRegistry`: нет единого global stack/priority, `count(kind)` и общего поведения при конкурирующих слоях.
  - Референсы:
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/drawer/drawer-service.ts:6](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/drawer/drawer-service.ts:6)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/confirmation/confirmation-service.ts:18](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/confirmation/confirmation-service.ts:18)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/tooltip/tooltip-service.ts:8](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/tooltip/tooltip-service.ts:8)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/notification/notifier.ts:16](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/notification/notifier.ts:16)

- A11y для modal layer неполная: нет централизованной изоляции фонового контента (`inert`/`aria-hidden` siblings) на время активного top-level blocking overlay.
  - Референсы:
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/src/app/app.html:1](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/src/app/app.html:1)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/dialog/dialog.ts:17](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/dialog/dialog.ts:17)

- Технический долг в типах/читаемости core-примитивов (`@ts-ignore`, `any`) и низкое покрытие тестами CDK behavior.
  - Референсы:
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list.ts:81](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list.ts:81)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/menu/submenu-trigger.ts:57](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/menu/submenu-trigger.ts:57)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/cdk.spec.ts:1](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/cdk.spec.ts:1)

- Нет unit/integration тестов на новый `OverlayRegistry` (stack order, nested parent z-index, register/unregister lifecycle, top-most semantics).
  - Референс: [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/overlay/overlay-registry.ts:51](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/overlay/overlay-registry.ts:51)
