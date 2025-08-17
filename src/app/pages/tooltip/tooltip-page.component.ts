import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Tooltip} from '@fibo-ui/components';

@Component({
  standalone: true,
  imports: [CommonModule, Tooltip],
  templateUrl: './tooltip-page.component.html',
})
export class TooltipPageComponent {}
