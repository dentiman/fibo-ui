# Overlay API Improvements

## Цель

Упростить публичный overlay API до одной конфигурационной функции без явного `kind`,
без потери динамического поведения, которое уже работает в runtime:

- конфигурация читается как один unit;
- `content` и `position` остаются **live reactive** — смена reference element, placement,
  template, tooltipRef и т.д. продолжает работать без close/reopen;
- `state` остаётся `WritableSignal<boolean>`, чтобы `handle.close()` и guards вели к
  одному источнику истины;
- все остальные секции (shell, close triggers, focus, lifecycle, setup) снимаются
  **один раз при open cycle** и не вызывают неявной реактивной пере-регистрации
  listeners / lifecycle hooks.

Итоговое направление:

```ts
readonly overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.template(),

  position: {
    connectedTo: this.element(),
    placement: 'top',
    matchWidth: true,
  },

  focus: {
    restoreTo: () => this.element(),
  },

  close: {
    outsideClick: true,
    escape: true,
    focusLeave: true,
  },

  // Backdrop / scroll lock — это render-поведение, не close-тригеры.
  // Поэтому они живут на верхнем уровне рядом с shell, а не внутри close.
  backdrop: false,
  blockScroll: false,

  lifecycle: {
    beforeClose: [(_, __, reason) => { /* ... */ }],
  },

  setup: session => {
    // редкий escape hatch
  },
}));
```

## Текущее состояние системы

Overlay система уже разделена по слоям. Документ этой секции — опорный контракт
для normalization layer, не переписывается заново.

### Runtime (`overlay-stack.ts`)

`OverlayStack.createOverlay(isOpen, behavior, position, content, setup?)`:

- создаёт один `OverlayHandle` на один open cycle;
- хранит stack и branch relations (`overlayParentIds`);
- управляет lifecycle hooks через `OverlayCycle`;
- закрывает overlay через `isOpen.set(false)` — это архитектурная инварианта.

Следствия для публичного API:

- source of truth для open/close **обязан** передаваться как `WritableSignal<boolean>`;
- plain boolean snapshot для этого не подходит;
- `handle.close()` всегда проходит через `requestClose → guards → beforeClose → isOpen.set(false)`.

### View bridge (`overlay-stack-outlet.ts`)

`OverlayStackOutlet`:

- рендерит shell по `overlay.behavior.shell` через `NgComponentOutlet`;
- рисует backdrop, если `overlay.behavior.needsBackdrop === true`;
- централизованно обрабатывает outside click;
- навешивает document-level click listener только когда есть открытые overlays.

### Shell / container layer

`OverlayContainer` (host directive на shell-компоненте):

- читает `behavior` один раз в `ngOnInit()`;
- вешает listeners `closeOnFocusLeave`, `closeOnScroll`, `closeOnEscape`, `blockScroll`;
- listeners живут до destroy shell-компонента;
- **это главная причина, по которой `close.*`, `backdrop`, `blockScroll`, `shell` должны быть snapshot**.

`OverlayPosition`:

- подписан на reactive `overlay.position`;
- использует per-field computeds (`placement`, `referenceElement`, `matchWidth`, `offset`, `middleware`);
- `autoUpdate` из `@floating-ui/dom` перезапускается только при реальной смене значений — благодаря referential equality в computeds.

### Shell tokens

В CDK объявлены:

- `MODAL_SHELL_TOKEN` — default для global;
- `CONNECTED_SHELL_TOKEN` — default для connected и coordinate;
- `DRAWER_SHELL_TOKEN` — explicit override;
- `TOOLTIP_SHELL_TOKEN` — explicit override;
- `NOTIFICATION_SHELL_TOKEN` — explicit override.

## Кто реально потребляет overlay API

Прямые потребители:

- `DialogTrigger`, `DrawerTrigger`, `PopoverTrigger` — базовые directives в CDK;
- `FieldOverlayDirective` — используется в `Select`, `MultiSelect`, `DatePickerField`;
- `Combobox` — lifecycle hook `beforeClose`;
- `SubmenuTrigger` — lifecycle hook `afterOpened`;
- `TooltipService` — service-driven, реактивная смена reference element;
- `ConfirmationService` — service-driven, singleton-pattern;
- `Notifier` — service-driven, singleton-pattern.

Use cases сводятся к трём группам:

1. **Простые local-state overlays** (dialog, drawer, popover, field overlay) — нужно
   `state`, `content`, `position`, `focus.restoreTo`, иногда `matchWidth`.
