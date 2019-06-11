import { Directive, ElementRef, HostListener, Renderer, Host, Input } from '@angular/core';
import { PipSelectableComponent } from './selectable.component';

@Directive({
    selector: '[pipSelectable]'
})
export class PipSelectableDirective {
    private onClickEvent: Function;
    private _class = 'pip-selectable';
    @Input() set pipSelectable(className: string) {
        if (className) {
            this._class = className;
            this.setClass();
        }
    }

    constructor(private elRef: ElementRef, private renderer: Renderer, @Host() selectable: PipSelectableComponent) {
        this.setClass();
        this.onClickEvent = selectable.onClickEvent;
    }

    private setClass() {
        this.renderer.setElementClass(this.elRef.nativeElement, this._class, true);
    }

    @HostListener('click') click() {
        this.onClickEvent(this.elRef.nativeElement);
    }

    @HostListener('keypress') keydown() { }
}
