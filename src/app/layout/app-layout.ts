import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RootNavComponent } from './root-nav';
import { ThemeToggleComponent } from '../common/theme-toggle';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RootNavComponent, ThemeToggleComponent, NgOptimizedImage],
  templateUrl: './app-layout.html',
})
export class AppLayoutComponent {}
