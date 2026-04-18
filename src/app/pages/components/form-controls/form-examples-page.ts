import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldContext, Size } from '@fibo-ui/components';
import { FormExample } from './examples/form-example';

@Component({
  selector: 'app-form-examples-page',
  imports: [FormExample, FieldContext, Size],
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
            Three sizes with the default stacked label. Width is explicit on the wrapper:
            <code class="font-mono">grid gap-4 mx-auto w-full max-w-[26rem] min-w-0 p-2</code>.
          </p>
        </div>

        <div class="grid gap-6 xl:grid-cols-3">
          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Small</h3>
              <div class="text-xs font-mono text-foreground-secondary">fiboSize="sm"</div>
            </div>

            <div class="min-w-0" fiboFieldContext fiboSize="sm">
              <div class="grid gap-4 mx-auto w-full max-w-[26rem] min-w-0 p-2">
                <form-example [showHeader]="false" />
              </div>
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Medium (default)</h3>
              <div class="text-xs font-mono text-foreground-secondary">no extra attributes</div>
            </div>

            <div class="grid gap-4 mx-auto w-full max-w-[26rem] min-w-0 p-2">
              <form-example [showHeader]="false" />
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Large</h3>
              <div class="text-xs font-mono text-foreground-secondary">fiboSize="lg"</div>
            </div>

            <div class="min-w-0" fiboFieldContext fiboSize="lg">
              <div class="grid gap-4 mx-auto w-full max-w-[26rem] min-w-0 p-2">
                <form-example [showHeader]="false" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-foreground">Inline Label Layout</h2>
          <p class="text-sm text-foreground-secondary">
            Same three sizes, but labels render to the left of the control via
            <code class="font-mono">labelLayout="inline"</code>. Layout stays explicit on the same
            wrapper:
            <code class="font-mono">grid gap-4 mx-auto w-full max-w-[26rem] min-w-0 p-2</code>.
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
              <div class="grid gap-4 mx-auto w-full max-w-[26rem] min-w-0 p-2">
                <form-example [showHeader]="false" />
              </div>
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Medium (default)</h3>
              <div class="text-xs font-mono text-foreground-secondary">labelLayout="inline"</div>
            </div>

            <div class="min-w-0" fiboFieldContext labelLayout="inline">
              <div class="grid gap-4 mx-auto w-full max-w-[26rem] min-w-0 p-2">
                <form-example [showHeader]="false" />
              </div>
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
              <div class="grid gap-4 mx-auto w-full max-w-[26rem] min-w-0 p-2">
                <form-example [showHeader]="false" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-foreground">Filter Toolbar — Inline Label</h2>
          <p class="text-sm text-foreground-secondary">
            Toolbar filter row across the three size variants. Content-sized layout is explicit on
            the wrapper:
            <code class="font-mono">flex flex-wrap items-center gap-2</code>.
            No <code class="font-mono">w-full</code> or <code class="font-mono">flex-1</code>
            utilities are applied to the field items. The same reusable
            <code class="font-mono">form-example</code> is rendered here to show how the layout
            context alone changes sizing.
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
            <form-example [showHeader]="false" />
          </div>
        </section>

        <section class="fibo-card p-4 space-y-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-foreground">Medium (default)</h3>
            <div class="text-xs font-mono text-foreground-secondary">labelLayout="inline"</div>
          </div>

          <div class="flex flex-wrap items-center gap-2" fiboFieldContext labelLayout="inline">
            <form-example [showHeader]="false" />
          </div>
        </section>

        <section class="fibo-card p-4 space-y-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-foreground">Large 2</h3>
            <div class="text-xs font-mono text-foreground-secondary">
              labelLayout="inline" fiboSize="lg"
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2" fiboFieldContext labelLayout="inline" fiboSize="lg">
            <form-example [showHeader]="false" />
          </div>
        </section>
      </section>
    </div>
  `,
})
export class FormExamplesPageComponent {}
