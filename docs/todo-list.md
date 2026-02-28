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


- Технический долг в типах/читаемости core-примитивов (`@ts-ignore`, `any`) и низкое покрытие тестами CDK behavior.
  - Референсы:
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list.ts:81](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list.ts:81)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/menu/submenu-trigger.ts:57](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/menu/submenu-trigger.ts:57)
    - [/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/cdk.spec.ts:1](/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/cdk.spec.ts:1)