2. **Local-state overlays с lifecycle hook** (Combobox `beforeClose`,
   Submenu `afterOpened`) — те же параметры плюс декларативная регистрация хука.
3. **Service-driven overlays** (tooltip, confirmation, notifications) — state и
   template живут в сервисе, поведение часто статично, но reference element /
   template могут реактивно меняться.

Все три группы удовлетворяются одним публичным `createOverlay(() => config)`.

## Итоговая форма публичного API

### Основной принцип

В публичном API **нет** `kind`. Тип overlay определяется по `position`:

- `position` отсутствует → `global`
- `position.connectedTo` существует → `connected`
- `position.x` и `position.y` существуют → `coordinate`

Сам выбор семейства **фиксируется на open cycle** и не может меняться в рамках
уже открытой session (см. «Position family guard»).

### Публичный shape

```ts
type PublicOverlayConfig =
  | PublicGlobalOverlayConfig
  | PublicConnectedOverlayConfig
  | PublicCoordinateOverlayConfig;

interface PublicOverlayBaseConfig {
  // ─── Core: live reactive ─────────────────────────────
  state: WritableSignal<boolean>;
  content: TemplateRef<unknown> | string | null;

  // ─── Shell / render policy (SNAPSHOT) ────────────────
  shell?: InjectionToken<Type<any>>;
  /** Render backdrop shell. Это render-policy, не close-тригер. */
  backdrop?: boolean;
  /** Блокировать scroll документа. Это render-policy, не close-тригер. */
  blockScroll?: boolean;

  // ─── Focus (SNAPSHOT; restoreTo — lazy callback) ─────
  focus?: {
    trap?: boolean | TrapOverlayFocusOptions;
    restoreTo?: () => HTMLElement | null;
  };

  // ─── Close triggers (SNAPSHOT) ───────────────────────
  close?: {
    outsideClick?: boolean;
    escape?: boolean;
    focusLeave?: boolean;
    scroll?: boolean;
  };

  // ─── Lifecycle hooks (SNAPSHOT) ──────────────────────
  lifecycle?: {
    afterOpened?: Array<(overlay: OverlayHandle) => void>;
    beforeClose?: Array<
      (ctx: OverlayCloseContext, overlay: OverlayHandle, reason: OverlayCloseReason) => void
    >;
    afterClose?: Array<(overlay: OverlayHandle, reason: OverlayCloseReason) => void>;
    canClose?: Array<(reason: OverlayCloseReason, event?: Event) => boolean | void>;
  };

  // ─── Escape hatch (SNAPSHOT) ─────────────────────────
  setup?: (session: OverlaySession) => void;
}

interface PublicGlobalOverlayConfig extends PublicOverlayBaseConfig {
  position?: undefined;
}

interface PublicConnectedOverlayConfig extends PublicOverlayBaseConfig {
  position: {
    connectedTo: HTMLElement | null;
    placement?: Placement;
    matchWidth?: boolean;
    offset?: number;
  };
}

interface PublicCoordinateOverlayConfig extends PublicOverlayBaseConfig {
  position: {
    x: number;
    y: number;
    placement?: Placement;
  };
}
```

### Изменение по сравнению с предыдущей версией документа

1. `close.backdrop` и `close.blockScroll` **удалены** из секции `close`.
   Это были семантически некорректно сгруппированные render-флаги.
2. `backdrop` и `blockScroll` теперь живут на верхнем уровне рядом с `shell`,
   потому что это свойства рендеринга и влияние на документ, а не close policy.
3. Явно задокументирован position family guard (dev-mode assertion).

## Reactive vs Snapshot: полный контракт

Это самая важная часть документа. Нарушение контракта приведёт к stale listeners
и рассинхронизации lifecycle hooks с реальным состоянием overlay.

