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
import { ClickOutside } from 'ngxtension/click-outside';
import { CommonModule } from '@angular/common';
import {DialogService} from './dialog-service';
@Component({
  selector: 'sui-dialog',
  standalone: true,
  imports: [ClickOutside,  NgTemplateOutlet, CommonModule],
  templateUrl: './dialog.html',

})
export class SuiDialog {
  state = inject(DialogService)

  isDrawerMode = computed(()=> !!this.state.config() && this.state.config()?.mode === 'drawer' );

}
