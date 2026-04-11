# Overlay API Unification — Implementation Plan

## Context

Текущий публичный overlay API раздроблён между тремя семействами recipe-функций
(`createConnectedOverlay`, `createGlobalOverlay`, `createCoordinateOverlay`) и двумя
singleton-вариантами. Flat `Options`-объекты дублируются, `setup(session)` через
thin-адаптер применяет focus/restore логику, а service-driven потребители
(Notifier, ConfirmationService) вынуждены использовать отдельный примитив
`createSingletonOverlay`.

Цель — свести всё к единому публичному `createOverlay(() => config)` с одним
unified config-объектом. Семейство overlay выводится по `position`, default shell
token — тоже по семейству, с explicit override через `shell`. Runtime остаётся
без изменений — новый API строится как тонкий normalization layer поверх
существующего 4-параметрического `createOverlay` из `overlay-stack.ts`.

**Backward compatibility не требуется.** Все потребители внутри репозитория
мигрируют в одном PR. `overlay-recipes.ts` и `overlay-singleton.ts` удаляются
полностью. Каждый потребитель (в частности service-driven) пишет свои локальные
пресеты при необходимости.

Подробное обоснование контракта snapshot/reactive, семейства, focus/close/lifecycle
секций и risk-mitigation — в `docs/overlay/improvements.md`.

---

## Критические файлы

### Runtime ядро (изменяется)

- `projects/fibo-ui/cdk/src/lib/overlay/overlay-stack.ts` — rename top-level
  export `createOverlay` → `createOverlayInternal`. Метод класса
  `OverlayStack.createOverlay(...)` остаётся как есть (он internal).
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-config.ts` — удалить фабрики
  `globalPosition()`, `connectedPosition()`, `coordinatePosition()`. Типы
  `OverlayBehaviorConfig`, `OverlayPositionConfig`, `GlobalPosition`,
  `ConnectedPosition`, `CoordinatePosition` **остаются** — они используются
  runtime-ом и экспортируются через `OverlayHandle`.

### Runtime ядро (без изменений)

- `projects/fibo-ui/cdk/src/lib/overlay/overlay-handle.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-handle-internal.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-session.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-container.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-stack-outlet.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-position.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-behaviors.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-shell-tokens.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-panel.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-content.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-arrow.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-types.ts`

### Новый файл

- `projects/fibo-ui/cdk/src/lib/overlay/public-overlay.ts` — normalization layer
  + публичный `createOverlay(factory)` + типы `PublicOverlayConfig`.

### Удаляемые файлы

- `projects/fibo-ui/cdk/src/lib/overlay/overlay-recipes.ts`
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-singleton.ts`

### Барелл публичного API

- `projects/fibo-ui/cdk/src/public-api.ts` — удалить экспорты
  `overlay-recipes`, `overlay-singleton`. Добавить `public-overlay`. Заменить
  `export * from './lib/overlay/overlay-stack'` на explicit re-export, чтобы
  `createOverlayInternal` не утекал в public.

### Тесты

- `projects/fibo-ui/cdk/src/lib/overlay/overlay-strategy.spec.ts` — переписать
  как `public-overlay.spec.ts` (или rewrite in place). Текущий спек тестирует
  удаляемые фабрики `globalPosition`/`connectedPosition`/`coordinatePosition`
  и старую сигнатуру `createOverlay(isOpen, behavior, position, content)`.

### Потребители (мигрируются)

**CDK:**
- `projects/fibo-ui/cdk/src/lib/overlay/overlay-triggers.ts` — `DialogTrigger`,
  `DrawerTrigger`, `PopoverTrigger`.
- `projects/fibo-ui/cdk/src/lib/menu/submenu-trigger.ts` — `SubmenuTrigger`.

**Components:**
- `projects/fibo-ui/components/src/lib/form-controls/form/field-overlay.ts` —
  `FieldOverlayDirective` (используется `Select`, `MultiSelect`, `DatePickerField`;
  их код не трогаем — они обращаются к директиве, а не напрямую к runtime).
- `projects/fibo-ui/components/src/lib/form-controls/combobox/combobox.ts` —
  `Combobox` (нужен `lifecycle.beforeClose`).
- `projects/fibo-ui/components/src/lib/overlay/tooltip/tooltip-service.ts` —
  `TooltipService` (dynamic reference swap, `lifecycle.afterClose`).