| Поле                     | Тип            | Когда читается                         | Примечание |
|--------------------------|----------------|----------------------------------------|------------|
| `state`                  | reference      | reference снимается 1× на create       | `WritableSignal<boolean>`, ссылка должна быть стабильной |
| `content`                | **reactive**   | каждое изменение — live в runtime      | может быть `TemplateRef`, `string`, `null` |
| `position` (значения)    | **reactive**   | каждое изменение — live в runtime      | `connectedTo`, `placement`, `x`, `y`, `offset`, `matchWidth` — всё live |
| `position` (family)      | snapshot       | snapshot на open cycle                 | connected / global / coordinate — **нельзя менять в рамках session** |
| `shell`                  | snapshot       | snapshot на open cycle                 | используется `OverlayStackOutlet` для выбора shell-компонента |
| `backdrop`               | snapshot       | snapshot на open cycle                 | читается в `OverlayStackOutlet.needsBackdrop()` |
| `blockScroll`            | snapshot       | snapshot на open cycle                 | читается в `OverlayContainer.ngOnInit()` |
| `focus.trap`             | snapshot       | snapshot на open cycle                 | применяется один раз через `trapOverlayFocus(session, ...)` |
| `focus.restoreTo`        | **lazy**       | callback вызывается в `beforeClose`    | reference функции — snapshot, сам вызов — в момент close |
| `close.outsideClick`     | snapshot       | snapshot на open cycle                 | читается в `OverlayStackOutlet` dispatch |
| `close.escape`           | snapshot       | snapshot на open cycle                 | listener вешается в `OverlayContainer.ngOnInit()` |
| `close.focusLeave`       | snapshot       | snapshot на open cycle                 | listener вешается в `OverlayContainer.ngOnInit()` |
| `close.scroll`           | snapshot       | snapshot на open cycle                 | listener вешается в `OverlayContainer.ngOnInit()` |
| `lifecycle.afterOpened`  | snapshot       | snapshot на open cycle                 | handlers fire после `afterNextRender` |
| `lifecycle.beforeClose`  | snapshot       | snapshot на open cycle                 | handlers fire синхронно до `isOpen.set(false)` |
| `lifecycle.afterClose`   | snapshot       | snapshot на open cycle                 | handlers fire после destroy shell (через `completeAfterClose`) |
| `lifecycle.canClose`     | snapshot       | snapshot на open cycle                 | первый guard, вернувший `false`, блокирует close |
| `setup`                  | snapshot       | вызывается 1× в `untracked(() => ...)` | escape hatch для сложных сценариев |

### Что значит «snapshot на open cycle»

На каждый новый open cycle normalization layer берёт **свежий** snapshot этих
полей. Если вы хотите другое поведение при следующем открытии — закройте
overlay, измените данные (например, установите другой `shell` token через
локальный `signal`), и откройте заново. Внутри одного open cycle эти поля
считаются **неизменными** по контракту.

### Что значит «live reactive во время session»

`content` и `position` (значения, не семейство) пересчитываются runtime-ом
через `computed`. Любое реактивное изменение — смена reference element,
template, placement, offset, координат — применяется без close/reopen.

Это уже работает в runtime: `OverlayHandle.position` и `OverlayHandle.content`
хранятся как `Signal<...>`, а `OverlayPosition` использует per-field computeds
с referential equality, что гарантирует корректный diff и перезапуск
`autoUpdate` только когда нужно.

### Что значит «lazy callback в момент close» для `focus.restoreTo`

`focus.restoreTo` в config — это **функция**, а не reference element. Сама
функция захватывается (snapshot) на open cycle, но вызывается только в
`beforeClose` handler-е через существующий `restoreTriggerFocusOnClose`. Это
позволяет читать актуальный target даже если reference element за время session
изменился или был заменён.

## Как определяется default shell token

Родной shell выводится из normalized `position family`:

- `global` → `MODAL_SHELL_TOKEN`
- `connected` → `CONNECTED_SHELL_TOKEN`
- `coordinate` → `CONNECTED_SHELL_TOKEN`

Если в config передан `shell`, он всегда имеет приоритет над default token.

Специальные shells (`DRAWER_SHELL_TOKEN`, `TOOLTIP_SHELL_TOKEN`,
`NOTIFICATION_SHELL_TOKEN`) не выводятся автоматически и должны передаваться
как explicit override.

## Position family guard (dev-mode assertion)

В dev-mode normalization layer вешает effect, который проверяет, что
`position.type` не меняется между вызовами:

```ts
const initialFamily = detectFamily(untracked(() => factory()).position);

effect(() => {
  if (!ngDevMode) return;
  const current = positionSignal();
  if (current.type !== initialFamily) {
    throw new Error(
      `Overlay position family cannot change within a session: ` +
      `${initialFamily} → ${current.type}. ` +
      `Close the overlay and open a new one with the new family.`,
    );
  }
});
```

Это не чисто runtime защита — это явный контракт для разработчика. Причина:

