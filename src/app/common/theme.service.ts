import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'fibo-theme';
  
  // Current theme preference
  private readonly _theme = signal<Theme>(this.getInitialTheme());
  
  // Computed value for the actual applied theme (handles system preference)
  readonly appliedTheme = computed(() => {
    const theme = this._theme();
    if (theme === 'system') {
      return this.getSystemTheme();
    }
    return theme;
  });
  
  // Expose the current theme preference
  readonly theme = this._theme.asReadonly();
  
  constructor() {
    // Effect to apply theme changes to the document
    effect(() => {
      const theme = this.appliedTheme();
      this.applyTheme(theme);
    });
    
    // Listen for system theme changes
    this.setupSystemThemeListener();
  }
  
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem(this.themeKey, theme);
  }
  
  toggleTheme(): void {
    const current = this._theme();
    const newTheme: Theme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  private getInitialTheme(): Theme {
    const saved = localStorage.getItem(this.themeKey);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'system';
  }
  
  private getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  private applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }
  
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (this._theme() === 'system') {
        // Trigger effect to update applied theme
        this._theme.update(current => current);
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
  }
}
