import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '@fibo-ui/components';

@Component({
  selector: 'app-button-demo-page',
  standalone: true,
  imports: [CommonModule, Button],
  template: `
<div class="p-8 max-w-7xl mx-auto">
  <h1 class="mb-8 text-3xl font-semibold tracking-tight">Button Component Examples</h1>

  <div class="grid grid-cols-1  gap-8 mb-12">

    <!-- Default Button -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Default Button</h2>
    <div class="space-y-4">
        <div class="inline-flex flex-wrap gap-3">
          <button
            fiboButton
            (click)="onButtonClick('Default')">
            Default Button
          </button>

          <button
            fiboButton
            disabled
            (click)="onButtonClick('Default Disabled')">
            Default Disabled
          </button>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            fiboButton
            (click)="onButtonClick('Default with Icon')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            With Icon
          </button>

          <button
            fiboButton
            disabled
            (click)="onButtonClick('Default with Icon Disabled')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            With Icon Disabled
          </button>
        </div>
      </div>

    </div>

    <!-- Primary Button -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Primary Button</h2>

      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="primary"
            (click)="onButtonClick('Primary')">
            Primary Button
          </button>

          <button
            fiboButton fiboAppearance="primary"
            disabled
            (click)="onButtonClick('Primary Disabled')">
            Primary Disabled
          </button>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="primary"
            (click)="onButtonClick('Primary with Icon')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Save Changes
          </button>

          <button
            fiboButton fiboAppearance="primary"
            disabled
            (click)="onButtonClick('Primary with Icon Disabled')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Save Disabled
          </button>
        </div>
      </div>
    </div>

    <!-- Secondary Button -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Secondary Button</h2>

      <div class="flex flex-wrap gap-3">
        <button
          fiboButton fiboAppearance="secondary"
          (click)="onButtonClick('Secondary')">
          Secondary Button
        </button>

        <button
          fiboButton fiboAppearance="secondary"
          disabled
          (click)="onButtonClick('Secondary Disabled')">
          Secondary Disabled
        </button>
      </div>
    </div>

    <!-- Danger Button -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Danger Button</h2>

      <div class="flex flex-wrap gap-3">
        <button
          fiboButton fiboAppearance="danger"
          (click)="onButtonClick('Danger')">
          Delete
        </button>

        <button
          fiboButton fiboAppearance="danger"
          disabled
          (click)="onButtonClick('Danger Disabled')">
          Delete Disabled
        </button>
      </div>
    </div>

    <!-- Inverse Button -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Inverse Button</h2>

      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="inverse"
            (click)="onButtonClick('Inverse')">
            Inverse Button
          </button>

          <button
            fiboButton fiboAppearance="inverse"
            disabled
            (click)="onButtonClick('Inverse Disabled')">
            Inverse Disabled
          </button>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="inverse"
            (click)="onButtonClick('Inverse with Icon')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Toggle Theme
          </button>

          <button
            fiboButton fiboAppearance="inverse"
            disabled
            (click)="onButtonClick('Inverse with Icon Disabled')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Theme Disabled
          </button>
        </div>
      </div>

    </div>

    <!-- Chip Button -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Chip Button</h2>

      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="chip"
            (click)="onButtonClick('Chip')">
            Chip Button
          </button>

          <button
            fiboButton fiboAppearance="chip"
            disabled
            (click)="onButtonClick('Chip Disabled')">
            Chip Disabled
          </button>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="chip"
            (click)="onButtonClick('Chip with Icon')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Remove Tag
          </button>

          <button
            fiboButton fiboAppearance="chip"
            disabled
            (click)="onButtonClick('Chip with Icon Disabled')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Remove Disabled
          </button>
        </div>
      </div>
    </div>

    <!-- Text Button -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Text Button</h2>

      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="text"
            (click)="onButtonClick('Text')">
            Text Button
          </button>

          <button
            fiboButton fiboAppearance="text"
            disabled
            (click)="onButtonClick('Text Disabled')">
            Text Disabled
          </button>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="text"
            (click)="onButtonClick('Text with Icon')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            External Link
          </button>

          <button
            fiboButton fiboAppearance="text"
            disabled
            (click)="onButtonClick('Text with Icon Disabled')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Link Disabled
          </button>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            fiboButton fiboAppearance="text" class="rounded-full p-1"
            aria-label="External Link"
            (click)="onButtonClick('Text Icon Only')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </button>

          <button
            fiboButton fiboAppearance="text" class="rounded-full p-1.5"
            disabled
            aria-label="External Link Disabled"
            (click)="onButtonClick('Text Icon Only Disabled')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </button>
        </div>
      </div>

    </div>

    <!-- Button Sizes -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Button Sizes</h2>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium mb-2">Small (sm)</h3>
          <div class="flex flex-wrap gap-3 items-center">
            <button fiboButton fiboSize="sm" (click)="onButtonClick('Small Default')">Small Button</button>
            <button fiboButton fiboAppearance="primary" fiboSize="sm" (click)="onButtonClick('Small Primary')">Small Primary</button>
            <button fiboButton fiboAppearance="chip" fiboSize="sm" (click)="onButtonClick('Small Chip')">Small Chip</button>
            <button fiboButton fiboAppearance="inverse" fiboSize="sm" (click)="onButtonClick('Small Inverse')">Small Inverse</button>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2">Default (md)</h3>
          <div class="flex flex-wrap gap-3 items-center">
            <button fiboButton (click)="onButtonClick('Default Size')">Default Button</button>
            <button fiboButton fiboAppearance="primary" (click)="onButtonClick('Default Primary')">Default Primary</button>
            <button fiboButton fiboAppearance="chip" (click)="onButtonClick('Default Chip')">Default Chip</button>
            <button fiboButton fiboAppearance="inverse" (click)="onButtonClick('Default Inverse')">Default Inverse</button>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2">Large (lg)</h3>
          <div class="flex flex-wrap gap-3 items-center">
            <button fiboButton fiboSize="lg" (click)="onButtonClick('Large Default')">Large Button</button>
            <button fiboButton fiboAppearance="primary" fiboSize="lg" (click)="onButtonClick('Large Primary')">Large Primary</button>
            <button fiboButton fiboAppearance="chip" fiboSize="lg" (click)="onButtonClick('Large Chip')">Large Chip</button>
            <button fiboButton fiboAppearance="inverse" fiboSize="lg" (click)="onButtonClick('Large Inverse')">Large Inverse</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage Examples -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Usage Examples</h2>

      <div class="space-y-6">
        <!-- Action Buttons -->
        <div>
          <h3 class="text-sm font-medium mb-3">Action Buttons</h3>
          <div class="flex flex-wrap gap-3">
            <button
              fiboButton fiboAppearance="primary"
              (click)="onButtonClick('Save')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Save
            </button>

            <button
              fiboButton fiboAppearance="inverse"
              (click)="onButtonClick('Cancel')">
              Cancel
            </button>

            <button
              fiboButton fiboAppearance="text" class="text-red-600 hover:bg-red-50"
              (click)="onButtonClick('Delete')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>

        <!-- Filter Tags -->
        <div>
          <h3 class="text-sm font-medium mb-3">Filter Tags</h3>
          <div class="flex flex-wrap gap-2">
            <button fiboButton fiboAppearance="chip" (click)="onButtonClick('Remove Tag')">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Active
            </button>

            <button fiboButton fiboAppearance="chip" (click)="onButtonClick('Remove Tag')">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Featured
            </button>

            <button fiboButton fiboAppearance="chip" (click)="onButtonClick('Remove Tag')">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              New
            </button>
          </div>
        </div>

        <!-- Navigation Links -->
        <div>
          <h3 class="text-sm font-medium mb-3">Navigation Links</h3>
          <div class="flex flex-wrap gap-3">
            <button fiboButton fiboAppearance="text" (click)="onButtonClick('View Details')">
              View Details
            </button>

            <button fiboButton fiboAppearance="text" (click)="onButtonClick('Edit')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </button>

            <button fiboButton fiboAppearance="text" (click)="onButtonClick('Share')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage Instructions -->
    <div class="fibo-card rounded-lg p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold tracking-tight">Usage</h2>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium mb-2">Basic Usage</h3>
          <pre class="fibo-card rounded p-3 text-xs overflow-x-auto"><code>&lt;button fiboButton&gt;Default Button&lt;/button&gt;
&lt;button fiboButton fiboAppearance="primary"&gt;Primary Button&lt;/button&gt;
&lt;button fiboButton fiboAppearance="inverse"&gt;Inverse Button&lt;/button&gt;
&lt;button fiboButton fiboAppearance="chip"&gt;Chip Button&lt;/button&gt;
&lt;button fiboButton fiboAppearance="text"&gt;Text Button&lt;/button&gt;</code></pre>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2">Sizes</h3>
          <pre class="fibo-card rounded p-3 text-xs overflow-x-auto"><code>&lt;button fiboButton fiboSize="sm"&gt;Small&lt;/button&gt;
&lt;button fiboButton&gt;Default (md)&lt;/button&gt;
&lt;button fiboButton fiboSize="lg"&gt;Large&lt;/button&gt;</code></pre>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2">Disabled State</h3>
          <pre class="fibo-card rounded p-3 text-xs overflow-x-auto"><code>&lt;button fiboButton disabled&gt;Disabled Button&lt;/button&gt;
&lt;button fiboButton fiboAppearance="primary" disabled&gt;Disabled Primary&lt;/button&gt;</code></pre>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
})
export class ButtonDemoPageComponent {

  onButtonClick(type: string) {
    console.log(`${type} button clicked`);
  }
}
