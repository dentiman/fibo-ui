# Markdown rendering: фікс prose-стилів + callouts

**Дата:** 2026-07-09
**Статус:** затверджено

## Проблема

1. Inline-код у документації рендериться з backticks з обох боків (`` `@fibo-ui/cdk` ``), blockquote — з літеральними лапками та курсивом. Виглядає неохайно.
2. У markdown-словнику docs немає способу семантично виділяти примітки/попередження — все йде через звичайний blockquote.

## Причина (частина 1)

Перевизначення prose-стилів у `src/styles.css` уже існують (`content: none` для `code::before/::after`, `font-style: normal` для blockquote), але лежать у `@layer components`. Плагін `@tailwindcss/typography` кладе свої `.prose`-стилі в `@layer utilities`, а порядок шарів (`@layer theme, base, appearance, field-rules, components, utilities`) робить `utilities` найсильнішим. У каскаді з `@layer` порядок шарів важливіший за специфічність, тому перевизначення з `components` програють — незалежно від селекторів.

## Рішення

### 1. Фікс шарів

Перенести блок prose-перевизначень (prose-токени, `pre`, inline `code`, `blockquote`, `table`, shiki-стилі) з `@layer components` до `@layer utilities`. Наші правила йдуть у source order після typography-плагіна і мають вищу специфічність (плагін використовує `:where()` з нульовою специфічністю), тож виграють у межах одного шару.

### 2. Полірування inline-коду

Активований pill (сірий фон, бордер, радіус) доводимо:
- `font-weight: 500` замість 600 від typography;
- трохи більший horizontal padding (`0.15em 0.4em`);
- нейтральний колір для всього inline-коду (без кольорових акцентів — колір у тексті лише для посилань).

### 3. Callout-плагін (GitHub-синтаксис)

Новий файл `src/app/common/doc-viewer/callout-plugin.ts` (~60 рядків, у стилі `heading-anchor-plugin.ts`):

- core ruler знаходить blockquote, чий перший inline-рядок починається з `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` або `[!CAUTION]`;
- перетворює токени blockquote на контейнер:

```html
<div class="doc-callout" data-type="warning">
  <p class="doc-callout-title"><svg …/>Warning</p>
  <p>…контент…</p>
</div>
```

- іконки — inline SVG (Octicons, як у GitHub);
- blockquote без маркера не змінюється;
- плагін підключається до обох інстансів markdown-it у `shiki-highlighter.service.ts` (`md` і `mdDoc`).

### 4. CSS для callouts

У `src/styles.css` (шар utilities), на дизайн-токенах: кольорова ліва смуга, легкий tint фону (`color-mix`), кольоровий заголовок з іконкою. Кольори: note — синій, tip — зелений, important — фіолетовий, warning — жовтий, caution — червоний. Темна тема — через наявний патерн `[data-theme="dark"]`.

## Тестування

- Юніт-тест плагіна поруч з `shiki-highlighter.service.spec.ts`: перетворення кожного типу, ігнорування звичайного blockquote, вкладений контент.
- Візуальна перевірка на `/getting-started/introduction` у light/dark через preview.
- Демонстрація: блок "Status: beta" у `public/documentation/getting-started/introduction.md` переводиться на `[!NOTE]`.

## Поза обсягом

- Бейджі (beta/deprecated/версії) та стилізація `<kbd>` — окрема ітерація, якщо знадобиться.
- Кольорові акценти для назв пакетів в inline-коді — свідомо відхилено (best practice: один стиль для коду).
