import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Switch } from '@fibo-ui/components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-switch-page',
  standalone: true,
  imports: [
    CommonModule,
    Switch,
    ReactiveFormsModule
  ],
  templateUrl: './switch-page.html',
})
export class SwitchPageComponent {
  // Basic switch states
  basicSwitch = signal(false);
  checkedSwitch = signal(true);
  disabledSwitch = signal(false);
  disabledCheckedSwitch = signal(true);
  loadingSwitch = signal(false);

  // Form control
  formSwitch = new FormControl(false, { validators: Validators.requiredTrue });

  // Settings simulation
  notifications = signal(true);
  darkMode = signal(false);
  autoSave = signal(true);

  // Size examples
  xsSwitch = signal(false);
  smSwitch = signal(true);
  baseSwitch = signal(false);
  lgSwitch = signal(true);
  xlSwitch = signal(false);

  toggleLoading() {
    this.loadingSwitch.update(value => !value);
  }

  onSwitchChange(value: boolean | null, type: string) {
    console.log(`${type} switch changed to:`, value);
  }
}