- `projects/fibo-ui/components/src/lib/overlay/notification/notifier.ts` —
  `Notifier` (singleton-pattern через локальные `signal`-ы).
- `projects/fibo-ui/components/src/lib/overlay/confirmation/confirmation-service.ts` —
  `ConfirmationService` (singleton-pattern + `lifecycle.afterClose`).

---

## Шаг 1. Runtime rename

### `overlay-stack.ts`

1. Переименовать функцию-экспорт `createOverlay` (строка ~250) в
   `createOverlayInternal`. Сигнатура не меняется:
   ```ts
   export function createOverlayInternal(
     isOpen: WritableSignal<boolean>,
     behavior: OverlayBehaviorConfig,
     position: Signal<OverlayPositionConfig>,
     content: Signal<TemplateRef<any> | string | null>,
     setup?: (overlay: OverlaySession) => void,
   ): Signal<OverlayHandle | null> {
     return inject(OverlayStack).createOverlay(isOpen, behavior, position, content, setup);
   }
   ```
2. Метод класса `OverlayStack.createOverlay(...)` — **не переименовывать**, он
   internal и продолжает использоваться через `inject(OverlayStack)`.

### `overlay-config.ts`

1. Удалить функции:
  - `globalPosition()`
  - `connectedPosition(...)` (обе перегрузки)
  - `coordinatePosition(...)` (обе перегрузки)
2. Оставить **все** типы: `OverlayBehaviorConfig`, `OverlayPositionConfig`,
   `GlobalPosition`, `ConnectedPosition`, `CoordinatePosition`. Они
   экспортируются через `OverlayHandle.behavior` и `OverlayHandle.position()`.
3. Удалить `import { computed } from '@angular/core'` и `import type { Signal }`
   если они больше не используются.

---

## Шаг 2. Создание normalization layer

### Новый файл `public-overlay.ts`

Структура:

```ts
import {
  type InjectionToken, type Signal, type TemplateRef, type Type,
  type WritableSignal, computed, effect, untracked, isDevMode,
} from '@angular/core';
import type { Placement } from '@floating-ui/dom';
import type {
  OverlayBehaviorConfig, OverlayPositionConfig,
  GlobalPosition, ConnectedPosition, CoordinatePosition,
} from './overlay-config';
import type { OverlayHandle } from './overlay-handle';
import type { OverlaySession } from './overlay-session';
import type { OverlayCloseContext, OverlayCloseReason } from './overlay-types';
import {
  type TrapOverlayFocusOptions,
  trapOverlayFocus,
  restoreTriggerFocusOnClose,
} from './overlay-behaviors';
import { MODAL_SHELL_TOKEN, CONNECTED_SHELL_TOKEN } from './overlay-shell-tokens';
import { createOverlayInternal } from './overlay-stack';

// ─── Публичные типы ────────────────────────────────────────

export interface PublicOverlayFocusConfig {
  trap?: boolean | TrapOverlayFocusOptions;
  restoreTo?: () => HTMLElement | null;
}

export interface PublicOverlayCloseConfig {
  outsideClick?: boolean;
  escape?: boolean;
  focusLeave?: boolean;
  scroll?: boolean;
}

export interface PublicOverlayLifecycleConfig {
  afterOpened?: Array<(overlay: OverlayHandle) => void>;
  beforeClose?: Array<
    (ctx: OverlayCloseContext, overlay: OverlayHandle, reason: OverlayCloseReason) => void
  >;
  afterClose?: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void>;
  canClose?: Array<(reason: OverlayCloseReason, event?: Event) => boolean | void>;
}

export interface PublicConnectedPositionConfig {
  connectedTo: HTMLElement | null;
  placement?: Placement;
  matchWidth?: boolean;
  offset?: number;
}

export interface PublicCoordinatePositionConfig {
  x: number;
  y: number;
  placement?: Placement;
}

export type PublicOverlayPositionConfig =
  | PublicConnectedPositionConfig
  | PublicCoordinatePositionConfig
  | undefined;

export interface PublicOverlayConfig {
  state: WritableSignal<boolean>;
  content: TemplateRef<unknown> | string | null;
  position?: PublicOverlayPositionConfig;

  shell?: InjectionToken<Type<any>>;
  backdrop?: boolean;
  blockScroll?: boolean;

  focus?: PublicOverlayFocusConfig;
  close?: PublicOverlayCloseConfig;
  lifecycle?: PublicOverlayLifecycleConfig;

  setup?: (session: OverlaySession) => void;
}

// ─── Normalization helpers (module-private) ────────────────

type OverlayFamily = 'global' | 'connected' | 'coordinate';

function detectFamily(position: PublicOverlayPositionConfig): OverlayFamily {
  if (!position) return 'global';
  if ('connectedTo' in position) return 'connected';
  return 'coordinate';
}

function normalizePosition(position: PublicOverlayPositionConfig): OverlayPositionConfig {
  if (!position) return { type: 'global' } satisfies GlobalPosition;
  if ('connectedTo' in position) {
    return {
      type: 'connected',
      referenceElement: position.connectedTo,
      placement: position.placement,
      matchWidth: position.matchWidth,
      offset: position.offset,
    } satisfies ConnectedPosition;
  }
  return {
    type: 'coordinate',
    x: position.x,
    y: position.y,
    placement: position.placement,
  } satisfies CoordinatePosition;
}

function defaultShellFor(family: OverlayFamily): InjectionToken<Type<any>> {
  return family === 'global' ? MODAL_SHELL_TOKEN : CONNECTED_SHELL_TOKEN;
}

function defaultBackdropFor(family: OverlayFamily): boolean {
  return family === 'global';
}

function defaultBlockScrollFor(family: OverlayFamily): boolean {
  return family === 'global';
}

function defaultCloseFocusLeaveFor(family: OverlayFamily): boolean {
  return family === 'connected';
}

function defaultTrapFor(family: OverlayFamily): false | TrapOverlayFocusOptions {
  return family === 'connected' ? false : { guard: true };
}

function buildBehavior(
  initial: PublicOverlayConfig,
  family: OverlayFamily,
): OverlayBehaviorConfig {
  return {
    shell: initial.shell ?? defaultShellFor(family),
    needsBackdrop: initial.backdrop ?? defaultBackdropFor(family),
    blockScroll: initial.blockScroll ?? defaultBlockScrollFor(family),
    closeOnEscape: initial.close?.escape ?? true,
    closeOnOutsideClick: initial.close?.outsideClick ?? true,
    closeOnFocusLeave: initial.close?.focusLeave ?? defaultCloseFocusLeaveFor(family),
    closeOnScroll: initial.close?.scroll ?? false,
  };
}

function buildComposedSetup(
  initial: PublicOverlayConfig,
  family: OverlayFamily,
): ((session: OverlaySession) => void) | undefined {
  const trap = initial.focus?.trap ?? defaultTrapFor(family);
  const hasTrap = !!trap;
  const hasRestore = !!initial.focus?.restoreTo;
  const hasLifecycle = !!(
    initial.lifecycle?.afterOpened?.length ||
    initial.lifecycle?.beforeClose?.length ||
    initial.lifecycle?.afterClose?.length ||
    initial.lifecycle?.canClose?.length
  );
  const hasUserSetup = !!initial.setup;

  if (!hasTrap && !hasRestore && !hasLifecycle && !hasUserSetup) {
    return undefined;
  }

  return (session: OverlaySession) => {
    if (trap) {
      trapOverlayFocus(session, typeof trap === 'object' ? trap : undefined);
    }
    if (initial.focus?.restoreTo) {
      restoreTriggerFocusOnClose(session, initial.focus.restoreTo);
    }
    initial.lifecycle?.afterOpened?.forEach(h => session.afterOpened(h));
    initial.lifecycle?.beforeClose?.forEach(h => session.beforeClose(h));
    initial.lifecycle?.afterClose?.forEach(h => session.afterClose(h));
    initial.lifecycle?.canClose?.forEach(g => session.canClose(g));
    initial.setup?.(session);
  };
}

// ─── Публичный API ─────────────────────────────────────────

export function createOverlay(
  factory: () => PublicOverlayConfig,
): Signal<OverlayHandle | null> {
  // 1. Snapshot-секции читаем в untracked, без подписок.
  const initial = untracked(() => factory());
  const state = initial.state;
  const initialFamily = detectFamily(initial.position);
  const behavior = buildBehavior(initial, initialFamily);
  const composedSetup = buildComposedSetup(initial, initialFamily);

  // 2. Reactive content / position — через computed.
  const contentSignal = computed<TemplateRef<any> | string | null>(
    () => factory().content,
  );
  const positionSignal = computed<OverlayPositionConfig>(
    () => normalizePosition(factory().position),
  );

  // 3. Dev-mode: position family guard.
  if (isDevMode()) {
    effect(() => {
      const current = positionSignal();
      if (current.type !== initialFamily) {
        throw new Error(
          `[fibo-ui overlay] position family cannot change within a session: ` +
          `${initialFamily} → ${current.type}. Close the overlay and open a new one.`,
        );
      }
    });
  }

  // 4. Делегируем существующему runtime.
  return createOverlayInternal(state, behavior, positionSignal, contentSignal, composedSetup);
}
```

