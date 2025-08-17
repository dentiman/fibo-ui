import {Component, OnInit} from '@angular/core';
import {OverlayTrigger, FiboDialog, Popover, DialogTrigger} from '@fibo-ui/components';
import {RouterLink} from '@angular/router';
import {SelectPageComponent} from '../select/select-page';
import {JsonPipe} from '@angular/common';

@Component({
  imports: [
    OverlayTrigger,
    Popover,
    RouterLink,
    FiboDialog,
    SelectPageComponent,
    JsonPipe,
    DialogTrigger
  ],
  templateUrl: './dialog-page.html',

})
export class DialogPageComponent {




}
