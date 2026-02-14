---
title: Markdown Docs Recommendations
description: Практические рекомендации по публикации и использованию markdown-документации UI-kit на сайте и для LLM.
status: updated
last_updated: 2026-02-14
---

# Рекомендации по использованию markdown-документации на сайте

## 1. Канонический набор документов

Сайт должен строиться вокруг новых канонических файлов в `docs`:

1. `docs/ui-kit-index.md`
2. `docs/ui-kit-overview.md`
3. `docs/ui-kit-cdk-reference.md`
4. `docs/ui-kit-components-reference.md`
5. `docs/ui-kit-composition-patterns.md`

Старую структуру в `public/documentation` использовать только как legacy source для demo snippets.

## 2. Целевая структура сайта

Рекомендуемые URL:

1. `/docs/ui-kit`
2. `/docs/ui-kit/overview`
3. `/docs/ui-kit/cdk-reference`
4. `/docs/ui-kit/components-reference`
5. `/docs/ui-kit/composition-patterns`

Принцип: один URL = один канонический markdown-файл.

## 3. Что показывать на каждой странице

1. Назначение и когда использовать.
2. API таблицы (inputs/outputs/models/methods/selectors).
3. Минимум один рабочий пример.
4. Ограничения и edge cases.
5. Связанные сущности (dependencies, composition links).

## 4. Связка с интерактивными демо

Текущие `UsageDemo` блоки полезны, но не должны быть единственным носителем знаний.

Рекомендация:

1. Оставить live demo в UI.
2. Вокруг демо рендерить канонический markdown (SSR/SSG).
3. Для каждого demo показывать ссылку "API Reference" на соответствующий раздел канонических docs.

## 5. LLM-friendly формат

## 5.1. Markdown правила

1. Один `h1` на файл.
2. Стабильные `h2/h3` заголовки без скачков уровней.
3. Единый формат API-блоков (kind/selector/inputs/outputs/models/methods/dependencies).
4. Минимум неструктурированного текста, максимум явных списков и таблиц.

## 5.2. Frontmatter

Каждый файл должен содержать:

1. `title`
2. `description`
3. `status`
4. `last_updated`
5. (опционально) `package`

## 5.3. Индекс для LLM

Добавить служебные артефакты:

1. `llms.txt` (краткий индекс разделов)
2. `llms-full.txt` (расширенный индекс с аннотациями)

Включать в индекс канонические файлы из `docs`, а не устаревшие snippets.

## 6. Рекомендации по рендерингу на сайте

1. Предпочтительно SSR/SSG для docs-роутов.
2. Важный API контент не прятать в tabs/accordion по умолчанию.
3. На каждой странице выводить блок:
- Package
- Selector
- Exported from
- Source path

## 7. Автоматическая синхронизация API

Чтобы docs не устаревали:

1. На CI проверять соответствие `public-api.ts` и reference docs.
2. При добавлении export требовать обновление docs в том же PR.
3. Для breaking changes требовать `Migration` раздел в markdown.

## 8. Навигация и кросс-ссылки

Обязательно проставить перекрестные ссылки:

1. Из компонента -> на используемые CDK примитивы.
2. Из CDK директивы -> на компоненты, которые ее используют.
3. Из composition docs -> на конкретные API-секции.

## 9. Quality checklist для PR

PR с изменением UI-kit принимается, если:

1. Обновлен соответствующий reference-файл.
2. Обновлен composition-файл (если изменилась цепочка взаимодействий).
3. Обновлен индекс (`ui-kit-index.md`) при добавлении новых сущностей.
4. Проверены ссылки и корректность markdown render.

## 10. Практика внедрения по шагам

1. Подключить новые docs-файлы к роутам документации сайта.
2. Пометить старые markdown snippets как legacy.
3. Добавить автоматическую проверку ссылок и полноты API.
4. Опубликовать `llms.txt` и `llms-full.txt`.

