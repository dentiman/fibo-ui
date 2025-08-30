import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RootNavComponent } from './root-nav';
import { TooltipContainer } from '@fibo-ui/components';
import { ThemeToggleComponent } from '../common/theme-toggle';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RootNavComponent, TooltipContainer, ThemeToggleComponent],
  templateUrl: './app-layout.html',
})
export class AppLayoutComponent {}
