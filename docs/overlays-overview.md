# Overlay System Review (post-refactor)

Дата аудита: 2026-03-01  
Проект: `fibo-ui` (Angular 21)

## 1) Что изменилось после рефакторинга

Система overlays стала существенно более цельной:

- Введён единый `OverlayRegistry` с типами категорий:
  - `popover | menu | dialog | tooltip | confirmation | notification`
  - файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/portal/overlay-registry.ts`
- Введён единый рендер-слой `fibo-cdk-overlay-outlet` + app-level агрегатор `fibo-overlay-outlet`.
  - файлы:
    - `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/portal/overlay-outlet.ts`
    - `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/overlay-outlet.ts`
    - `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/src/app/app.html`
- `PopoverTrigger` переведён на общий реестр и теперь принимает `content` + `overlayCategory`.
  - файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/popover/popover-trigger.ts`
- `Dialog/Drawer/Tooltip/Confirmation/Notification` получили согласованную enter/leave-анимацию через общий pipeline (`animate.leave="overlay-leave"` в outlet + локальные стили).
- Ранее выявленные баги закрыты:
  - confirmation object-content merge исправлен
  - ручное закрытие notification теперь идёт через `Notifier.removeNotification()`
  - cleanup `injectorCache` в outlet добавлен

## 2) Актуальная архитектура

### 2.1 CDK

- `OverlayRegistry`:
  - хранит `Map<string, OverlayEntry>` в signal
  - вычисляет `zIndex` по категории + счётчик
  - поддерживает `topmost`, `closeTopmost()`, `closeAllByCategory(...)`
- `OverlayOutletComponent`:
  - рендерит overlays из реестра
  - инжектит `OVERLAY_REF` (category/z-index/close/referenceElement)
  - слушает глобальный `Escape` и закрывает topmost, кроме skip-категорий (`tooltip`, `notification`)
- `PopoverTrigger`:
  - регистрирует `TemplateRef` в реестр с категорией
  - передаёт close callback и referenceElement

### 2.2 Components

- `fibo-overlay-outlet` агрегирует все overlay-подсистемы в одном root:
  - tooltip
  - confirmation
  - notification
  - cdk overlay outlet
- `dialog` и `drawer` полностью встроены в тот же overlay-поток через `fiboPopoverTriggerClick overlayCategory="dialog" [content]="..."`.

Итог: основная архитектурная фрагментация из прошлого ревью устранена.

## 3) Текущие Findings (по приоритету)

## P1 / Высокий

- `ConfirmationService.isOpen` семантически рассинхронизирован с визуальным состоянием.
  - `close()` делает `registry.unregister('confirmation')`, но `config` не очищается.
  - Из-за этого `isOpen = computed(() => !!config())` остаётся `true` после закрытия.
  - Файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/confirmation/confirmation-service.ts:26`
  - Риск: неверная телеметрия/бизнес-логика при проверке `isOpen`, удержание последнего `onConfirm`/payload в памяти дольше нужного.

- README частично устарел относительно нового API (`[content]`/overlay-outlet), всё ещё есть примеры с `fiboPortalContent` и старым confirmation input.
  - Файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/README.md:161`
  - Файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/README.md:333`
  - Файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/README.md:259`

## P2 / Средний

- Scroll lock в `OverlayOutletComponent` всё ещё задаётся прямой записью в `document.documentElement.style.overflow`.
  - Файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/portal/overlay-outlet.ts:48`
  - Рекомендация: вынести в отдельный lock-manager (stack-safe, restore previous value, SSR guard).

- `ConfirmationTrigger` использует селектор `button, [confirm]` и runtime-проверку подписчиков (`listeners`) через `any`.
  - Файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/confirmation/confirmation-trigger.ts:7`
  - Риск: неочевидное поведение при массовом импорте директивы; хрупкость на внутренних API output/listeners.

- Tooltip остаётся mouse-first (нет `focus/blur` parity и `aria-describedby` стратегии).
  - Файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/components/src/lib/overlay/tooltip/tooltip.ts:10`

- `DataList/DataListItem` по-прежнему без полной role-модели (`menu/menuitem` vs `listbox/option`).
  - Файлы:
    - `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list.ts`
    - `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/data-list/data-list-item.directive.ts`

- Тестовое покрытие overlay-контуров остаётся низким (нет целевых unit/integration spec на registry + lifecycle + keyboard).
  - Файл: `/Users/dentiman/dev/projects/fibo-stack/fibo-ui/projects/fibo-ui/cdk/src/lib/cdk.spec.ts`

## 4) Что уже можно считать Best-Practice уровнем

- Единый typed overlay-registry вместо нескольких несвязанных сервисов.
- Категоризация overlays с предсказуемым z-index базисом.
- Централизованный Escape-handling на уровне outlet.
- Унифицированная стратегия leave-анимации через общий контейнер.
- `OVERLAY_REF` как единый контракт для close/category/reference metadata.

## 5) Обновлённые рекомендации

### Шаг 1 (1 день)

- Исправить жизненный цикл `ConfirmationService`:
  - после завершения leave-анимации очищать `config` (или ввести отдельный `isMounted` vs `isOpen`).
- Обновить `components/README.md` под текущие API:
  - `[content]` вместо `fiboPortalContent`
  - текущий confirmation trigger contract
  - единый root: `<fibo-overlay-outlet />`

### Шаг 2 (1-2 дня)

- Вынести scroll-lock в отдельный сервис с референс-счётчиком и SSR-safe guard.
- Стабилизировать `ConfirmationTrigger` API:
  - либо строго `[confirm]` selector,
  - либо отдельная директива для `(confirm)`-поведения без опоры на internal `listeners`.

### Шаг 3 (2-3 дня)

- Accessibility hardening:
  - tooltip: `focus/blur`, `aria-describedby`
  - confirmation: при необходимости focus trap + focus restore
  - data-list/menu role model

### Шаг 4 (2-3 дня)

- Добавить тесты для critical flows:
  - `OverlayRegistry.register/unregister/closeTopmost/closeAllByCategory`
  - confirmation lifecycle (`open -> close -> state cleanup`)
  - notification timer + manual close
  - keyboard dismiss (Escape topmost)

## 6) Итог

Рефакторинг overlay-системы успешный: ядро стало гораздо более консистентным и предсказуемым, особенно по типам, layering и анимационному pipeline.  
Оставшиеся рекомендации теперь в основном про hardening (state semantics, a11y, docs и тесты), а не про фундаментальную архитектуру.
