# Overlay System Review (CDK + Components + App Usage)

Дата аудита: 2026-02-28  
Проект: `fibo-ui` (Angular 21)

## 1) Scope и методология

Проверены три слоя:
- `projects/fibo-ui/cdk/src/lib/**` (overlay primitives, popover, menu, a11y)
- `projects/fibo-ui/components/src/lib/overlay/**` + menu/form-control usage
- интеграция в приложении (`src/app/app.html`, demo pages, docs/README)

Сверка делалась по практикам:
- консистентный overlay stack (z-index, dismiss, lifecycle)
- accessibility (focus, keyboard, aria semantics)
- предсказуемость API и документации
- тестопригодность и покрытие критичных сценариев

## 2) Архитектура как есть

### 2.1 CDK-слой

- Центральный реестр: `OverlayRegistry` хранит открытые оверлеи в `signal<Map<...>>`, сортирует по z-index, умеет `closeTopmost()` и `closeAllByCategory(...)`.
- Рендеринг: один `fibo-overlay-outlet` в корне рендерит `TemplateRef` из реестра.
- Управление триггером: `PopoverTrigger` открывает/закрывает overlay через `isOpen` signal.
- Позиционирование: `PopoverPosition` использует `@floating-ui/dom` + `autoUpdate` + `flip/shift/offset`.
- Меню: `MenuPanel` и `SubmenuTrigger` поверх popover primitives, с delayed-open логикой.
- Модалки: `fibo-dialog` и `fibo-drawer` рендерятся через тот же реестр (`overlayCategory="dialog"`), с `FocusTrap`.

### 2.2 Components-слой

Есть 2 разных подхода:
- Через общий overlay stack (registry/outlet): `dialog`, `drawer`, `menu`, `select`, `datepicker`.
- Отдельные singleton-контейнеры/сервисы вне registry: `tooltip`, `confirmation`, `notification`.

### 2.3 App usage

В `src/app/app.html` подключены 4 независимых overlay root:
- `<fibo-tooltip-container>`
- `<fibo-confirmation>`
- `<fibo-notification>`
- `<fibo-overlay-outlet>`

Итог: overlay-система фактически разрезана на несколько параллельных стеков.

## 3) Что сделано хорошо

- Сильный low-level фундамент: signal-first реализация, чистая декомпозиция (`trigger -> registry -> outlet`).
- `floating-ui` используется корректно (`autoUpdate`, `flip`, `shift`) для popover-позиционирования.
- Для dialog/drawer уже есть `FocusTrap`, nested dialogs поддерживаются.
- Меню-подсистема (`MenuPanel/SubmenuTrigger`) аккуратно интегрирована с keyboard navigation.

## 4) Слабые места и риски

## P0 / Критично

- **Confirmation: object-content фактически не применяется.**  
  В `ConfirmationService` конфиг хранится как `{ content, onConfirm }`, но в `FiboConfirmation.content` мержится `...config`, а не `...config.content`.  
  Файл: `projects/fibo-ui/components/src/lib/overlay/confirmation/confirmation.ts:75-82`, `.../confirmation-service.ts:10-13`.
  Эффект: кастомные `title/message/labels` из API не доходят в UI.

- **Notification: ручное закрытие обходит cleanup таймеров.**  
  Сервис имеет `removeNotification()` с очисткой `timers`, но компонент удаляет запись напрямую через `this.notifications.update(...)`.  
  Файл: `.../notifier.ts:41-50`, `.../notification.ts:50-53`, `.../notification.html:47`.
  Эффект: stale timers, лишние callback, рост `timers` до срабатывания timeout.

## P1 / Высокий приоритет

- **Фрагментированная overlay-архитектура (несколько стеков вместо одного).**  
  Tooltip/Confirmation/Notification живут вне `OverlayRegistry`, поэтому политики закрытия, layering, a11y и lifecycle расходятся.
  Файл: `src/app/app.html:1-5`.

- **Несогласованный z-index контракт между стеком и singleton-оверлеями.**  
  Registry: `dialog=500`, `popover/menu=1000`; CSS: `notification=10`, `tooltip=9999`.  
  Файл: `.../overlay-registry.ts:6-11`, `.../components.css:3-9`.
  Риски: неожиданный stacking-order, особенно при сочетании modal + tooltip/toast.

- **`OverlayOutlet` имеет потенциальный memory leak по injector cache.**  
  `injectorCache` только заполняется, но не очищается при `unregister`.  
  Файл: `.../overlay-outlet.ts:17, 30-50`.
  Риск: рост памяти при динамически создаваемых триггерах.

