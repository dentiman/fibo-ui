import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../common/theme.service';
import { ThemeToggleComponent } from '../../common/theme-toggle';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-theme-demo',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <div class="max-w-6xl mx-auto p-6 space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Color Palette Demo
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          This page demonstrates our custom color palette. Use the theme toggle to switch between light, dark, and system themes.
        </p>

        <div class="flex justify-center mb-8">
          <app-theme-toggle></app-theme-toggle>
        </div>

        <div class="text-sm text-gray-500 dark:text-gray-400">
          Current theme: <span class="font-mono">{{ themeService.theme() }}</span>
        </div>
      </div>

      <!-- Primary Colors -->
      <div class=" p-6 rounded-lg fibo-card  ">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Primary Colors</h3>
        <div class="grid grid-cols-11 gap-2">
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-50 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">50</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-100 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">100</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-200 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">200</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-300 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">300</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-400 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">400</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-500 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">500</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-600 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">600</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-700 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">700</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-800 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">800</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-900 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">900</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-950 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">950</span>
          </div>
        </div>
      </div>

      <!-- Gray Colors -->
      <div class="p-6 rounded-lg fibo-card ">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Gray Colors</h3>
        <div class="grid grid-cols-11 gap-2">
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-50 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">50</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-100 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">100</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-200 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">200</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-300 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">300</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-400 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">400</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-500 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">500</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-600 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">600</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-700 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">700</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-800 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">800</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-900 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">900</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-950 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">950</span>
          </div>
        </div>
      </div>

      <!-- Color Usage Examples -->
      <div class="p-6 rounded-lg fibo-card ">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Color Usage Examples</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Primary Button -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Button</h4>
            <button class="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
              Click me
            </button>
          </div>

          <!-- Secondary Button -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Button</h4>
            <button class="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition-colors">
              Secondary
            </button>
          </div>

          <!-- Input Field -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Input Field</h4>
            <input
              type="text"
              placeholder="Enter text..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>

          <!-- Card -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Card</h4>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 outline -outline-offset-1 outline-black/10 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-300">This is a sample card with our color palette.</p>
            </div>
          </div>

          <!-- Alert -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Alert</h4>
            <div class="p-4 bg-primary-50 dark:bg-primary-900/20 outline -outline-offset-1 outline-primary-200/50 dark:outline-primary-800/50 rounded-lg">
              <p class="text-sm text-primary-800 dark:text-primary-200">This is an informational alert.</p>
            </div>
          </div>

          <!-- Badge -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Badge</h4>
            <span class="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
              New
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeDemoComponent {
  protected readonly themeService = inject(ThemeService);
}
