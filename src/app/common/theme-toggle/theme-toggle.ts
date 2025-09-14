import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2 ">
      <button
        type="button"
        class="btn rounded-full h-7 p-1.5"
        [class.btn-text]="theme() !== 'light'"
        [class.btn-chip]="theme() === 'light'"
        (click)="setTheme('light')"
        title="Light theme"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M12 5.25V3m0 0h2.25M12 3h-2.25" />
        </svg>
      </button>

      <button
        type="button"
        class="btn rounded-full h-7 p-1.5"
        [class.btn-text]="theme() !== 'dark'"
        [class.btn-chip]="theme() === 'dark'"
        (click)="setTheme('dark')"
        title="Dark theme"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      </button>

      <button
        type="button"
        class="btn rounded-full h-7 p-1.5"
        [class.btn-text]="theme() !== 'system'"
        [class.btn-chip]="theme() === 'system'"
        (click)="setTheme('system')"
        title="System theme"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
        </svg>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
