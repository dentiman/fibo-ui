import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { DatePickerField, FieldContext, Select, type SelectItem, Size, TextField } from '@fibo-ui/components';
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
  imports: [FormField, FormExample, TextField, Select, DatePickerField, FieldContext, Size],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto p-6 space-y-10">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold text-foreground">Form Examples</h1>
        <p class="text-sm text-foreground-secondary">
          Registration forms and filter toolbars rendered across all size × label-layout combinations.
        </p>
      </div>

      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-foreground">Stacked Label Layout</h2>
          <p class="text-sm text-foreground-secondary">
            Three sizes with the default stacked label. Driven by <code class="font-mono">fiboSize</code>.
          </p>
        </div>

        <div class="grid gap-6 xl:grid-cols-3">
          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Small</h3>
              <div class="text-xs font-mono text-foreground-secondary">fiboSize="sm"</div>
            </div>

            <div class="min-w-0" fiboFieldContext fiboSize="sm">
              <form-example [showHeader]="false" />
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Medium (default)</h3>
              <div class="text-xs font-mono text-foreground-secondary">no extra attributes</div>
            </div>

            <form-example [showHeader]="false" />
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Large</h3>
              <div class="text-xs font-mono text-foreground-secondary">fiboSize="lg"</div>
            </div>

            <div class="min-w-0" fiboFieldContext fiboSize="lg">
              <form-example [showHeader]="false" />
            </div>
          </section>
        </div>
      </section>

      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-foreground">Inline Label Layout</h2>
          <p class="text-sm text-foreground-secondary">
            Same three sizes, but labels render to the left of the control via
            <code class="font-mono">labelLayout="inline"</code>.
          </p>
        </div>

        <div class="grid gap-6 xl:grid-cols-3">
          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Small</h3>
              <div class="text-xs font-mono text-foreground-secondary">
                labelLayout="inline" fiboSize="sm"
              </div>
            </div>

            <div class="min-w-0" fiboFieldContext labelLayout="inline" fiboSize="sm">
              <form-example [showHeader]="false" />
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Medium (default)</h3>
              <div class="text-xs font-mono text-foreground-secondary">labelLayout="inline"</div>
            </div>

            <div class="min-w-0" fiboFieldContext labelLayout="inline">
              <form-example [showHeader]="false" />
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Large</h3>
              <div class="text-xs font-mono text-foreground-secondary">
                labelLayout="inline" fiboSize="lg"
              </div>
            </div>

            <div class="min-w-0" fiboFieldContext labelLayout="inline" fiboSize="lg">
              <form-example [showHeader]="false" />
            </div>
          </section>
        </div>
      </section>

      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-foreground">Filter Toolbar — Inline Label</h2>
          <p class="text-sm text-foreground-secondary">
            Toolbar filter row across the three size variants. All use
            <code class="font-mono">labelLayout="inline"</code>.
          </p>
        </div>

        <section class="fibo-card p-4 space-y-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-foreground">Small</h3>
            <div class="text-xs font-mono text-foreground-secondary">
              labelLayout="inline" fiboSize="sm"
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2" fiboFieldContext labelLayout="inline" fiboSize="sm">
            <fibo-text-field
              [formField]="filterFormSm.query"
              label="Search"
              iconStart="search"
              placeholder="Issue title or ID"
            />
            <fibo-select
              [formField]="filterFormSm.status"
              label="Status"
              placeholder="Any"
              [items]="statusItems"
              [clearValue]="null"
            />
            <fibo-select
              [formField]="filterFormSm.assignee"
              label="Owner"
              placeholder="Anyone"
              [items]="assigneeItems"
              [clearValue]="null"
            />
            <fibo-datepicker
              [formField]="filterFormSm.updatedAfter"
              label="Updated"
              placeholder="After"
            />
            <fibo-select
              [formField]="filterFormSm.city"
              label="City"
              placeholder="Any city"
              [items]="cityItems"
              [clearValue]="null"
            />
          </div>
        </section>

        <section class="fibo-card p-4 space-y-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-foreground">Medium (default)</h3>
            <div class="text-xs font-mono text-foreground-secondary">labelLayout="inline"</div>
          </div>

          <div class="flex flex-wrap items-center gap-2" fiboFieldContext labelLayout="inline">
            <fibo-text-field
              [formField]="filterFormMd.query"
              label="Search"
              iconStart="search"
              placeholder="Issue title or ID"
            />
            <fibo-select
              [formField]="filterFormMd.status"
              label="Status"
              placeholder="Any"
              [items]="statusItems"
              [clearValue]="null"
            />
            <fibo-select
              [formField]="filterFormMd.assignee"
              label="Owner"
              placeholder="Anyone"
              [items]="assigneeItems"
              [clearValue]="null"
            />
            <fibo-datepicker
              [formField]="filterFormMd.updatedAfter"
              label="Updated"
              placeholder="After"
            />
            <fibo-select
              [formField]="filterFormMd.city"
              label="City"
              placeholder="Any city"
              [items]="cityItems"
              [clearValue]="null"
            />
          </div>
        </section>

        <section class="fibo-card p-4 space-y-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-foreground">Large</h3>
            <div class="text-xs font-mono text-foreground-secondary">
              labelLayout="inline" fiboSize="lg"
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2" fiboFieldContext labelLayout="inline" fiboSize="lg">
            <fibo-text-field
              [formField]="filterFormLg.query"
              label="Search"
              iconStart="search"
              placeholder="Issue title or ID"
            />
            <fibo-select
              [formField]="filterFormLg.status"
              label="Status"
              placeholder="Any"
              [items]="statusItems"
              [clearValue]="null"
            />
            <fibo-select
              [formField]="filterFormLg.assignee"
              label="Owner"
              placeholder="Anyone"
              [items]="assigneeItems"
              [clearValue]="null"
            />
            <fibo-datepicker
              [formField]="filterFormLg.updatedAfter"
              label="Updated"
              placeholder="After"
            />
            <fibo-select
              [formField]="filterFormLg.city"
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

  readonly filterModelSm = signal<FilterToolbarModel>({
    query: '',
    status: null,
    assignee: null,
    updatedAfter: '',
    city: null,
  });

  readonly filterModelMd = signal<FilterToolbarModel>({
    query: '',
    status: null,
    assignee: null,
    updatedAfter: '',
    city: null,
  });

  readonly filterModelLg = signal<FilterToolbarModel>({
    query: '',
    status: null,
    assignee: null,
    updatedAfter: '',
    city: null,
  });

  readonly filterFormSm = form(this.filterModelSm, () => {});
  readonly filterFormMd = form(this.filterModelMd, () => {});
  readonly filterFormLg = form(this.filterModelLg, () => {});
}