**Замечания по реализации:**

- `isDevMode()` вместо `ngDevMode` — это публичный API Angular, работает одинаково.
- Family guard effect создаётся в injection context (тот же, в котором вызывается
  `createOverlay`), поэтому cleanup при destroy happens автоматически.
- `composedSetup` не создаётся, если ни один из focus/lifecycle/setup не используется —
  избегаем лишнего callback в runtime.
- `contentSignal` typed как `TemplateRef | string | null` — runtime уже обрабатывает
  `null` в effect и не открывает overlay.

---

## Шаг 3. Удаление старых файлов

1. `rm projects/fibo-ui/cdk/src/lib/overlay/overlay-recipes.ts`
2. `rm projects/fibo-ui/cdk/src/lib/overlay/overlay-singleton.ts`

---

## Шаг 4. Обновление публичного барелла

### `public-api.ts`

1. Удалить строки:
  - `export * from './lib/overlay/overlay-recipes';`
  - `export * from './lib/overlay/overlay-singleton';`
2. Заменить `export * from './lib/overlay/overlay-stack';` на explicit re-export,
   чтобы `createOverlayInternal` не утекал:
   ```ts
   export { OverlayStack } from './lib/overlay/overlay-stack';
   ```
   (Альтернатива: пометить `createOverlayInternal` как `/** @internal */` и
   оставить `export *`. Первый вариант чище.)
3. Добавить:
   ```ts
   export * from './lib/overlay/public-overlay';
   ```
4. Проверить, что `overlay-config.ts` экспортирует только типы — если
   `export *` уже на месте, это нормально (типы остаются, фабрики удалены).

---

## Шаг 5. Миграция потребителей

### 5.1 `overlay-triggers.ts` — DialogTrigger, DrawerTrigger, PopoverTrigger

**DialogTrigger:**
```ts
overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.content(),
  focus: { restoreTo: () => this.element },
}));
```

**DrawerTrigger:**
```ts
overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.content(),
  shell: DRAWER_SHELL_TOKEN,
  focus: { restoreTo: () => this.element },
}));
```

**PopoverTrigger:**
```ts
overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.content(),
  position: {
    connectedTo: this.element,
    placement: this.placement(),
    offset: this.offset(),
  },
  focus: { restoreTo: () => this.element },
}));
```

Удалить импорты `createConnectedOverlay`, `createGlobalOverlay`. Добавить
`createOverlay`.

### 5.2 `submenu-trigger.ts` — SubmenuTrigger

`setup.afterOpened` с dispatch клавиши требует доступ к closure, но не к session —
можно перенести в `lifecycle.afterOpened`:

```ts
overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.content(),
  position: {
    connectedTo: this.element,
    placement: 'right-start',
    offset: 1,
  },
  focus: { restoreTo: () => this.element },
  lifecycle: {
    afterOpened: [
      () => {
        if (!this.pendingKeyboardNavigation) return;
        this.pendingKeyboardNavigation = false;
        this.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: false }));
      },
    ],
  },
}));
```

### 5.3 `field-overlay.ts` — FieldOverlayDirective

```ts
private readonly overlayHandle = createOverlay(() => ({
  state: this.isOpen,
  content: this.overlayContent(),
  position: {
    connectedTo: this.host?.referenceElement() ?? this.interactive.element(),
    matchWidth: this.matchWidth(),
  },
  focus: {
    restoreTo: () => this.host?.focusReturnTarget() ?? this.interactive.focusReturnTarget(),
  },
}));
```

### 5.4 `combobox.ts` — Combobox

