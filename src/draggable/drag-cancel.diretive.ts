import * as _ from 'lodash';
import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy, Renderer, Host, Input, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[pipDragCancel]',
    /*host: {
        '(click)': 'click()',
        '(keypress)': 'keydown()'
    }*/
})
export class PipDragCancelDirective implements AfterViewInit { 
    constructor(
        private elRef: ElementRef,
        private renderer: Renderer
    ) {}

    ngAfterViewInit() {
        let elements = this.elRef.nativeElement.getElementsByTagName('*');

        _.each(elements, (element) => {
            this.renderer.setElementAttribute(element, 'pip-cancel-drag', 'pip-cancel-drag');
        });
    }
}