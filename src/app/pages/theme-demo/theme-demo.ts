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
          JetBrains New UI Dark Theme Demo
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          This page demonstrates the JetBrains New UI Dark Theme color palette and design patterns. Use the theme toggle to switch between light, dark, and system themes.
        </p>

        <div class="flex justify-center mb-8">
          <app-theme-toggle></app-theme-toggle>
        </div>

        <div class="text-sm text-gray-500 dark:text-gray-400">
          Current theme: <span class="font-mono">{{ themeService.theme() }}</span>
        </div>
      </div>

      <!-- JetBrains New UI Color Palette -->
      <div class="space-y-8">
        <!-- Primary Brand Colors -->
        <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains Brand Colors</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="w-16 h-16 bg-[#365880] dark:bg-[#4c708c] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Primary Blue</span>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#2f3337] dark:bg-[#3c3f41] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Panel BG</span>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#4c708c] dark:bg-[#5c7c8c] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Accent Blue</span>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#323232] dark:bg-[#2b2b2b] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Main BG</span>
            </div>
          </div>
        </div>

        <!-- JetBrains Gray Scale -->
        <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains Gray Scale</h3>
          <div class="grid grid-cols-2 md:grid-cols-8 gap-2">
            <div class="text-center">
              <div class="w-8 h-8 bg-[#ffffff] dark:bg-[#ffffff] rounded border border-[#3c3f41] mb-1 mx-auto"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#fff</span>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-[#f5f5f5] dark:bg-[#f5f5f5] rounded border border-[#3c3f41] mb-1 mx-auto"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#f5f5f5</span>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-[#e8e8e8] dark:bg-[#e8e8e8] rounded border border-[#3c3f41] mb-1 mx-auto"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#e8e8e8</span>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-[#d4d4d4] dark:bg-[#d4d4d4] rounded border border-[#3c3f41] mb-1 mx-auto"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#d4d4d4</span>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-[#a9b7c6] dark:bg-[#a9b7c6] rounded border border-[#3c3f41] mb-1 mx-auto"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#a9b7c6</span>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-[#787878] dark:bg-[#787878] rounded border border-[#3c3f41] mb-1 mx-auto"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#787878</span>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-[#3c3f41] dark:bg-[#3c3f41] rounded border border-[#3c3f41] mb-1 mx-auto"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#3c3f41</span>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-[#2b2b2b] dark:bg-[#2b2b2b] rounded border border-[#3c3f41] mb-1 mx-auto"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#2b2b2b</span>
            </div>
          </div>
        </div>

        <!-- JetBrains Syntax Highlighting Colors -->
        <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains Syntax Highlighting</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="w-16 h-16 bg-[#ffc66d] dark:bg-[#ffc66d] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Keywords</span>
              <div class="text-xs text-slate-500 dark:text-[#787878]">#ffc66d</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#6a8759] dark:bg-[#6a8759] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Strings</span>
              <div class="text-xs text-slate-500 dark:text-[#787878]">#6a8759</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#6897bb] dark:bg-[#6897bb] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Numbers</span>
              <div class="text-xs text-slate-500 dark:text-[#787878]">#6897bb</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#808080] dark:bg-[#808080] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Comments</span>
              <div class="text-xs text-slate-500 dark:text-[#787878]">#808080</div>
            </div>
          </div>
        </div>

        <!-- JetBrains UI Element Colors -->
        <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains UI Elements</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="w-16 h-16 bg-[#4c708c] dark:bg-[#4c708c] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Selection</span>
              <div class="text-xs text-slate-500 dark:text-[#787878]">#4c708c</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#3c3f41] dark:bg-[#3c3f41] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Borders</span>
              <div class="text-xs text-slate-500 dark:text-[#787878]">#3c3f41</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#365880] dark:bg-[#365880] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Focus</span>
              <div class="text-xs text-slate-500 dark:text-[#787878]">#365880</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-[#2f3337] dark:bg-[#2f3337] rounded-lg mb-2 mx-auto shadow-sm border border-[#3c3f41]"></div>
              <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">Panels</span>
              <div class="text-xs text-slate-500 dark:text-[#787878]">#2f3337</div>
            </div>
          </div>
        </div>
      </div>

      <!-- JetBrains Code Editor Block -->
      <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains Code Editor</h3>
        <div class="bg-[#2b2b2b] dark:bg-[#2b2b2b] rounded-lg border border-[#3c3f41] overflow-hidden">
          <!-- Editor Header -->
          <div class="bg-[#3c3f41] dark:bg-[#3c3f41] px-4 py-2 border-b border-[#3c3f41]">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-[#ff5f56] rounded-full"></div>
              <div class="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
              <div class="w-3 h-3 bg-[#27ca3f] rounded-full"></div>
              <span class="text-[#a9b7c6] text-sm ml-4 font-mono">main.ts</span>
            </div>
          </div>

          <!-- Editor Content -->
          <div class="p-4 font-mono text-sm">
            <div class="flex">
              <!-- Line Numbers -->
              <div class="text-[#787878] mr-4 select-none">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
              </div>

              <!-- Code -->
              <div class="text-[#a9b7c6]">
                <div><span class="text-[#ffc66d]">import</span> &#123; <span class="text-[#a9b7c6]">Component</span> &#125; <span class="text-[#ffc66d]">from</span> <span class="text-[#6a8759]">'@angular/core'</span>;</div>
                <div></div>
                <div><span class="text-[#ffc66d]">@Component</span>(&#123;)</div>
                <div>  <span class="text-[#a9b7c6]">selector</span>: <span class="text-[#6a8759]">'app-root'</span>,</div>
                <div>  <span class="text-[#a9b7c6]">template</span>: <span class="text-[#6a8759]">'&lt;router-outlet&gt;&lt;/router-outlet&gt;'</span></div>
                <div>&#125;)</div>
                <div><span class="text-[#ffc66d]">export class</span> <span class="text-[#a9b7c6]">AppComponent</span> &#123; &#125;</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- JetBrains Toolbar & Status Bar -->
      <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains Toolbar & Status Bar</h3>
        <div class="space-y-4">
          <!-- Toolbar -->
          <div class="bg-[#3c3f41] dark:bg-[#3c3f41] px-4 py-3 rounded-lg border border-[#3c3f41]">
            <div class="flex items-center gap-4">
              <div class="w-6 h-6 bg-[#4c708c] rounded"></div>
              <div class="w-6 h-6 bg-[#4c708c] rounded"></div>
              <div class="w-6 h-6 bg-[#4c708c] rounded"></div>
              <div class="w-px h-6 bg-[#3c3f41]"></div>
              <div class="w-6 h-6 bg-[#4c708c] rounded"></div>
              <div class="w-6 h-6 bg-[#4c708c] rounded"></div>
            </div>
            <div class="text-[#a9b7c6] text-sm mt-2">Toolbar with JetBrains styling</div>
          </div>

          <!-- Status Bar -->
          <div class="bg-[#2f3337] dark:bg-[#2f3337] px-4 py-2 rounded-lg border border-[#3c3f41]">
            <div class="flex items-center justify-between text-[#a9b7c6] text-sm">
              <div class="flex items-center gap-4">
                <span>Ready</span>
                <span class="text-[#787878]">|</span>
                <span>TypeScript 5.0</span>
                <span class="text-[#787878]">|</span>
                <span>Angular 17</span>
              </div>
              <div class="flex items-center gap-4">
                <span>Ln 8, Col 45</span>
                <span class="text-[#787878]">|</span>
                <span>UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- JetBrains Sidebar Panels -->
      <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains Sidebar Panels</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Project Panel -->
          <div class="bg-[#2f3337] dark:bg-[#2f3337] rounded-lg border border-[#3c3f41]">
            <div class="bg-[#3c3f41] dark:bg-[#3c3f41] px-3 py-2 rounded-t-lg border-b border-[#3c3f41]">
              <span class="text-[#a9b7c6] text-sm font-medium">Project</span>
            </div>
            <div class="p-3 text-[#a9b7c6] text-sm">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 bg-[#4c708c] rounded"></div>
                <span>src/</span>
              </div>
              <div class="flex items-center gap-2 mb-2 ml-4">
                <div class="w-3 h-3 bg-[#4c708c] rounded"></div>
                <span>app/</span>
              </div>
              <div class="flex items-center gap-2 mb-2 ml-8">
                <div class="w-3 h-3 bg-[#4c708c] rounded"></div>
                <span>main.ts</span>
              </div>
            </div>
          </div>

          <!-- Structure Panel -->
          <div class="bg-[#2f3337] dark:bg-[#2f3337] rounded-lg border border-[#3c3f41]">
            <div class="bg-[#3c3f41] dark:bg-[#3c3f41] px-3 py-2 rounded-t-lg border-b border-[#3c3f41]">
              <span class="text-[#a9b7c6] text-sm font-medium">Structure</span>
            </div>
            <div class="p-3 text-[#a9b7c6] text-sm">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 bg-[#ffc66d] rounded"></div>
                <span>AppComponent</span>
              </div>
              <div class="flex items-center gap-2 mb-2 ml-4">
                <div class="w-3 h-3 bg-[#a9b7c6] rounded"></div>
                <span>constructor()</span>
              </div>
            </div>
          </div>

          <!-- Problems Panel -->
          <div class="bg-[#2f3337] dark:bg-[#2f3337] rounded-lg border border-[#3c3f41]">
            <div class="bg-[#3c3f41] dark:bg-[#3c3f41] px-3 py-2 rounded-t-lg border-b border-[#3c3f41]">
              <span class="text-[#a9b7c6] text-sm font-medium">Problems</span>
            </div>
            <div class="p-3 text-[#a9b7c6] text-sm">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 bg-[#6a8759] rounded"></div>
                <span>0 errors</span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 bg-[#ffc66d] rounded"></div>
                <span>0 warnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- JetBrains Form Elements -->
      <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains Form Elements</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-[#a9b7c6] mb-2">
              Text Input
            </label>
            <input
              type="text"
              placeholder="Enter text here"
              class="w-full px-3 py-2.5 border border-[#3c3f41] dark:border-[#3c3f41] rounded-lg bg-[#2f3337] dark:bg-[#2f3337] text-[#a9b7c6] focus:outline-none focus:ring-2 focus:ring-[#365880] focus:border-[#365880] placeholder-[#787878] dark:placeholder-[#787878]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-[#a9b7c6] mb-2">
              Select Dropdown
            </label>
            <select class="w-full px-3 py-2.5 border border-[#3c3f41] dark:border-[#3c3f41] rounded-lg bg-[#2f3337] dark:bg-[#2f3337] text-[#a9b7c6] focus:outline-none focus:ring-2 focus:ring-[#365880] focus:border-[#365880]">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      </div>

      <!-- JetBrains Buttons -->
      <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">JetBrains Buttons</h3>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3">
            <button class="px-4 py-2.5 bg-[#4c708c] hover:bg-[#365880] dark:bg-[#4c708c] dark:hover:bg-[#365880] text-white rounded-lg transition-colors font-medium shadow-sm">
              Primary Button
            </button>
            <button class="px-4 py-2.5 bg-[#2f3337] dark:bg-[#2f3337] hover:bg-[#3c3f41] dark:hover:bg-[#3c3f41] text-[#a9b7c6] rounded-lg transition-colors font-medium border border-[#3c3f41]">
              Secondary Button
            </button>
            <button class="px-4 py-2.5 border border-[#3c3f41] dark:border-[#3c3f41] hover:bg-[#2f3337] dark:hover:bg-[#2f3337] text-[#a9b7c6] rounded-lg transition-colors font-medium">
              Outline Button
            </button>
          </div>

          <div class="flex flex-wrap gap-3">
            <button class="px-4 py-2.5 bg-[#6a8759] hover:bg-[#5a7a4a] dark:bg-[#6a8759] dark:hover:bg-[#5a7a4a] text-white rounded-lg transition-colors font-medium shadow-sm">
              Success Button
            </button>
            <button class="px-4 py-2.5 bg-[#a73737] hover:bg-[#8f2f2f] dark:bg-[#a73737] dark:hover:bg-[#8f2f2f] text-white rounded-lg transition-colors font-medium shadow-sm">
              Danger Button
            </button>
            <button class="px-4 py-2.5 bg-[#ffc66d] hover:bg-[#e6b35a] dark:bg-[#ffc66d] dark:hover:bg-[#e6b35a] text-[#2b2b2b] rounded-lg transition-colors font-medium shadow-sm">
              Warning Button
            </button>
          </div>
        </div>
      </div>

      <!-- JetBrains Color Palette Reference -->
      <div class="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-slate-200 dark:border-[#3c3f41]">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-[#a9b7c6] mb-4">Complete JetBrains Color Palette</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-slate-700 dark:text-[#a9b7c6]">Backgrounds</h4>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#2b2b2b] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#2b2b2b</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#2f3337] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#2f3337</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#3c3f41] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#3c3f41</span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-sm font-medium text-slate-700 dark:text-[#a9b7c6]">Text Colors</h4>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#a9b7c6] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#a9b7c6</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#787878] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#787878</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#5c7c8c] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#5c7c8c</span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-sm font-medium text-slate-700 dark:text-[#a9b7c6]">Accent Colors</h4>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#4c708c] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#4c708c</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#365880] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#365880</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#5c7c8c] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#5c7c8c</span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-sm font-medium text-slate-700 dark:text-[#a9b7c6]">Syntax Colors</h4>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#ffc66d] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#ffc66d</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#6a8759] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#6a8759</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-[#6897bb] rounded border border-[#3c3f41]"></div>
                <span class="text-xs text-slate-600 dark:text-[#787878] font-mono">#6897bb</span>
              </div>
            </div>
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
