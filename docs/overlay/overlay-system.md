# Overlay System — Complete Guide

Современная система оверлеев fibo-ui CDK, построенная на Angular 21 сигналах с реактивными поведениями и полной поддержкой доступности.

---

## Архитектура системы

### Ключевые компоненты

#### `createOverlay(isOpen, config, setup?)`

Основной API для создания оверлея из компонента.

```typescript
const overlayHandle = createOverlay(
  this.isOpen,  // Signal<boolean> — источник истины
  computed(() => ({
    templateRef: this.contentTpl(),
    referenceElement: this.triggerEl.nativeElement,
    category: 'dialog' as const,  // 'popover' | 'menu' | 'dialog' | 'tooltip' | 'confirmation' | 'notification'
  })),
  overlay => {
    // Коллбэк для регистрации поведений
    closeOnFocusLeave(overlay);
    closeOnOutsideClick(overlay);
    restoreTriggerFocusOnClose(overlay);
    blockScroll(overlay);
  }
);
```

**Контракт:**
- `isOpen` — единственный источник истины для состояния открытости
- `config` вычисляется и может менять контент во время открытия
- `setup(...)` регистрирует поведения для текущего цикла открытия

#### `OverlayStack`

Глобальный координатор всех оверлеев. Управляет:

- Созданием и удалением оверлеев
- Z-index и категоризацией
- Вложенными ветками оверлеев
- Централизованной обработкой Escape (вызывает `closeTopmost('escape')`)
- Гарантирует готовность шаблона перед открытием

#### `OverlayContainerComponent`

Постоянная поверхность рендеринга. Предоставляет:

- `OVERLAY_HANDLE` инъекционный токен для содержимого оверлея
- Завершение `afterClose(...)` после анимации выхода
- Управление глобальными стилями документа (через composable behaviors)

#### `OverlayHandle`

Рантайм-объект для одного открытого оверлея.

```typescript
export interface OverlayHandle {
  readonly id: string;                                  // Уникальный идентификатор
  readonly category: OverlayCategory;                   // Тип оверлея
  readonly zIndex: number;                              // Вычисленный z-index
  readonly firstInCategory: Signal<boolean>;            // Первый в категории?
  readonly templateRef: TemplateRef<any> | undefined;  // Текущий контент
  readonly referenceElement: HTMLElement | null;       // Элемент-триггер
  readonly closed: boolean;                             // Закрыт?
  close(reason?: OverlayCloseReason): void;            // Запрос на закрытие
}
```

#### `OverlaySession`

Временный API жизненного цикла, передаётся в `setup(...)`. Существует только для текущего цикла открытия.

```typescript
interface OverlaySession {
  readonly handle: OverlayHandle;
  readonly isOpen: Signal<boolean>;

  requestClose(reason: OverlayCloseReason, event?: Event): void;
  beforeClose(callback: (ctx: OverlayCloseContext, handle: OverlayHandle) => void): void;
  afterOpened(callback: () => void): void;
  afterClose(callback: () => void): void;

  effect<T>(fn: (onCleanup: (fn: () => void) => void) => T): EffectRef;
  onCleanup(callback: () => void): void;

  isInOverlayBranch(target: EventTarget | null | undefined): boolean;
  canClose(guard: (reason, event?) => boolean | void): void;
}
```

---

## Composable Behaviors (Компонуемые поведения)

### `closeOnOutsideClick(overlay)`

Закрывает при клике вне триггера и вне текущей ветки оверлея. Используется для поповеров и меню.

```typescript
createOverlay(isOpen, config, overlay => {
  closeOnOutsideClick(overlay);
});
```

### `closeOnFocusLeave(overlay)`

Закрывает при потере фокуса обоими — триггером и оверлеем. Используется для поповеров и выпадающих списков.

```typescript
createOverlay(isOpen, config, overlay => {
  closeOnFocusLeave(overlay);
});
```

### `closeOnBackdropClick(overlay)`

Закрывает при клике на бэкдроп (фоновую область), но не на содержимое панели (помечено `fiboOverlayPanel`). Используется для модальных диалогов.

```typescript
createOverlay(isOpen, config, overlay => {
  closeOnBackdropClick(overlay);  // Проверяет data-overlay-container-id и [fiboOverlayPanel]
});
```

### `restoreTriggerFocusOnClose(overlay)`

Возвращает фокус на элемент-триггер после закрытия, если пользователь не переместил фокус на другой элемент внутри ветки.

```typescript
createOverlay(isOpen, config, overlay => {
  restoreTriggerFocusOnClose(overlay);
});
```

### `blockScroll(overlay)`

Блокирует скролл документа при открытии оверлея. Сохраняет позицию скролла и компенсирует ширину скроллбара для предотвращения layout shift.

**Поддерживает вложенные оверлеи:** используется reference counting — только первый блокирует, только последний восстанавливает.

```typescript
blockScroll(overlay);
// Сохраняет: scrollX, scrollY, ширину скроллбара
// Применяет: position: fixed, top: -scrollY, left: -scrollX, overflow: hidden, overscroll-behavior: none
// На iOS: touch-action: none
```

### `closeOnScroll(overlay)`

