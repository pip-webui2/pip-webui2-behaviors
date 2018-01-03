import * as _ from 'lodash';
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
        let elements = this.elRef.nativeElement.getElementsByTagName('*');
console.log();
        _.each(elements, (element) => {
            this.renderer.setElementAttribute(element, 'pip-drag-cancel', 'pip-drag-cancel');
        });
    }
}