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
    <div class="max-w-6xl mx-auto p-6 space-y-2">
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

      <!-- Text Colors on Background Tokens -->
      <div class="p-6 rounded-lg fibo-card space-y-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Text Colors</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Background: background -->
          <div class="rounded-lg p-4 bg-background outline -outline-offset-1 outline-black/10 space-y-2">
            <div class="text-xs font-mono text-gray-600 dark:text-gray-400 mb-2">bg-background</div>
            <p class="text-sm text-foreground">text-foreground</p>
            <p class="text-sm text-foreground-secondary">text-foreground-secondary</p>
            <p class="text-sm text-foreground-tertiary">text-foreground-tertiary</p>
            <p class="text-sm text-foreground-inverse">text-foreground-inverse</p>
            <p class="text-sm text-primary">text-primary</p>
            <p class="text-sm text-primary-600">text-primary-600</p>
          </div>

          <!-- Background: background-secondary -->
          <div class="rounded-lg p-4 bg-background-secondary outline -outline-offset-1 outline-black/10 space-y-2">
            <div class="text-xs font-mono text-gray-600 dark:text-gray-400 mb-2">bg-background-secondary</div>
            <p class="text-sm text-foreground">text-foreground</p>
            <p class="text-sm text-foreground-secondary">text-foreground-secondary</p>
            <p class="text-sm text-foreground-tertiary">text-foreground-tertiary</p>
            <p class="text-sm text-foreground-inverse">text-foreground-inverse</p>
            <p class="text-sm text-primary">text-primary</p>
            <p class="text-sm text-primary-600">text-primary-600</p>
          </div>

          <!-- Background: background-tertiary -->
          <div class="rounded-lg p-4 bg-background-tertiary outline -outline-offset-1 outline-black/10 space-y-2">
            <div class="text-xs font-mono text-gray-600 dark:text-gray-400 mb-2">bg-background-tertiary</div>
            <p class="text-sm text-foreground">text-foreground</p>
            <p class="text-sm text-foreground-secondary">text-foreground-secondary</p>
            <p class="text-sm text-foreground-tertiary">text-foreground-tertiary</p>
            <p class="text-sm text-foreground-inverse">text-foreground-inverse</p>
            <p class="text-sm text-primary">text-primary</p>
            <p class="text-sm text-primary-600">text-primary-600</p>
          </div>
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

        <!-- Border Examples -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Border Examples</h4>
          <div class="grid grid-cols-11 gap-2">
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-50 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">50</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-100 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">100</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-200 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">200</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-300 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">300</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-400 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">400</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-500 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">500</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-600 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">600</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-700 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">700</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-800 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">800</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-900 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">900</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-primary-950 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">950</span>
            </div>
          </div>
        </div>

        <!-- Text Examples -->
        <div class="mt-6 space-y-4">
          <h4 class="text-md font-medium text-gray-700 dark:text-gray-300">Text Examples</h4>
          <div class="space-y-2">
            <p class="text-sm text-primary-50">Text with primary-50 color</p>
            <p class="text-sm text-primary-100">Text with primary-100 color</p>
            <p class="text-sm text-primary-200">Text with primary-200 color</p>
            <p class="text-sm text-primary-300">Text with primary-300 color</p>
            <p class="text-sm text-primary-400">Text with primary-400 color</p>
            <p class="text-sm text-primary-500">Text with primary-500 color</p>
            <p class="text-sm text-primary-600">Text with primary-600 color</p>
            <p class="text-sm text-primary-700">Text with primary-700 color</p>
            <p class="text-sm text-primary-800">Text with primary-800 color</p>
            <p class="text-sm text-primary-900">Text with primary-900 color</p>
            <p class="text-sm text-primary-950">Text with primary-950 color</p>
          </div>
        </div>
      </div>

      \n
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

        <!-- Border Examples -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Border Examples</h4>
          <div class="grid grid-cols-11 gap-2">
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-50 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">50</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-100 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">100</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-200 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">200</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-300 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">300</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-400 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">400</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-500 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">500</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-600 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">600</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-700 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">700</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-800 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">800</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-900 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">900</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-gray-950 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">950</span>
            </div>
          </div>
        </div>

        <!-- Text Examples -->
        <div class="mt-6 space-y-4">
          <h4 class="text-md font-medium text-gray-700 dark:text-gray-300">Text Examples</h4>
          <div class="space-y-2">
            <p class="text-sm text-gray-50">Text with gray-50 color</p>
            <p class="text-sm text-gray-100">Text with gray-100 color</p>
            <p class="text-sm text-gray-200">Text with gray-200 color</p>
            <p class="text-sm text-gray-300">Text with gray-300 color</p>
            <p class="text-sm text-gray-400">Text with gray-400 color</p>
            <p class="text-sm text-gray-500">Text with gray-500 color</p>
            <p class="text-sm text-gray-600">Text with gray-600 color</p>
            <p class="text-sm text-gray-700">Text with gray-700 color</p>
            <p class="text-sm text-gray-800">Text with gray-800 color</p>
            <p class="text-sm text-gray-900">Text with gray-900 color</p>
            <p class="text-sm text-gray-950">Text with gray-950 color</p>
          </div>
        </div>
      </div>

      \n
      <!-- Zinc Colors -->
      <div class="p-6 rounded-lg fibo-card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Zinc Colors</h3>
        <div class="grid grid-cols-11 gap-2">
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-50 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">50</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-100 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">100</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-200 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">200</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-300 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">300</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-400 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">400</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-500 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">500</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-600 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">600</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-700 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">700</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-800 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">800</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-900 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">900</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-zinc-950 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">950</span>
          </div>
        </div>

        <!-- Border Examples -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Border Examples</h4>
          <div class="grid grid-cols-11 gap-2">
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-50 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">50</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-100 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">100</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-200 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">200</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-300 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">300</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-400 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">400</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-500 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">500</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-600 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">600</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-700 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">700</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-800 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">800</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-900 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">900</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-zinc-950 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">950</span>
            </div>
          </div>
        </div>

        <!-- Text Examples -->
        <div class="mt-6 space-y-4">
          <h4 class="text-md font-medium text-gray-700 dark:text-gray-300">Text Examples</h4>
          <div class="space-y-2">
            <p class="text-sm text-zinc-50">Text with zinc-50 color</p>
            <p class="text-sm text-zinc-100">Text with zinc-100 color</p>
            <p class="text-sm text-zinc-200">Text with zinc-200 color</p>
            <p class="text-sm text-zinc-300">Text with zinc-300 color</p>
            <p class="text-sm text-zinc-400">Text with zinc-400 color</p>
            <p class="text-sm text-zinc-500">Text with zinc-500 color</p>
            <p class="text-sm text-zinc-600">Text with zinc-600 color</p>
            <p class="text-sm text-zinc-700">Text with zinc-700 color</p>
            <p class="text-sm text-zinc-800">Text with zinc-800 color</p>
            <p class="text-sm text-zinc-900">Text with zinc-900 color</p>
            <p class="text-sm text-zinc-950">Text with zinc-950 color</p>
          </div>
        </div>
      </div>

      \n
      <!-- Neutral Colors -->
      <div class="p-6 rounded-lg fibo-card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Neutral Colors</h3>
        <div class="grid grid-cols-11 gap-2">
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-50 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">50</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-100 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">100</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-200 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">200</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-300 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">300</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-400 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">400</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-500 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">500</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-600 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">600</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-700 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">700</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-800 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">800</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-900 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">900</span>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-neutral-950 rounded outline -outline-offset-1 outline-black/10 mb-1 mx-auto"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">950</span>
          </div>
        </div>

        <!-- Border Examples -->
        <div class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Border Examples</h4>
          <div class="grid grid-cols-11 gap-2">
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-50 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">50</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-100 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">100</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-200 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">200</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-300 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">300</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-400 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">400</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-500 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">500</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-600 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">600</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-700 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">700</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-800 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">800</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-900 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">900</span>
            </div>
            <div class="text-center">
              <div class="w-12 h-12 bg-transparent border border-neutral-950 rounded mb-1 mx-auto"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">950</span>
            </div>
          </div>
        </div>

        <!-- Text Examples -->
        <div class="mt-6 space-y-4">
          <h4 class="text-md font-medium text-gray-700 dark:text-gray-300">Text Examples</h4>
          <div class="space-y-2">
            <p class="text-sm text-neutral-50">Text with neutral-50 color</p>
            <p class="text-sm text-neutral-100">Text with neutral-100 color</p>
            <p class="text-sm text-neutral-200">Text with neutral-200 color</p>
            <p class="text-sm text-neutral-300">Text with neutral-300 color</p>
            <p class="text-sm text-neutral-400">Text with neutral-400 color</p>
            <p class="text-sm text-neutral-500">Text with neutral-500 color</p>
            <p class="text-sm text-neutral-600">Text with neutral-600 color</p>
            <p class="text-sm text-neutral-700">Text with neutral-700 color</p>
            <p class="text-sm text-neutral-800">Text with neutral-800 color</p>
            <p class="text-sm text-neutral-900">Text with neutral-900 color</p>
            <p class="text-sm text-neutral-950">Text with neutral-950 color</p>
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
