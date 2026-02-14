---
title: Component Generation Strategy
description: Стратегия развития UI-kit, генерации компонентов и поддержания документации в актуальном состоянии.
status: updated
last_updated: 2026-02-14
---

# Стратегия развития и генерации компонентов

## 1. Принципиальная модель

`fibo-ui` развивается как двухслойная система:

1. `@fibo-ui/cdk` — стабильные headless primitive блоки.
2. `@fibo-ui/components` — референсные готовые компоненты на базе CDK.
3. Потребители могут:
- использовать готовые компоненты напрямую,
- или генерировать/собирать кастомные версии в своём коде, используя CDK-паттерны.

## 2. Источник истины для API

Единый источник публичного контракта:

1. `projects/fibo-ui/cdk/src/public-api.ts`
2. `projects/fibo-ui/components/src/public-api.ts`

Все генераторы документации и scaffolding-утилиты должны опираться на эти файлы.

## 3. Целевая модель генерации компонентов

## 3.1. Режимы генерации

Поддерживать оба режима:

1. `--target=app`: генерация в `src/...` (быстро, локально, shadcn-подход).
2. `--target=lib`: генерация в workspace library (`projects/...`) для реиспользования.

## 3.2. Минимальный контракт генератора

Генератор обязан:

1. Копировать шаблон компонента и его внутренние зависимости.
2. Обновлять импорты и (для `lib`-режима) `public-api.ts`.
3. Поддерживать кастомизацию selector/prefix.
4. Не перетирать измененные пользователем файлы без явного флага (`--force`).

## 4. Что генерировать в первую очередь

## Этап 1

1. `text-field`
2. `select`
3. `multi-select`
4. `checkbox`
5. `switch`
6. `datepicker`

Причина: это самые используемые form-примитивы с уже стабильными паттернами в `src/app/pages`.

## Этап 2

1. `menu`
2. `dialog`
3. `drawer`
4. `confirmation`
5. `notification`
6. `tooltip`

Причина: overlay-слой требует правильной root-интеграции (`fibo-*-container`, `fibo-portal-outlet`).

## Этап 3

1. `table`
2. `listbox`
3. `tree-menu`

Причина: более сложные композиции с projected template API и nested behavior.

## 5. Стратегия документации для генератора

Новая документация в `docs` — обязательная опора для генератора:

1. `docs/ui-kit-overview.md`
2. `docs/ui-kit-cdk-reference.md`
3. `docs/ui-kit-components-reference.md`
4. `docs/ui-kit-composition-patterns.md`

Для каждого генерируемого компонента генератор должен уметь ссылаться на:

1. базовый API компонента,
2. зависимые CDK примитивы,
3. рабочий паттерн композиции.

## 6. Манифест компонента (рекомендуемый формат)

На каждый шаблон компонента завести манифест (json/yaml):

1. `name`
2. `publicSelector`
3. `publicInputs`
4. `publicOutputs`
5. `dependsOnComponents`
6. `dependsOnCdk`
7. `requiredRootContainers`
8. `stylesImports`
9. `examples` (пути на эталон в `src/app/pages`)
10. `docs` (путь на каноническую doc-страницу)

## 7. Контроль качества (Definition of Ready)

Компонент допускается в генератор, если:

1. Экспортирован в `public-api.ts` (или явно отмечен как internal template part).
2. Есть рабочий пример в `src/app/pages`.
3. Есть описание в reference docs.
4. Описаны обязательные зависимости (icons, root containers, CDK directives).
5. Есть smoke-тест сборки после генерации.

## 8. Контроль качества (Definition of Done)

Задача по генерации считается завершенной, если:

1. Компонент генерируется в режимах `app` и `lib`.
2. Публичный API совпадает с reference docs.
3. Документация и generated template синхронизированы.
4. Проверены сценарии forms/signals/overlay (если применимо).

## 9. Риски и меры

1. Риск: рассинхрон docs и кода.
- Мера: проверка в CI по `public-api.ts` + markdown index.
2. Риск: overlay-компоненты не работают в consumer app.
- Мера: явный checklist root containers.
3. Риск: breaking change в selector/input без миграции.
- Мера: changelog + migration block в docs.

## 10. Переходный план (практический)

1. Зафиксировать текущий reference-слой (`@fibo-ui/components`) как baseline.
2. Добавить генератор для form controls (этап 1).
3. Добавить генератор для overlay (этап 2) с авто-подсказкой по root shell.
4. Подключить CI-валидацию docs/API sync.
5. Постепенно переводить документацию на model: "reference + generate + own".