- shell выбирается на open cycle по семейству position;
- host directives на shell-компоненте навешивают listeners в `ngOnInit()`;
- смена семейства потребовала бы пересобирать всё shell-дерево и переподписывать
  все listeners посреди session, что нарушило бы закрытые lifecycle инварианты.

**Значения внутри одного семейства менять можно и нужно** — это основной
механизм dynamic positioning (см. примеры Tooltip и Combobox).

## Полные примеры использования

### Connected overlay (Combobox, Popover, FieldOverlay)

```ts
readonly overlay = createOverlay(() => ({
  state: this.expanded,
  content: this.comboboxTemplateRef(),

  position: {
    connectedTo: this.fieldShellHost().referenceElement(),
    placement: 'bottom-start',
    matchWidth: true,
    offset: 4,
  },

  focus: {
    trap: false,
    restoreTo: () => this.fieldShellHost().focusReturnTarget(),
  },

  close: {
    outsideClick: true,
    escape: true,
    focusLeave: true,
    scroll: false,
  },

  lifecycle: {
    beforeClose: [
      (_, __, reason) => {
        if (reason !== 'state') {
          this.resetQueryToValue();
        }
      },
    ],
  },
}));
```

### Global / modal overlay (Dialog)

```ts
readonly overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.dialogTpl(),

  // backdrop и blockScroll теперь на верхнем уровне
  backdrop: true,
  blockScroll: true,

  focus: {
    trap: { guard: true },
    restoreTo: () => this.triggerButton().nativeElement,
  },

  close: {
    outsideClick: true,
    escape: true,
  },
}));
```

### Drawer (global с explicit shell)

```ts
readonly overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.drawerTpl(),

  shell: DRAWER_SHELL_TOKEN,
  backdrop: true,
  blockScroll: true,

  focus: {
    trap: { guard: true },
    restoreTo: () => this.triggerButton().nativeElement,
  },

  close: {
    outsideClick: true,
    escape: true,
  },
}));
```

### Coordinate overlay (Context Menu)

```ts
readonly overlay = createOverlay(() => ({
  state: this.isOpen,
  content: this.contextMenuTpl(),

  position: {
    x: this.point().x,
    y: this.point().y,
    placement: 'right-start',
  },

  focus: {
    trap: { guard: true },
  },

  close: {
    outsideClick: true,
    escape: true,
    focusLeave: false,
  },
}));
```

### Service-driven: Tooltip с reactive reference swap

Это главный dynamic-position сценарий. Reference element приходит в сервис
из разных потребителей и должен обновляться без close/reopen:

```ts
@Injectable({ providedIn: 'root' })
export class TooltipService {
  private readonly isOpen = signal(false);
  readonly tooltipRef = signal<{
    content: string | TemplateRef<unknown>;
    referenceElement: HTMLElement;
    placement: Placement;
  } | null>(null);

  readonly overlay = createOverlay(() => ({
    state: this.isOpen,
    content: this.tooltipRef()?.content ?? null,

    position: {
      connectedTo: this.tooltipRef()?.referenceElement ?? null,
      placement: this.tooltipRef()?.placement ?? 'top',
    },

    shell: TOOLTIP_SHELL_TOKEN,
    backdrop: false,
    blockScroll: false,

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
}
```

**Как это работает**: `tooltipRef` — source of truth. Когда сервис подменяет
reference на новый, `content` и `position` computeds пересчитываются, `OverlayPosition`
видит новое значение `referenceElement()` через свой per-field computed, эффект
автоматически переустанавливает `autoUpdate` на новый элемент. Close/reopen не происходит.
Это **подтверждено** текущей реализацией `OverlayPosition` и работает уже сейчас
в 4-параметрическом runtime.

### Service-driven: Notification singleton

```ts
@Injectable({ providedIn: 'root' })
export class Notifier {
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

  // ...push/remove logic
}
```

Обратите внимание: отдельного `createSingletonOverlay` больше не нужно.
Сервис сам держит `state` и `template` как локальные сигналы и
конфигурирует через единый `createOverlay`.

## Что реально означает каждая секция

### `state`

`WritableSignal<boolean>`. **Обязательное**. Reference стабильный на весь
lifetime директивы/сервиса.

Runtime закрывает overlay через `state.set(false)`, поэтому:

- `handle.close()` всегда идёт через этот канал;
- guards и close policies ведут к одному источнику истины;
- повторное открытие = `state.set(true)` — это создаёт **новый** open cycle
  с новым snapshot всех snapshot-полей.

### `content`

