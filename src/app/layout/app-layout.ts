import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RootNavComponent } from './root-nav';
import { TooltipContainer } from '@fibo-ui/components';
import { ThemeToggleComponent } from '../common/theme-toggle';
import {FormExamplePageComponent} from '../pages/form-example-page/form-example-page';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RootNavComponent, TooltipContainer, ThemeToggleComponent, FormExamplePageComponent, NgOptimizedImage],
  templateUrl: './app-layout.html',
})
export class AppLayoutComponent {}
