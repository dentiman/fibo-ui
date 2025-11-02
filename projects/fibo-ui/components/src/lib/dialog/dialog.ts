import {
  Component, computed,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import { CommonModule } from '@angular/common';
import {DialogService} from './dialog-service';
@Component({
  selector: 'fibo-dialog',
  standalone: true,
  imports: [NgTemplateOutlet, CommonModule],
  templateUrl: './dialog.html',

})
export class FiboDialog {
  state = inject(DialogService)

  isDrawerMode = computed(()=> !!this.state.config() && this.state.config()?.mode === 'drawer' );

}