`TemplateRef | string | null`. **Live reactive**. Может меняться динамически
во время открытой session. `null` означает «ещё не готов, не открывать».
Runtime уже проверяет: если `content() === null`, effect не откроет overlay
(`overlay-stack.ts` — effect в `createOverlay`).

### `position`

Выполняет две роли:

1. **Определяет семейство overlay** — один раз на open cycle. Не должно
   меняться (см. «Position family guard»).
2. **Даёт live reactive positioning data** — значения внутри одного семейства
   могут меняться свободно: `connectedTo`, `placement`, `matchWidth`, `offset`,
   `x`, `y`.

### `shell`, `backdrop`, `blockScroll`

Render-policy, snapshot на open cycle.

- `shell` — outlet компонент, выбирается `OverlayStackOutlet` через DI.
- `backdrop` — рендерить ли backdrop shell поверх overlay (читается в
  `OverlayStackOutlet.needsBackdrop()`).
- `blockScroll` — блокировать ли scroll документа (читается в
  `OverlayContainer.ngOnInit()` и вешает `blockScroll(destroyRef)`).

### `focus`

Declarative grouping поверх существующих focus behaviors.

Mapping в composite setup:

- `focus.trap` → `trapOverlayFocus(session, typeof trap === 'object' ? trap : undefined)`
- `focus.restoreTo` → `restoreTriggerFocusOnClose(session, focus.restoreTo)`

`focus.trap` — snapshot на open cycle. Нельзя включать/выключать trap в
середине session.

`focus.restoreTo` — функция. Reference захватывается snapshot, сам вызов —
lazy в момент close. Это позволяет читать актуальный target, даже если он
появился или изменился после открытия.

### `close`

Declarative grouping close-тригеров. **Только** внешние события, которые
могут вызвать close.

Mapping в `OverlayBehaviorConfig`:

- `close.outsideClick` → `closeOnOutsideClick`
- `close.escape` → `closeOnEscape`
- `close.focusLeave` → `closeOnFocusLeave`
- `close.scroll` → `closeOnScroll`

Все — snapshot на open cycle.

### `lifecycle`

Декларативная регистрация lifecycle hooks:

- `afterOpened` — после `afterNextRender`, получает `OverlayHandle`;
- `beforeClose` — синхронно до `isOpen.set(false)`, получает `ctx, handle, reason`;
- `afterClose` — после destroy shell-компонента, получает `handle, reason`;
- `canClose` — guard, возвращающий `false` блокирует close.

Внутри сводится к вызовам `session.afterOpened/beforeClose/afterClose/canClose`.

Важно: `lifecycle.afterOpened` принимает только `OverlayHandle`, без `session`.
Если в хуке нужен доступ к `session.effect` / `session.requestClose` / `session.isInOverlayBranch` —
используйте `setup(session)` вместо `lifecycle.afterOpened`.

### `setup`

Escape hatch для редких случаев:

- keyboard handoff после открытия;
- сервисный cleanup на close через `session.onCleanup`;
- нестандартная DOM integration;
- custom guards с доступом к `session.effect`.

Вызывается 1× в `untracked(() => setup(session))` на open cycle. Это
обязательно, чтобы setup не создал неявных реактивных зависимостей.

## Как это работает внутри runtime

Low-level runtime **не меняется**. Меняется только public surface — добавляется
тонкий normalization layer поверх существующего `createOverlay(isOpen, behavior, position, content, setup)`.

### План нормализации (реализация)

