import {AfterContentInit, Directive, ElementRef, inject, OnInit} from '@angular/core';

@Directive({selector: '[suiAutoFocus]'})
export class AutoFocus implements AfterContentInit {
    element = inject(ElementRef<HTMLInputElement>).nativeElement;

    ngAfterContentInit() {
        setTimeout(() => this.element.focus(), 10);
    }
}
