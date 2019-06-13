import { Directive, ElementRef, HostListener, Renderer, Host, Input } from '@angular/core';
import { PipSelectableComponent } from './selectable.component';

@Directive({
    selector: '[pipSelectable]'
})
export class PipSelectableDirective {
    private _class = 'pip-selectable';
    private _value: any;

    @Input() set pipSelectable(className: string) {
        if (className) {
            this._class = className;
            this.setClass();
        }
    }

    @Input() set pipSelectableValue(value: any) {
        this._value = value;
    }

    constructor(
        public elRef: ElementRef,
        private renderer: Renderer,
        @Host() private selectable: PipSelectableComponent
    ) {
        this.setClass();
    }

    private setClass() {
        this.renderer.setElementClass(this.elRef.nativeElement, this._class, true);
    }

    public get value(): any {
        return this._value;
    }

    @HostListener('click') click() {
        if (this.selectable) {
            this.selectable.onClickEvent(this.elRef);
        }
    }
}
