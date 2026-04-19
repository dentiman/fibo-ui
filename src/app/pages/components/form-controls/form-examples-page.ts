import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormFieldLayoutExample } from './examples/form-field-layout-example';

@Component({
  selector: 'app-form-examples-page',
  imports: [FormFieldLayoutExample],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto p-6 space-y-10">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold text-foreground">Form Examples</h1>
        <p class="text-sm text-foreground-secondary">
          Higher-level form composition examples using the
          <code class="font-mono">labelLayout</code> directive.
        </p>
      </div>

      <section class="space-y-4">
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-foreground">Label Layout</h2>
          <p class="text-sm text-foreground-secondary">
            Apply <code class="font-mono">formLayout</code> on a wrapper element to configure
            external label positioning for all child fields via DI.
          </p>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Vertical</h3>
              <div class="text-xs font-mono text-foreground-secondary">
                &lt;div formLayout="vertical"&gt;
              </div>
            </div>

            <div class="grid gap-4 mx-auto w-full max-w-[32rem] min-w-0 p-2">
              <form-field-layout-example />
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Horizontal</h3>
              <div class="text-xs font-mono text-foreground-secondary">
                &lt;div formLayout="horizontal"&gt;
              </div>
            </div>

            <div class="grid gap-4 mx-auto w-full max-w-[42rem] min-w-0 p-2">
              <form-field-layout-example orientation="horizontal" />
            </div>
          </section>

          <section class="fibo-card min-w-0 overflow-hidden p-4 space-y-4 xl:col-span-2">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-foreground">Horizontal — custom columns</h3>
              <div class="text-xs font-mono text-foreground-secondary">
                &lt;div labelLayout="horizontal" style="--fibo-field-shell-cols: 30% 70%"&gt;
              </div>
              <p class="text-sm text-foreground-secondary">
                Override <code class="font-mono">--fibo-field-shell-cols</code> on the wrapper to
                control each column width with any valid CSS grid track value.
              </p>
            </div>

            <div class="grid gap-4 mx-auto w-full max-w-[42rem] min-w-0 p-2"
                 style="--fibo-field-shell-cols: 30% 70%">
              <form-field-layout-example orientation="horizontal" />
            </div>
          </section>
        </div>
      </section>
    </div>
  `,
})
export class FormExamplesPageComponent {}
