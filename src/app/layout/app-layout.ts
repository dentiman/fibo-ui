import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RootNavComponent } from './root-nav';
import {TooltipContainer} from '@fibo-ui/components';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RootNavComponent, TooltipContainer],
  templateUrl: './app-layout.html',
})
export class AppLayoutComponent {}
