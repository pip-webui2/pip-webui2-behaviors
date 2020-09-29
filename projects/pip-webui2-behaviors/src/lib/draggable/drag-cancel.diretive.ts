import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[pipDragCancel]',
})
export class PipDragCancelDirective implements AfterViewInit {
    constructor(
        private elRef: ElementRef,
        private renderer: Renderer2
    ) {}

    ngAfterViewInit() {
        const elements = this.elRef.nativeElement.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            this.renderer.setAttribute(elements[i], 'pip-drag-cancel', 'pip-drag-cancel');
        }
    }
}