Закрывает при скролле пользователем вне оверлея. Полезна для тултипов, которые теряют контекст.

```typescript
createOverlay(isOpen, config, overlay => {
  closeOnScroll(overlay);
});
```

### `trapOverlayFocus(overlay, options?)`

Единая focus-политика для overlay-контейнера. Используется вместо отдельной директивы `FocusTrap`.

Что делает:
- автофокус после открытия
- циклический `Tab/Shift+Tab` внутри текущего overlay-контейнера
- guard фокуса с учётом ветки (`overlay.isInOverlayBranch`) для модальных категорий

Поведение по умолчанию:
- `guard` автоматически включён для `dialog` и `confirmation`
- `guard` выключен для `popover`, `menu`, `tooltip`, `notification`
- начальный фокус ищет `[fiboFocusInitial]`, иначе первый tabbable, иначе root панели

```typescript
createOverlay(isOpen, config, overlay => {
  trapOverlayFocus(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

---

## ARIA и доступность

### `[fiboOverlayPanel]`

Директива, которая помечает панель (содержимое) оверлея внутри контейнера. Отвечает за:

- Установку `data-dialog-panel` (используется `closeOnBackdropClick` для различия панели и бэкдропа)
- Установку `role`, `aria-modal`, `aria-labelledby`, `aria-describedby`
- Auto-wiring связей с `OverlayTitle` / `OverlayDescription`

```typescript
@Directive({
  selector: '[fiboOverlayPanel]',
  host: {
    'data-dialog-panel': '',
    '[attr.role]': 'role()',
    '[attr.aria-modal]': 'modal() || null',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
  },
})
export class OverlayPanel {
  role = input<string>('dialog');        // 'dialog' по умолчанию
  modal = input(true);                   // true для модальных диалогов
  // titleId и descriptionId устанавливаются автоматически
}
```

**Использование в диалогах:**

```html
<div fiboOverlayPanel>
  <h2 fiboOverlayTitle>Confirm deletion</h2>
  <p>Are you sure?</p>
  <!-- aria-labelledby автоматически -> {overlay-id}-title -->
</div>
```

### `[fiboOverlayTitle]`

Помечает элемент заголовка и автоматически генерирует ID для `aria-labelledby`.

```html
<h2 fiboOverlayTitle>Modal Title</h2>
<!-- ID: {overlay-id}-title -->
<!-- Родительский OverlayPanel получает aria-labelledby={overlay-id}-title -->
```

### `[fiboOverlayDescription]`

Помечает элемент описания и автоматически генерирует ID для `aria-describedby`.

```html
<p fiboOverlayDescription>Description of the modal action</p>
<!-- ID: {overlay-id}-desc -->
<!-- Родительский OverlayPanel получает aria-describedby={overlay-id}-desc -->
```

---

## Focus Management

Focus-управление полностью переехало в `overlay-behaviors.ts` и настраивается через `trapOverlayFocus(...)`.

**Ключевой принцип:** один источник восстановления фокуса на закрытии — `restoreTriggerFocusOnClose(...)`.

**Рекомендованные комбинации:**
- **Modal (dialog/confirmation/drawer):** `closeOnBackdropClick + blockScroll + trapOverlayFocus + restoreTriggerFocusOnClose`
- **Popover/date/menu:** `closeOnFocusLeave + closeOnOutsideClick + trapOverlayFocus + restoreTriggerFocusOnClose` (guard автоматически выключен)

**`[fiboFocusInitial]`** остаётся marker-атрибутом для initial focus target внутри контента оверлея.

---

## Close Guards (Условное закрытие)

API для предотвращения закрытия оверлея при определённых условиях (например, форма с несохранёнными данными).

```typescript
createOverlay(isOpen, config, overlay => {
  overlay.canClose((reason, event) => {
    // reason: 'escape' | 'focusout' | 'outside-click' | 'backdrop' | 'blur' | 'programmatic'
    // Вернуть false для предотвращения закрытия

    if (reason === 'escape' && this.hasUnsavedChanges()) {
      return false;  // Не закрывать по Escape если есть несохранённые данные
    }
    return true;  // Разрешить закрытие
  });
});
```

---

## Escape Handling (Централизованная обработка Escape)

Вся обработка Escape делегирована `OverlayStack`:

1. **Глобальный слушатель:** На контейнере оверлеев в фазе захвата
2. **Топ-overlay:** `closeTopmost('escape')` находит верхний оверлей в стеке
3. **Проверка guards:** Проходит через все `canClose` guards перед закрытием

**Преимущества:**
- Нет дублирования обработчиков на каждом триггере
- Гарантированный порядок закрытия (вложенные сначала)
- Guards применяются ко всем методам закрытия

---

## Lifecycle

Каждый оверлей следует одному и тому же жизненному циклу:

```
1. Компонент устанавливает isOpen = true
   ↓
2. OverlayStack ожидает готовности templateRef
   ↓
3. Оверлей создаётся в OverlayContainer
   ↓
4. setup(...) регистрирует поведения
   ↓
5. afterOpened(...) выполняется после рендера
   ↓
6. Пользователь взаимодействует (клик, фокус, Escape)
   ↓