```ts
readonly overlay = createOverlay(() => ({
  state: this.expanded,
  content: this.comboboxTemplateRef(),
  position: {
    connectedTo: this.fieldShellHost().referenceElement(),
    matchWidth: true,
  },
  focus: {
    restoreTo: () => this.fieldShellHost().focusReturnTarget(),
  },
  lifecycle: {
    beforeClose: [
      (_, __, reason) => {
        if (reason !== 'state') this.resetQueryToValue();
      },
    ],
  },
}));
```

### 5.5 `tooltip-service.ts` — TooltipService

Critical dynamic-positioning consumer. Reference swap должен продолжать работать:

```ts
readonly overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.tooltipRef()?.content ?? null,
  position: {
    connectedTo: this.tooltipRef()?.referenceElement ?? null,
    placement: this.tooltipRef()?.placement ?? 'top',
  },
  shell: TOOLTIP_SHELL_TOKEN,
  focus: { trap: false },
  close: {
    outsideClick: false,
    escape: false,
    focusLeave: false,
    scroll: true,
  },
  lifecycle: {
    afterClose: [
      () => {
        if (!this.isOpen()) this.tooltipRef.set(null);
      },
    ],
  },
}));
```

Замечание: текущий `isOpen` сигнал в `TooltipService` — `private readonly`.
Его нужно оставить как есть. `state: this.isOpen` просто передаёт ссылку.

### 5.6 `notifier.ts` — Notifier

Singleton-pattern выражается через локальные сигналы:

```ts
@Injectable({ providedIn: 'root' })
export class Notifier {
  private readonly DEFAULT_DURATION = 5;
  notifications = signal<NotificationConfig[]>([]);
  private readonly timers = new Map<symbol, ReturnType<typeof setTimeout>>();

  private readonly state = signal(false);
  private readonly template = signal<TemplateRef<unknown> | null>(null);

  readonly overlay = createOverlay(() => ({
    state: this.state,
    content: this.template(),
    shell: NOTIFICATION_SHELL_TOKEN,
    backdrop: false,
    blockScroll: false,
    focus: { trap: false },
    close: {
      outsideClick: false,
      escape: false,
      focusLeave: false,
      scroll: false,
    },
  }));

  // push / removeNotification используют this.state.set(...) и this.template.set(...)
}
```

**Важно:** в текущей реализации `Notifier` использует `createSingletonGlobalOverlay`
и вызывает `this.overlay.isOpen.set(true/false)`. После миграции нужно:
1. Заменить `this.overlay.isOpen` на `this.state`.
2. Если шаблон notification задаётся через `viewChild` где-то в компоненте-шелле,
   этот шаблон должен передаваться в `this.template.set(...)` при инициализации.
   Проверить как shell-компонент Notification сейчас получает template — если
   через `overlay.templateRef`, нужно адаптировать.

Уточнение при имплементации: прочитать текущий `NotificationShellComponent` и
понять, откуда он берёт template. Если `Notifier.overlay.templateRef` использовалось
как writable signal для виду, его надо заменить на новый `template` сигнал.

### 5.7 `confirmation-service.ts` — ConfirmationService

Аналогично Notifier, но с `restoreTo` и `afterClose` для cleanup:

```ts
@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  config = signal<ConfirmationConfig | null>(null);

  private readonly state = signal(false);
  private readonly template = signal<TemplateRef<unknown> | null>(null);

  readonly overlay = createOverlay(() => ({
    state: this.state,
    content: this.template(),
    focus: {
      restoreTo: () => this.config()?.referenceElement ?? null,
    },
    lifecycle: {
      afterClose: [
        () => {
          if (!this.state()) this.config.set(null);
        },
      ],
    },
  }));

  open(config: ConfirmationConfig) {
    this.config.set(config);
    this.state.set(true);
  }

  close() {
    this.state.set(false);
  }
  // confirm / cancel остаются
}
```

Тот же caveat про shell и template — проверить как `ConfirmationShellComponent`
сейчас получает template.

---

## Шаг 6. Переписывание тестов

### `overlay-strategy.spec.ts` → `public-overlay.spec.ts`

Удалить все тесты старых фабрик `globalPosition`, `connectedPosition`,
`coordinatePosition` и старой сигнатуры `createOverlay(isOpen, behavior, position, content)`.

Добавить тесты:

1. **Factory returns null signal initially:**
   ```ts
   const state = signal(false);
   const overlay = TestBed.runInInjectionContext(() =>
     createOverlay(() => ({ state, content: null })),
   );
   expect(overlay()).toBeNull();
   ```

2. **Family detection — global (no position):**
   ```ts
   createOverlay(() => ({ state, content: tpl }));
   // → family === 'global', shell === MODAL_SHELL_TOKEN
   ```

3. **Family detection — connected:**
   ```ts
   createOverlay(() => ({
     state, content: tpl,
     position: { connectedTo: el },
   }));
   // → family === 'connected', shell === CONNECTED_SHELL_TOKEN
   ```

4. **Family detection — coordinate:**
   ```ts
   createOverlay(() => ({
     state, content: tpl,
     position: { x: 10, y: 20 },
   }));
   // → family === 'coordinate', shell === CONNECTED_SHELL_TOKEN
   ```

5. **Explicit shell override:**
  - `shell: DRAWER_SHELL_TOKEN` → `behavior.shell === DRAWER_SHELL_TOKEN`.

6. **Dynamic content — смена TemplateRef без close:**
  - Открыть overlay с `content: tpl1()`, изменить signal на `tpl2()`,
    проверить что `overlay().content()` возвращает новый template и overlay
    не закрывался (`overlay()` не стал `null`).

7. **Dynamic position values:**
  - Открыть connected с `connectedTo: el1()`, сменить на `el2()`,
    проверить `(overlay().position() as ConnectedPosition).referenceElement === el2`.

8. **Position family guard (dev mode):**
  - Открыть global overlay, попытаться изменить factory так, чтобы вернуть
    connected — проверить что effect бросает ошибку.
  - (Осторожно: чтобы это сработало, нужно держать factory замыкание на
    signal, который переключает family. Тест сложный — можно отложить как
    integration test.)

9. **canClose blocks closing:**
   ```ts
   createOverlay(() => ({
     state, content: tpl,
     lifecycle: { canClose: [() => false] },
   }));
   ```
  - Вызвать `handle.close()`, проверить что `state()` всё ещё `true`.

10. **beforeClose runs before state flip:**
  - При `handle.close()` — проверить порядок: `beforeClose` handler видит
    `state() === true`, после handler-а `state()` становится `false`.

11. **afterClose fires after shell destroy:**
  - Требует рендера shell-а — возможно нужен component test вместо unit test.
  - Можно пометить как integration/browser test и отложить.

12. **Tooltip reference swap (integration):**
  - `open(elA)` → `open(elB)` через обновление signal-а → overlay не
    закрывается, `referenceElement` обновляется.

Минимум для unit-теста: пункты 1-7 + 9-10. Остальное — в browser/component tests
или E2E.

---

## Шаг 7. Верификация

### Сборка

```bash
pnpm nx run cdk:build
pnpm nx run components:build
pnpm nx run app:build
```

Build dependency chain: CDK → Components → App (из `angular.json` `dependsOn`).
Если CDK build чистый, но components ломается — смотреть на consumer files.

### Type check

```bash
pnpm tsc --noEmit -p projects/fibo-ui/cdk/tsconfig.lib.json
pnpm tsc --noEmit -p projects/fibo-ui/components/tsconfig.lib.json
```

### Тесты

```bash
pnpm nx test cdk
pnpm nx test components
```

Ожидаем зелёный `public-overlay.spec.ts`. Старый `overlay-strategy.spec.ts`
должен быть удалён или переименован.

### Manual verification (dev server)

```bash
pnpm nx serve app
```

Пройти по страницам демо:

1. **Dialog page** — открыть диалог, закрыть через: backdrop click, escape,
   кнопку close. Проверить focus restoration на триггер.
2. **Drawer page** — аналогично, убедиться что используется `DRAWER_SHELL_TOKEN`
   (другой shell визуально).
3. **Popover page** — открыть, закрыть через outside click, escape.
4. **Select / MultiSelect / DatePicker** — все используют `FieldOverlayDirective`,
   должны работать как раньше.
5. **Combobox** — открыть, набрать query, выбрать опцию через клик и через
   Enter, проверить что query сбрасывается к value при закрытии (это
   `lifecycle.beforeClose`).
6. **Context menu** — правый клик, проверить координатное позиционирование.
7. **Tooltip** (критично) — наводить на разные триггеры подряд, не закрывая
   между ними — tooltip должен перелетать между элементами **без close/reopen**
   (это проверка dynamic positioning).