- **Scroll lock реализован “жёсткой” записью `document.documentElement.style.overflow`.**  
  Нет менеджера блокировок, нет сохранения предыдущего значения, нет SSR-guard.  
  Файл: `.../overlay-outlet.ts:20-27`.

- **Вероятный API mismatch в confirmation trigger usage.**  
  Директива имеет selector `[confirm]`, но в примерах/README используется только `(confirm)` без атрибута `confirm`.  
  Файл: `.../confirmation-trigger.ts:5`, `src/app/pages/components/overlays/confirmation-page.ts:8-10`, `components/README.md:253-260`.
  Риск: директива может не применяться в expected usage (нужно унифицировать API однозначно).

## P2 / Средний приоритет

- **Accessibility: tooltip только mouse events.**  
  Нет `focus/blur`, нет явной `aria-describedby` стратегии.  
  Файл: `.../tooltip.ts:9-12`.

- **Accessibility: confirmation не использует focus trap и keyboard dismiss.**  
  Есть `role="dialog"`, но нет trap/restore focus и Escape-handling.  
  Файл: `.../confirmation.html:1-21`.

- **Accessibility: DataList/DataListItem без role-модели (`listbox/menu/option/menuitem`).**  
  Есть aria-selected/aria-disabled, но нет полноценной role-структуры.  
  Файл: `.../data-list.ts:13-16`, `.../data-list-item.directive.ts:10-18`.

- **Документация отстала от текущего API.**  
  README использует `fiboPortalContent`, которого в коде нет; для confirmation examples использует `[content]`, а реальный alias `fiboConfirmationContent`.  
  Файл: `components/README.md:161-169, 333-336, 259`, `.../confirmation-trigger.ts:13`.

- **Практически нет тестов overlay-слоя.**  
  В CDK есть только smoke test, в components overlay spec нет.  
  Файл: `projects/fibo-ui/cdk/src/lib/cdk.spec.ts`.

## 5) Сравнение с best practices (краткий scorecard)

- **Overlay stack consistency:** 5/10  
  Хороший базовый stack есть, но параллельно живут 3 отдельные подсистемы.

- **Accessibility (modal/popover/tooltip/menu):** 6/10  
  Dialog/Drawer заметно лучше, но confirmation/tooltip/menu roles недотянуты.

- **API coherence & docs accuracy:** 4/10  
  Есть drift между docs и реальным API.

- **Lifecycle & cleanup robustness:** 5/10  
  Есть cleanup в большинстве мест, но есть точечные утечки/обходы.

- **Testing readiness:** 3/10  
  Критические сценарии overlay не покрыты.

## 6) Рекомендованный план улучшений

### Шаг 1 (быстрые фиксы, 1-2 дня)

- Исправить confirmation content merge (`...config.content` для object-case).
- В `Notification` делегировать закрытие только через `Notifier.removeNotification(...)`.
- Добавить очистку `injectorCache` при исчезновении portal id.
- Обновить README/examples под текущий API (`[content]` у trigger, убрать `fiboPortalContent`, поправить confirmation usage).

### Шаг 2 (архитектурная консолидация, 3-5 дней)

- Ввести единый `OverlayFacade/OverlayStackService` для всех overlay-типов (dialog, popover/menu, tooltip, confirmation, notification).
- Унифицировать политики:
  - z-index tokens
  - Escape handling
  - close-on-route-change (где применимо)
  - focus/scroll-lock ownership

### Шаг 3 (a11y и DX hardening, 2-4 дня)

- Confirmation перевести на тот же modal pipeline (focus trap, restore focus, keyboard dismissal).
- Tooltip: добавить focus/blur и `aria-describedby` стратегию.
- DataList/Menu: добавить role-модель (`role=listbox/menu`, `role=option/menuitem`) и проверить SR-поведение.

### Шаг 4 (тесты, 2-3 дня)

- Unit tests:
  - registry ordering + closeTopmost
  - dialog scroll-lock/focus restore
  - notification timer cleanup on manual close
  - confirmation object-content rendering
- E2E smoke:
  - nested modal + menu + tooltip layering
  - keyboard-only сценарии

## 7) Итог

Система overlay в `cdk` технически сильная и современная (signals + floating-ui), но на уровне `components` и `app usage` сейчас есть архитектурная фрагментация и API drift.  
Главный вектор улучшения: свести все overlay-паттерны к единому стеку и единому контракту (layering, dismiss, focus, docs, tests). Это даст и стабильность, и предсказуемость для пользователей библиотеки.