7. requestClose(...) проходит через guards
   ↓
8. beforeClose(...) выполняется
   ↓
9. Анимация выхода завершается
   ↓
10. afterClose(...) выполняется
    ↓
11. Оверлей удаляется из стека
```

---

## Вложенные оверлеи (Branches)

Оверлеи могут быть вложены. Если оверлей открывается внутри другого оверлея, он становится частью его ветки.

```
Parent Dialog
  ├─ Backdrop + Panel
  └─ Child Menu
       ├─ Backdrop (может быть скрыт)
       └─ Panel
            └─ Submenu
                 └─ Panel
```

**Поведение:**
- Клик внутри дочернего оверлея ≠ клик снаружи для родителя
- Перемещение фокуса от родителя к дочернему ≠ уход фокуса
- Восстановление фокуса учитывает целую ветку

**API:**
```typescript
overlay.isInOverlayBranch(target)  // Находится ли target в ветке этого оверлея или его потомков?
```

---

## Z-index стратегия

Категоризация по уровням:

| Категория | Z-Index | Примечание |
|---|---|---|
| `notification` | 3000 | Toast-уведомления |
| `tooltip` | 2000 | Самые верхние подсказки поверх интерактивных слоёв |
| `menu` | 1000 | Выпадающие меню |
| `popover` | 1000 | Поповеры (не модальные) |
| `confirmation` | 600 | Подтверждение действий |
| `dialog` | 500 | Модальные диалоги/дроверы |

**Auto-increment:** В категории каждый следующий оверлей получает +1 к z-index.

---

## Примеры использования

### Простой поповер

```typescript
@Component({
  selector: 'app-popover-example',
  template: `
    <button #trigger (click)="isOpen.set(!isOpen())">
      Toggle Popover
    </button>

    <ng-template #content>
      <div class="p-4 bg-white rounded shadow">
        <p>Popover content</p>
        <button (click)="isOpen.set(false)">Close</button>
      </div>
    </ng-template>
  `,
})
export class PopoverExample {
  isOpen = signal(false);

  @ViewChild('trigger') trigger!: ElementRef<HTMLElement>;
  @ViewChild('content') contentTpl!: TemplateRef<any>;

  overlayHandle = computed(() =>
    this.isOpen() ? createOverlay(
      this.isOpen,
      computed(() => ({
        templateRef: this.contentTpl,
        referenceElement: this.trigger.nativeElement,
        category: 'popover',
      })),
      overlay => {
        closeOnFocusLeave(overlay);
        closeOnOutsideClick(overlay);
        restoreTriggerFocusOnClose(overlay);
      }
    ) : null
  );
}
```

### Модальный диалог с ARIA

```typescript
@Component({
  selector: 'fibo-dialog',
  template: `
    <div fiboOverlayPanel>
      <h2 fiboOverlayTitle>{{ title() }}</h2>
      <p fiboOverlayDescription>{{ description() }}</p>
      <div class="dialog-content">
        <ng-content />
      </div>
    </div>
  `,
})
export class FiboDialog {
  @Input() title = signal('');
  @Input() description = signal('');
  @Output() closed = output<void>();

  onClose() {
    this.closed.emit();
  }
}
```

```typescript
createOverlay(isOpen, config, overlay => {
  closeOnBackdropClick(overlay);
  blockScroll(overlay);
  trapOverlayFocus(overlay);
  restoreTriggerFocusOnClose(overlay);
});
```

---

## Миграция и обновления

### От старой системы

Если используется старая overlay-система:

1. **Замена `data-dialog-panel`** на `fiboOverlayPanel`
2. **Удаление ручных ARIA-атрибутов** — используйте `fiboOverlayTitle` / `fiboOverlayDescription`
3. **Удаление `fiboFocusTrap` из шаблонов** — фокус теперь управляется через `trapOverlayFocus(...)` в setup оверлея
4. **Добавление blockScroll** — вызовите для модальных диалогов

---

## Performance и Best Practices

### Оптимизация

1. **Ленивое вычисление config:** используйте `computed()` чтобы избежать пересоздания оверлея при других изменениях
2. **Очистка в afterClose:** используйте `onCleanup()` для удаления слушателей
3. **Единое управление состоянием:** используйте один `signal(false)` для `isOpen`

### Accessibility

1. **Всегда используйте `fiboOverlayPanel`** для опознавания панели
2. **Помечайте заголовок с `fiboOverlayTitle`** — будет автоматически связан
3. **Для модальных диалогов:** `[modal]="true"` (по умолчанию)
4. **Для поповеров:** `[modal]="false"` + `trapOverlayFocus` c default guard (выключен для non-modal категорий)

### Тестирование

```typescript
it('should close on Escape', fakeAsync(() => {
  component.isOpen.set(true);
  tick();

  const event = new KeyboardEvent('keydown', { key: 'Escape' });
  document.dispatchEvent(event);
  tick(50);

  expect(component.isOpen()).toBe(false);
}));
```

---

*Дата обновления: 2026-03-26*
*Версия: CDK v1.x с trapOverlayFocus, OverlayPanel, blockScroll, canClose guards*