8. **Notifications** — вызвать несколько notifier.success/error, проверить
   что они появляются стеком.
9. **Confirmation dialog** — открыть confirm, проверить focus restore и
   cleanup.
10. **Submenu** — открыть меню с подменю, перейти в подменю стрелкой вправо
    или Enter — должен сработать `lifecycle.afterOpened` → dispatch ArrowDown.

### Regression checks

- Type checking проходит без ошибок.
- Ни один consumer не импортирует удалённые `createConnectedOverlay`,
  `createGlobalOverlay`, `createCoordinateOverlay`, `createSingletonConnectedOverlay`,
  `createSingletonGlobalOverlay`, `createSingletonOverlay`, `connectedPosition`,
  `globalPosition`, `coordinatePosition`.
- `grep -r "overlay-recipes\|overlay-singleton" projects/` возвращает пусто.
- Dev-mode проверка position family guard можно проверить точечно: вручную
  в одном компоненте сделать factory, который меняет family — убедиться что
  Angular бросает explicit error.

### Memory hygiene

Обновить memory после завершения:
- Пометить `project_overlay_3way_split.md` и `project_overlay_simplified_api.md`
  как устаревшие (они описывают промежуточные состояния).
- Новая memory: «Overlay API unified: single `createOverlay(() => config)`,
  recipes and singleton primitives removed, family detected from position».

---

## Порядок действий при исполнении

1. Шаг 1 — rename в runtime (маленький коммит).
2. Шаг 2 — создать `public-overlay.ts`.
3. Шаг 4 — обновить `public-api.ts` (нужно раньше миграции, чтобы новый
   `createOverlay` был доступен потребителям).
4. Шаг 5 — миграция потребителей (один коммит на файл или один общий).
5. Шаг 3 — удалить `overlay-recipes.ts` и `overlay-singleton.ts`.
6. Шаг 6 — переписать тесты.
7. Шаг 7 — верификация (сборка → type check → unit tests → dev server).

Шаги 3 и 5 связаны — удаление должно произойти после миграции, иначе build
упадёт. Шаг 4 можно разбить: сначала добавить новый export, потом (после
миграции всех consumer-ов) удалить старые.

---

## Risk recap и митигации

- **Dynamic positioning регрессия** — митигируется сохранением `OverlayPosition`
  и его per-field computeds без изменений. Новый API проходит position через тот
  же `Signal<OverlayPositionConfig>`, что и раньше. Manual verification step 7
  критически проверяет tooltip reference swap.
- **Hidden reactive deps в factory** — митигируется architectural-level
  per-field memoization в `OverlayPosition` + документированным контрактом
  «signals read only in state/content/position». Dev-mode assertion можно
  добавить позже как отдельный PR при необходимости.
- **Position family change mid-session** — митигируется dev-mode effect с
  explicit throw.
- **Singleton consumers теряют templateRef API** — митигируется локальными
  `signal<TemplateRef | null>` в каждом сервисе. Нужно проверить как
  `NotificationShellComponent` и `ConfirmationShellComponent` получают свой
  template — возможно через `OVERLAY_HANDLE.content()`, тогда изменений в
  shell-компонентах не требуется.
- **Тесты снова сломаны после delete** — митигируется переписыванием
  `overlay-strategy.spec.ts` как `public-overlay.spec.ts` в том же шаге.

---

## Открытые вопросы перед имплементацией

1. **NotificationShellComponent и ConfirmationShellComponent** — как они сейчас
   получают template для рендера? Если через `createSingletonOverlay.templateRef`,
   то после миграции нужно адаптировать. Если через `OVERLAY_HANDLE.content()` —
   всё работает без изменений. **Action:** прочитать оба shell-компонента при
   имплементации шага 5.6/5.7 и скорректировать консьюмеров.
2. **`provideOverlays()` bootstrap** — проверить, что registration shell-токенов
   в `app.config.ts` не опирается на удаляемые API. По факту `provideOverlays`
   работает на уровне DI tokens и не зависит от recipes — должен остаться как есть.
3. **Docs директория `public/documentation/cdk/overlays.md`** — публичная
   документация компонентной библиотеки. После рефактора её примеры устареют.
   **Action:** обновить примеры в том же PR, но это не блокирует код.