```ts
// projects/fibo-ui/cdk/src/lib/overlay/public-overlay.ts
export function createOverlay<T extends PublicOverlayConfig>(
  factory: () => T,
): Signal<OverlayHandle | null> {
  // 1. Snapshot-секции читаются через untracked — никаких подписок.
  const initial = untracked(() => factory());

  // 2. state — стабильная ссылка, snapshot на create time.
  const state = initial.state;

  // 3. Detect family по initial.position.
  const initialFamily = detectFamily(initial.position);

  // 4. Собираем OverlayBehaviorConfig — это snapshot.
  const behavior: OverlayBehaviorConfig = {
    shell: initial.shell ?? defaultShellFor(initialFamily),
    needsBackdrop: initial.backdrop ?? defaultBackdropFor(initialFamily),
    blockScroll: initial.blockScroll ?? defaultBlockScrollFor(initialFamily),
    closeOnEscape: initial.close?.escape ?? true,
    closeOnOutsideClick: initial.close?.outsideClick ?? true,
    closeOnFocusLeave: initial.close?.focusLeave ?? defaultFocusLeaveFor(initialFamily),
    closeOnScroll: initial.close?.scroll ?? false,
  };

  // 5. Composite setup — собирает focus + lifecycle + user setup в одну функцию.
  const composedSetup = (session: OverlaySession) => {
    // focus.trap
    if (initial.focus?.trap || defaultTrapFor(initialFamily)) {
      const trapOptions = typeof initial.focus?.trap === 'object'
        ? initial.focus.trap
        : defaultTrapOptionsFor(initialFamily);
      trapOverlayFocus(session, trapOptions);
    }
    // focus.restoreTo (lazy callback внутри beforeClose)
    if (initial.focus?.restoreTo) {
      restoreTriggerFocusOnClose(session, initial.focus.restoreTo);
    }
    // lifecycle hooks
    initial.lifecycle?.afterOpened?.forEach(h => session.afterOpened(h));
    initial.lifecycle?.beforeClose?.forEach(h => session.beforeClose(h));
    initial.lifecycle?.afterClose?.forEach(h => session.afterClose(h));
    initial.lifecycle?.canClose?.forEach(g => session.canClose(g));
    // user escape hatch
    initial.setup?.(session);
  };

  // 6. Reactive content / position через computed.
  const contentSignal = computed(() => factory().content);
  const positionSignal = computed(() => normalizePosition(factory().position));

  // 7. Dev-mode family guard.
  if (ngDevMode) {
    effect(() => {
      const p = positionSignal();
      if (p.type !== initialFamily) {
        throw new Error(
          `Overlay position family cannot change within a session: ` +
          `${initialFamily} → ${p.type}`,
        );
      }
    });
  }

  // 8. Делегируем существующему runtime.
  return createOverlayInternal(state, behavior, positionSignal, contentSignal, composedSetup);
}
```

### Внутренний rename

Текущий экспорт `createOverlay(isOpen, behavior, position, content, setup?)` из
`overlay-stack.ts` переименовывается в `createOverlayInternal(...)`. Он остаётся
CDK-internal и используется только нормализационным слоем и тестами runtime.

### Почему `behavior` остаётся snapshot

Потому что:

- `OverlayContainer` читает `behavior` в `ngOnInit()` один раз;
- listeners вешаются один раз на lifetime shell-компонента;
- `OverlayStackOutlet` читает `behavior.shell` и `behavior.needsBackdrop` для
  рендера shell/backdrop;
- если делать `behavior` fully reactive — пришлось бы переподписывать все listeners
  и пересобирать shell-дерево посреди session. Это отдельный крупный рефактор,
  который не нужен для текущей задачи.

## Как продолжает работать `handle.close()`

Цепочка не меняется:

1. `OverlayHandle.close(reason?)` → `requestClose(reason ?? 'programmatic')`;
2. `requestClose` проходит `canClose` guards;
3. Если ни один guard не вернул `false` → `runBeforeClose` → `isOpen.set(false)`;
4. Effect в runtime видит `isOpen === false` → `teardown(reason)`;
5. Shell-компонент destroyed → `OverlayContainer.destroyRef.onDestroy` →
   `overlayStack.completeAfterClose(id)` → `afterClose` handlers fire.

Это работает одинаково для всех путей закрытия: programmatic, guard-approved
outside-click, escape, focus-leave, scroll, destroy.

## Как устраняются риски

Я явно проговариваю каждый из выявленных рисков и его митигацию, чтобы
при реализации ничего не поехало.

### Риск 1 — Hidden reactive deps в factory

**Проблема**: если пользователь читает сигнал внутри snapshot-секции
(например `close: { outsideClick: this.someSignal() }`), то:

- runtime снял snapshot один раз → значение застыло;
- но `content`/`position` computeds вызывают `factory()` реактивно, и при
  изменении `someSignal` computed пересчитывается → factory возвращает новый
  объект → даже если position/content внутри не изменились, внешне это выглядит
  как re-run.

**Митигации** (многоуровневая защита):

1. **Runtime-уровень — per-field computeds в `OverlayPosition`.**
   `OverlayPosition` не подписан на `position` напрямую — он использует
   per-field computeds (`placement`, `referenceElement`, `matchWidth`, `offset`,
   `middleware`), каждый из которых имеет referential equality check. Даже если
   position-объект создаётся новый, отдельные значения не меняются → downstream
   effects не триггерятся → `autoUpdate` не перезапускается. **Эта защита
   уже есть в текущем коде и является архитектурной.**

