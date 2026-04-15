import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { DatePickerField, FieldContext, Select, type SelectItem, TextField } from '@fibo-ui/components';
import { citiesChoices, usersChoices } from '../../../common/form-data-example';
import { FormExample } from './examples/form-example';

interface FilterToolbarModel {
  query: string;
  status: string | null;
  assignee: number | null;
  updatedAfter: string;
  city: string | null;
}

@Component({
  selector: 'app-form-examples-page',
  imports: [FormField, FormExample, TextField, Select, DatePickerField, FieldContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto p-6 space-y-10">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold text-foreground">Form Examples</h1>
        <p class="text-sm text-foreground-secondary">
          Registration forms and filter toolbars rendered with different density and layout contexts.
        </p>
      </div>

      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-foreground">Registration Form Variants</h2>
          <p class="text-sm text-foreground-secondary">
            The same registration form with stacked and inline label layouts.
          </p>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Default</h3>
              <div class="text-xs font-mono text-foreground-secondary">no extra classes</div>
            </div>

            <form-example [showHeader]="false" />
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Stacked Compact</h3>
              <div class="text-xs font-mono text-foreground-secondary">density="compact"</div>
            </div>

            <div class="min-w-0" fiboFieldContext density="compact">
              <form-example [showHeader]="false" />
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Inline Comfy</h3>
              <div class="text-xs font-mono text-foreground-secondary">labelLayout="inline"</div>
            </div>

            <div class="min-w-0" fiboFieldContext labelLayout="inline">
              <form-example [showHeader]="false" />
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Inline Compact</h3>
              <div class="text-xs font-mono text-foreground-secondary">
                labelLayout="inline" density="compact"
              </div>
            </div>

            <div class="min-w-0" fiboFieldContext labelLayout="inline" density="compact">
              <form-example [showHeader]="false" />
            </div>
          </section>
        </div>
      </section>

      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-foreground">Filter Toolbar Variants</h2>
          <p class="text-sm text-foreground-secondary">
            The same filter fields rendered as toolbar controls with different combinations of
            layout and density contexts.
          </p>
        </div>

        <section class="fibo-card p-4 space-y-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-foreground">Stacked Comfy</h3>
            <div class="text-xs font-mono text-foreground-secondary">form-field-filter-bar</div>
          </div>

          <div class="form-field-filter-bar">
            <fibo-text-field
              [formField]="stackedFilterForm.query"
              label="Search"
              iconStart="search"
              placeholder="Issue title or ID"
            />
            <fibo-select
              [formField]="stackedFilterForm.status"
              label="Status"
              placeholder="Any"
              [items]="statusItems"
              [clearValue]="null"
            />
            <fibo-select
              [formField]="stackedFilterForm.assignee"
              label="Owner"
              placeholder="Anyone"
              [items]="assigneeItems"
              [clearValue]="null"
            />
            <fibo-datepicker
              [formField]="stackedFilterForm.updatedAfter"
              label="Updated"
              placeholder="After"
            />
            <fibo-select
              [formField]="stackedFilterForm.city"
              label="City"
              placeholder="Any city"
              [items]="cityItems"
              [clearValue]="null"
            />
          </div>
        </section>

        <section class="fibo-card p-4 space-y-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-foreground">Inline Comfy</h3>
            <div class="text-xs font-mono text-foreground-secondary">
              form-field-filter-bar + labelLayout="inline"
            </div>
          </div>

          <div class="form-field-filter-bar" fiboFieldContext labelLayout="inline">
            <fibo-text-field
              [formField]="inlineFilterForm.query"
              label="Search"
              iconStart="search"
              placeholder="Issue title or ID"
            />
            <fibo-select
              [formField]="inlineFilterForm.status"
              label="Status"
              placeholder="Any"
              [items]="statusItems"
              [clearValue]="null"
            />
            <fibo-select
              [formField]="inlineFilterForm.assignee"
              label="Owner"
              placeholder="Anyone"
              [items]="assigneeItems"
              [clearValue]="null"
            />
            <fibo-datepicker
              [formField]="inlineFilterForm.updatedAfter"
              label="Updated"
              placeholder="After"
            />
            <fibo-select
              [formField]="inlineFilterForm.city"
              label="City"
              placeholder="Any city"
              [items]="cityItems"
              [clearValue]="null"
            />
          </div>
        </section>

        <section class="fibo-card p-4 space-y-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-foreground">Inline Compact</h3>
            <div class="text-xs font-mono text-foreground-secondary">
              form-field-filter-bar + labelLayout="inline" + density="compact"
            </div>
          </div>

          <div class="form-field-filter-bar" fiboFieldContext labelLayout="inline" density="compact">
            <fibo-text-field
              [formField]="inlineCompactFilterForm.query"
              label="Search"
              iconStart="search"
              placeholder="Issue title or ID"
            />
            <fibo-select
              [formField]="inlineCompactFilterForm.status"
              label="Status"
              placeholder="Any"
              [items]="statusItems"
              [clearValue]="null"
            />
            <fibo-select
              [formField]="inlineCompactFilterForm.assignee"
              label="Owner"
              placeholder="Anyone"
              [items]="assigneeItems"
              [clearValue]="null"
            />
            <fibo-datepicker
              [formField]="inlineCompactFilterForm.updatedAfter"
              label="Updated"
              placeholder="After"
            />
            <fibo-select
              [formField]="inlineCompactFilterForm.city"
              label="City"
              placeholder="Any city"
              [items]="cityItems"
              [clearValue]="null"
            />
          </div>
        </section>
      </section>
    </div>
  `,
})
export class FormExamplesPageComponent {
  readonly statusItems: SelectItem[] = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Blocked', value: 'blocked' },
    { label: 'Done', value: 'done' },
  ];

  readonly assigneeItems: SelectItem[] = usersChoices.slice(0, 8).map((user) => ({
    label: user.label,
    value: user.id,
  }));

  readonly cityItems: SelectItem[] = citiesChoices.slice(0, 10);

  readonly stackedFilterModel = signal<FilterToolbarModel>({
    query: '',
    status: null,
    assignee: null,
    updatedAfter: '',
    city: null,
  });

  readonly inlineFilterModel = signal<FilterToolbarModel>({
    query: '',
    status: null,
    assignee: null,
    updatedAfter: '',
    city: null,
  });

  readonly inlineCompactFilterModel = signal<FilterToolbarModel>({
    query: '',
    status: null,
    assignee: null,
    updatedAfter: '',
    city: null,
  });

  readonly stackedFilterForm = form(this.stackedFilterModel, () => {});
  readonly inlineFilterForm = form(this.inlineFilterModel, () => {});
  readonly inlineCompactFilterForm = form(this.inlineCompactFilterModel, () => {});
}
