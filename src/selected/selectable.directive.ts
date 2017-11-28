import { Directive, ElementRef, Renderer, Host, Input } from '@angular/core';
import { PipSelectedComponent } from './selected.component';

@Directive({
    selector: '[pipSelectable]',
    host: {
        '(click)': 'click()',
        '(keypress)': 'keydown()'
    }
})
export class PipSelectableDirective {
    private onClickEvent: Function;
    private _class: string = 'pip-selectable';
    @Input() set pipSelectable(className: string) {
        if (className) {
            this._class = className;
            this.setClass();
        }
    }

    constructor(private elRef: ElementRef, private renderer: Renderer, @Host() selected: PipSelectedComponent) {
        this.setClass();
        this.onClickEvent = selected.onClickEvent;
    }

    private setClass() {
        this.renderer.setElementClass(this.elRef.nativeElement, this._class, true);
    }

    click() {
        this.onClickEvent(this.elRef.nativeElement);
    }

    keydown() {
        console.log('here');
    }

}