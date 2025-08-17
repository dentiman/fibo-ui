import {Component, OnInit} from '@angular/core';
import {OverlayTrigger, SuiDialog, Popover, DialogTrigger} from '@spacy-ui/components';
import {RouterLink} from '@angular/router';
import {SelectPageComponent} from '../select/select-page.component';
import {JsonPipe} from '@angular/common';

@Component({
  imports: [
    OverlayTrigger,
    Popover,
    RouterLink,
    SuiDialog,
    SelectPageComponent,
    JsonPipe,
    DialogTrigger
  ],
  templateUrl: './dialog-page.component.html',

})
export class DialogPageComponent {




}
