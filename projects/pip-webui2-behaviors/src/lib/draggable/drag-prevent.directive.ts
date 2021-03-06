import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[pipDragPrevent]',
})
export class PipDragPreventDirective implements AfterViewInit {
    constructor(
        private elRef: ElementRef,
        private renderer: Renderer2
    ) { }

    ngAfterViewInit() {
        this.renderer.setAttribute(this.elRef.nativeElement, 'pipDraggable', 'false');
    }

    private toggleListeners(enable) {
        // remove listeners
        if (!enable) {
            return;
        }
        // add listeners.
        // add listeners.
        this.renderer.listen(this.elRef.nativeElement,
            'mousedown touchstart touchmove touchend touchcancel', (event) => { this.absorbEvent_(event); });
    }

    private absorbEvent_(event) {
        const e = event.originalEvent;
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
}
