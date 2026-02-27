# Overlay System — Critical Improvements Plan

## Проблемы и цели

Две критичные проблемы текущей overlay-системы:

1. **Нет Focus Trap** — пользователь с клавиатуры может Tab-ом выйти за пределы Dialog/Drawer. Нарушает WAI-ARIA Dialog Pattern.
2. **Ручное позиционирование вместо `autoUpdate`** — `PopoverPosition` слушает только `ResizeObserver` + `window resize`, но не отслеживает scroll родительских контейнеров. Попап "отлетает" при скролле.

---

## 1. Focus Trap

### 1.1 Что создаём

Новый файл: `projects/fibo-ui/cdk/src/lib/a11y/focus-trap.ts`

**Директива `FocusTrap`** — ловит Tab/Shift+Tab и зацикливает фокус внутри контейнера.

### 1.2 API

```typescript
@Directive({
  selector: '[fiboFocusTrap]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class FocusTrap implements AfterContentInit, OnDestroy {
  /** Включить/выключить ловушку */
  enabled = input(true);

  /** Автофокус на первый focusable элемент при инициализации */
  autoFocus = input(true);

  /** Вернуть фокус на этот элемент при destroy */
  restoreFocus = input(true);
}
```

### 1.3 Реализация — пошагово

**Шаг 1.** Вспомогательная функция `getFocusableElements(root: HTMLElement): HTMLElement[]`

```typescript
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
}
```

**Шаг 2.** Перехват `keydown` для Tab / Shift+Tab:

```typescript
onKeydown(event: KeyboardEvent) {
  if (!this.enabled() || event.key !== 'Tab') return;

  const focusable = getFocusableElements(this.elementRef.nativeElement);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey) {
    // Shift+Tab на первом элементе → перейти на последний
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else {
    // Tab на последнем элементе → перейти на первый
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
```

**Шаг 3.** Автофокус при инициализации (в `afterNextRender`):

```typescript
private elementRef = inject(ElementRef<HTMLElement>);
private previouslyFocused: HTMLElement | null = null;

constructor() {
  afterNextRender(() => {
    if (this.autoFocus()) {
      this.previouslyFocused = document.activeElement as HTMLElement;
      const focusable = getFocusableElements(this.elementRef.nativeElement);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        // Фокус на сам контейнер (нужен tabindex)
        this.elementRef.nativeElement.focus();
      }
    }
  });
}
```

**Шаг 4.** Возврат фокуса при destroy:

```typescript
ngOnDestroy() {
  if (this.restoreFocus() && this.previouslyFocused) {
    this.previouslyFocused.focus();
  }
}
```

### 1.4 Интеграция в Dialog

Файл: `projects/fibo-ui/components/src/lib/overlay/dialog/dialog.ts`

**Текущий код (inline template):**
```html
<div tabindex="0"
     class="flex min-h-full items-end justify-center ...">
  <div class="dialog-content ...">
    <ng-content />
  </div>
</div>
```

**Новый код:**
```html
<div fiboFocusTrap
     class="flex min-h-full items-end justify-center ...">
  <div class="dialog-content ..."
       role="dialog"
       aria-modal="true">
    <ng-content />
  </div>
</div>
```

Изменения:
- Убрать `tabindex="0"` с обёртки (FocusTrap сам управляет фокусом)
- Добавить `fiboFocusTrap` на обёртку контента
- Добавить `role="dialog"` и `aria-modal="true"` на `.dialog-content`
- Импортировать `FocusTrap` в компонент

### 1.5 Интеграция в Drawer

Файл: `projects/fibo-ui/components/src/lib/overlay/drawer/drawer.html`

**Текущий код:**
```html
<div class="drawer-panel pointer-events-none fixed inset-y-0 right-0 ...">
  <div class="pointer-events-auto w-screen max-w-md shadow-xl">
    <div class="flex h-full flex-col overflow-y-scroll bg-background ...">
      <ng-container *ngTemplateOutlet="state.content()"></ng-container>
    </div>
  </div>
</div>
```

**Новый код:**
```html
<div class="drawer-panel pointer-events-none fixed inset-y-0 right-0 ..."
     role="dialog"
     aria-modal="true">
  <div fiboFocusTrap
       class="pointer-events-auto w-screen max-w-md shadow-xl">
    <div class="flex h-full flex-col overflow-y-scroll bg-background ...">
      <ng-container *ngTemplateOutlet="state.content()"></ng-container>
    </div>
  </div>
</div>
```

Изменения:
- Добавить `fiboFocusTrap` на `pointer-events-auto` контейнер
- Добавить `role="dialog"` и `aria-modal="true"` на `.drawer-panel`
- Импортировать `FocusTrap` в `FiboDrawer`

### 1.6 Экспорт

Экспортировать `FocusTrap` из public API CDK.

---

## 2. autoUpdate для PopoverPosition

### 2.1 Проблема в текущем коде

Файл: `projects/fibo-ui/cdk/src/lib/popover/popover-position.ts`

Текущая реализация:
```typescript
const allEvents = merge(
  fromResizeObserver(reference),
  fromResizeObserver(this.elementRef.nativeElement),
  fromEvent(window, 'resize', { passive: true }),
).pipe(
  debounceTime(10),
  switchMap(() => from(computePosition(...)))
);
```

**Что не отслеживается:**
- Scroll любых родительских контейнеров (кроме window)
- Layout shifts (вставка контента выше reference элемента)
- Scroll элемент внутри overflow: auto/scroll контейнера