2. **Документация — явный контракт «signals read только в state/content/position».**
   В секции «Reactive vs Snapshot» зафиксировано: читайте сигналы **только** в
   `state`, `content`, `position`. Остальные секции — статические значения.
   Это не техническая защита, а соглашение, но оно прямолинейно и его легко
   соблюдать.

3. **Dev-mode assertion на snapshot consistency.** Normalization layer может
   (в `ngDevMode`) вызвать factory второй раз в `untracked`, и сравнить snapshot
   секции (`close`, `focus.trap`, `backdrop`, `blockScroll`, `shell`) с
   изначальным snapshot. Если отличается — бросить explicit error с подсказкой.

   ```ts
   if (ngDevMode) {
     effect(() => {
       void positionSignal(); // подписка на реактивные изменения
       const next = untracked(() => factory());
       assertSnapshotUnchanged(initial, next);
     });
   }
   ```

**Итог**: даже без dev-assertion runtime устойчив благодаря per-field computeds.
Dev-assertion — дополнительный safety net для разработчиков.

### Риск 2 — Tooltip reference swap (dynamic positioning)

**Проблема**: `TooltipService` меняет `referenceElement` без close/reopen —
это критический сценарий, должен продолжать работать.

**Митигация**: работает **напрямую**, потому что:

1. `position` computed вызывает `factory()` → читает `this.tooltipRef()` →
   подписывается на сигнал.
2. При смене `tooltipRef` → position computed возвращает новый объект с новым
   `referenceElement`.
3. `OverlayPosition.referenceElement` computed читает новое значение → effect
   re-runs → старый `autoUpdate` cleanup → новый `autoUpdate` привязывается
   к новому элементу.
4. Shell и все listeners остаются теми же — они привязаны к shell-компоненту,
   который не пересоздаётся.

**Тест-кейс** для подтверждения: `TooltipService.open(content, elementA, placement)`
→ `TooltipService.open(content, elementB, placement)` без вызова `close()`.
Overlay должен переместиться к elementB, не закрываясь.

### Риск 3 — Backward compatibility

**Проблема**: `@fibo-ui/cdk` публикуется в npm. Удаление
`createConnectedOverlay`/`createGlobalOverlay`/`createCoordinateOverlay` и
singleton-вариантов — breaking change для внешних потребителей.

**Митигация**:

1. Новый `createOverlay(factory)` живёт в новом файле `public-overlay.ts`.
2. Старые recipe-функции остаются в `overlay-recipes.ts` как **thin wrappers
   поверх нового `createOverlay`**, помеченные `@deprecated`. Одна major-версия
   deprecation-периода.
3. После миграции всех внутренних потребителей (9 файлов) на новый API
   wrapper-ы можно снести в следующем major-релизе.

Внутренние потребители (`DialogTrigger`, `Combobox`, `TooltipService` и т.д.)
сразу мигрируют на новый API — это часть PR-а.

### Риск 4 — Семантически неправильное группирование `backdrop`/`blockScroll` в `close`

**Проблема** (из первой версии документа): `backdrop` и `blockScroll` были
отнесены к `close` секции. Это неверно — это render/behavior-свойства, а не
close-тригеры.

**Митигация — в этой версии документа исправлено**:

- `backdrop` и `blockScroll` вынесены на верхний уровень рядом с `shell`;
- секция `close` теперь содержит **только** close-тригеры:
  `outsideClick`, `escape`, `focusLeave`, `scroll`;
- таблица Reactive/Snapshot явно показывает, откуда эти поля читаются в runtime
  (`backdrop` — в `OverlayStackOutlet`, `blockScroll` — в `OverlayContainer.ngOnInit`).

### Риск 5 — `canClose` timing

**Проблема**: неясно, когда именно выполняются guards.

**Подтверждение**: работает уже сейчас. Runtime вызывает guards в `requestClose`:

```ts
for (const guard of cycle.guards) {
  if (guard(reason, event) === false) return;
}
```

Первый guard, вернувший `false`, блокирует close. Вернувший `true` или `void` —
пропускает. Это семантика `session.canClose(guard)`, и она сохраняется в новом
API через `lifecycle.canClose: Array<...>`.

### Риск 6 — Position family guard отсутствует в runtime

