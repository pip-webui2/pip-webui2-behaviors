import { Directive, ElementRef, AfterViewInit, Renderer} from '@angular/core';

@Directive({
    selector: '[pipDragCancel]',
})
export class PipDragCancelDirective implements AfterViewInit {
    constructor(
        private elRef: ElementRef,
        private renderer: Renderer
    ) {}

    ngAfterViewInit() {
        const elements = this.elRef.nativeElement.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            this.renderer.setElementAttribute(elements[i], 'pip-drag-cancel', 'pip-drag-cancel');
        }
    }
}
