import * as _ from 'lodash';
import { Directive, ElementRef, AfterViewInit, Renderer } from '@angular/core';

@Directive({
    selector: '[pipDragPrevent]',
})
export class PipDragPreventDirective implements AfterViewInit {
    constructor(
        private elRef: ElementRef,
        private renderer: Renderer
    ) { }

    ngAfterViewInit() {
        this.renderer.setElementAttribute(this.elRef.nativeElement, 'pipDraggable', 'false');
    }

    private toggleListeners(enable) {
        // remove listeners
        if (!enable) return;
        // add listeners.
        this.renderer.listen(this.elRef.nativeElement, 'mousedown touchstart touchmove touchend touchcancel',
            (event) => { this.absorbEvent_(event); }
        );
    }

    private absorbEvent_(event) {
        const e = event.originalEvent;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
}