**Проблема**: сейчас family фиксируется вы́бором recipe-функции
(`createConnectedOverlay` vs `createGlobalOverlay`). В новом API family
определяется из data, и ничто не мешает пользователю случайно изменить
семейство в середине session.

**Митигация**: normalization layer вешает dev-mode effect, который бросает
error при смене `position.type` между initial snapshot и любым последующим
значением (см. раздел «Position family guard»).

В production dev-check отключается, но корректно написанный код не должен
нарушать этот контракт. Если нужна смена family — закрыть overlay, пересоздать
с другими данными.

## Какие параметры динамические в рамках одной open session (итоговая сводка)

### Live reactive

- `content` (включая смену `TemplateRef` или переход на `string`);
- значения `position` внутри одного семейства:
  - connected: `connectedTo`, `placement`, `matchWidth`, `offset`;
  - coordinate: `x`, `y`, `placement`;
  - global: (нет значений — только сам факт семейства).

### Управляет существованием session

- `state` — открывает/закрывает session через `.set()`.

### Lazy callback в момент close

- `focus.restoreTo` — захватывается как функция, вызывается в `beforeClose`.

### Snapshot на open cycle

- `shell`;
- `backdrop`, `blockScroll`;
- `close.*` (`outsideClick`, `escape`, `focusLeave`, `scroll`);
- `focus.trap`;
- `lifecycle.*` (`afterOpened`, `beforeClose`, `afterClose`, `canClose`);
- `setup`;
- семейство `position` (`global` / `connected` / `coordinate`).

## План миграции

1. Создать `public-overlay.ts` с новым `createOverlay(factory)` и типами
   `PublicOverlayConfig`.
2. Переименовать текущий `createOverlay` из `overlay-stack.ts` в
   `createOverlayInternal`. Обновить импорты только в `overlay-recipes.ts` и
   `overlay-singleton.ts`.
3. Написать helper-ы normalization: `detectFamily`, `defaultShellFor`,
   `defaultBackdropFor`, `defaultBlockScrollFor`, `defaultFocusLeaveFor`,
   `defaultTrapFor`, `normalizePosition`, `assertSnapshotUnchanged` (dev-only).
4. Переписать внутренних потребителей (в одном PR):
   - `overlay-triggers.ts` — `DialogTrigger`, `DrawerTrigger`, `PopoverTrigger`;
   - `field-overlay.ts` — `FieldOverlayDirective`;
   - `combobox.ts` — `beforeClose` через `lifecycle.beforeClose`;
   - `submenu-trigger.ts` — `afterOpened` через `setup(session)` (нужен
     доступ к keyboard dispatch — остаётся escape hatch);
   - `tooltip-service.ts`;
   - `notifier.ts`;
   - `confirmation-service.ts`.
5. `overlay-recipes.ts` — переписать на thin wrappers поверх нового `createOverlay`,
   пометить `@deprecated`.
6. `overlay-singleton.ts` — пометить `@deprecated`, в документации показать,
   как singleton-pattern выражается через `createOverlay + signal`.
7. Добавить тесты:
   - dynamic positioning: смена `connectedTo` без close/reopen;
   - dynamic content: смена `TemplateRef` без close/reopen;
   - position family guard (dev-mode assertion);
   - snapshot consistency: `close.outsideClick` не меняется при изменении
     стороннего сигнала;
   - tooltip reference swap: `elementA → elementB` без закрытия.

## Итог

Утверждённое направление:

- один публичный `createOverlay(() => config)` без `kind`;
- тип overlay определяется по `position` (семейство фиксируется на open cycle);
- default shell token определяется по семейству, explicit shells — через `shell`;
- `backdrop` и `blockScroll` — на верхнем уровне, **не** внутри `close`;
- `state` обязателен как `WritableSignal<boolean>`;
- `content` и значения `position` — live reactive;
- `shell`, `backdrop`, `blockScroll`, `close.*`, `focus.trap`, `lifecycle.*`, `setup` —
  snapshot на open cycle;
- `focus.restoreTo` — lazy callback в момент close;
- position family guard через dev-mode effect;
- runtime остаётся без изменений — новый API реализуется через normalization layer;
- dynamic positioning (смена reference element у Tooltip и т.д.) продолжает
  работать благодаря per-field computeds в `OverlayPosition`;
- backward compat обеспечивается thin wrapper-ами поверх нового API с
  `@deprecated`-маркером на одну major-версию.

Это упрощает API без нарушения существующих архитектурных инвариант overlay runtime
и без регрессии существующего dynamic behavior.