### 2.2 Решение — использовать `autoUpdate` из `@floating-ui/dom`

`@floating-ui/dom` уже установлен в проекте. Функция `autoUpdate` экспортируется из него и обрабатывает:
- `ancestorScroll` — scroll всех scroll-ancestor'ов
- `ancestorResize` — resize всех ancestor'ов
- `elementResize` — ResizeObserver на reference и floating
- `layoutShift` — IntersectionObserver для layout shifts
- `animationFrame` — опционально, для requestAnimationFrame polling

### 2.3 Новый код PopoverPosition

Полная замена конструктора:

```typescript
import {
  computePosition,
  flip,
  shift,
  arrow,
  offset,
  autoUpdate,          // <-- добавить импорт
  Placement,
  ComputePositionReturn,
} from '@floating-ui/dom';

// Удалить импорты:
// - fromResizeObserver (вся функция)
// - from, fromEvent, Observable, switchMap, merge, debounceTime, tap из 'rxjs'

@Directive({
  selector: '[fiboPopoverPosition]',
  exportAs: 'PopoverPosition',
  host: {
    '[style.position]': '"absolute"',
    '[style.left]': 'position() ? position()?.x + "px" : ""',
    '[style.top]': 'position() ? position()?.y + "px" : ""',
    '[style.width]': 'width() ? width() + "px" : ""',
    '[style.opacity]': 'position() ? "1" : "0"',
  },
})
export class PopoverPosition {
  referenceElement = input<HTMLElement>();
  trigger = input<PopoverTrigger>();

  realReferenceElement = computed(() => {
    if (this.referenceElement()) return this.referenceElement();
    return this.trigger()?.element;
  });

  matchWidth = input<boolean>(false);
  placement = model<Placement>('bottom');
  elementRef = inject(ElementRef);
  offset = input<number>(5);
  private positionSignal = signal<ComputePositionReturn | null>(null);

  arrow = contentChild(PopoverArrow);

  positionMiddleware = computed(() => {
    const middleware = [offset(this.offset()), shift(), flip()];
    if (this.arrow()) {
      const arrowSize = this.arrow()?.elementRef.nativeElement.offsetWidth || 0;
      const arrowOffset = arrowSize / 2;
      middleware.push(
        arrow({ element: this.arrow()?.elementRef.nativeElement }),
        offset(arrowOffset + this.offset())
      );
    }
    return middleware;
  });

  position = this.positionSignal.asReadonly();

  width = computed(() => {
    this.position();
    return this.matchWidth()
      ? this.realReferenceElement()?.offsetWidth
      : undefined;
  });

  constructor() {
    effect((onCleanup) => {
      const reference = this.realReferenceElement();
      if (!reference) return;

      const floatingEl = this.elementRef.nativeElement;

      const updatePosition = () => {
        computePosition(reference, floatingEl, {
          placement: this.placement(),
          middleware: this.positionMiddleware(),
        }).then((position) => {
          this.positionSignal.set(position);
        });
      };

      // autoUpdate возвращает cleanup-функцию
      const cleanup = autoUpdate(
        reference,
        floatingEl,
        updatePosition,
        {
          ancestorScroll: true,   // слушать scroll всех предков
          ancestorResize: true,   // слушать resize всех предков
          elementResize: true,    // ResizeObserver на обоих элементах
          layoutShift: true,      // IntersectionObserver для layout shifts
          animationFrame: false,  // не нужен rAF polling (дорого)
        }
      );

      onCleanup(cleanup);
    });
  }
}
```

### 2.4 Что удаляем

1. **Функция `fromResizeObserver`** — полностью удалить (больше не нужна)
2. **Все RxJS импорты** из этого файла: `from`, `fromEvent`, `Observable`, `switchMap`, `merge`, `debounceTime`, `tap`
3. **Ручная подписка** `allEvents.subscribe(...)` и начальный `computePosition(...).then(...)`

### 2.5 Что получаем

| До | После |
|----|-------|
| Не отслеживает scroll родителей | Отслеживает scroll всех ancestor'ов |
| Ручные ResizeObserver + window resize | autoUpdate управляет всем автоматически |
| `debounceTime(10)` — задержка | Мгновенный пересчёт (без debounce) |
| ~40 строк Observable-логики | ~15 строк с autoUpdate |
| RxJS зависимость в файле | Нет RxJS зависимости |

---

## Порядок внедрения

### Фаза 1: FocusTrap (CDK)
1. Создать `projects/fibo-ui/cdk/src/lib/a11y/focus-trap.ts`
2. Экспортировать из public API CDK
3. Применить в `FiboDialog` (inline template)
4. Применить в `FiboDrawer` (drawer.html)
5. Проверить: Tab зацикливается внутри Dialog/Drawer, фокус возвращается при закрытии

### Фаза 2: autoUpdate (CDK)
1. Заменить содержимое `popover-position.ts` (как описано в 2.3)
2. Удалить `fromResizeObserver` и RxJS импорты
3. Проверить: Select, Menu, DatePicker, Tooltip — позиция корректна при скролле

### Тестирование
- Dialog: открыть → Tab несколько раз → фокус не выходит за пределы → Escape → фокус на trigger
- Drawer: открыть → Tab несколько раз → фокус не выходит за пределы → закрыть → фокус на trigger
- Select внутри scrollable контейнера: открыть → прокрутить контейнер → попап следует за trigger
- Menu: открыть → прокрутить страницу → меню остаётся у trigger
