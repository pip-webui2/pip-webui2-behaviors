import * as _ from 'lodash';
import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy, Renderer, Host, Input, Output, EventEmitter } from '@angular/core';
import { PipDraggableService } from './shared/draggable.service';

@Directive({
    selector: '[pipDrag]',
    /*host: {
        '(click)': 'click()',
        '(keypress)': 'keydown()'
    }*/
})
export class PipDragDirective implements OnInit, AfterViewInit, OnDestroy {
    @Output() dragStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() dragMove: EventEmitter<any> = new EventEmitter<any>();
    @Output() dragStop: EventEmitter<any> = new EventEmitter<any>();
    @Output() dragSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Input() allowTransform: boolean = false;
    @Input() dragData: any;
    @Input() verticalScroll: boolean;
    @Input() horizontalScroll: boolean;
    @Input() activationDistance: number;
    @Input() scrollContainer: any = window;
    @Input() public set drag(newVal: any) {
        this.onEnableChange(newVal, this.prevDrag);
        this.prevDrag = newVal;
    }
    @Input() public set centerAnchor(newVal: boolean) {
        this.onCenterAnchor(newVal, this.prevCenterAnchor);
        this.prevCenterAnchor = newVal;
    }

    private LONG_PRESS: number = 50; // 50ms for longpress
    private offset: any;
    private _centerAnchor: boolean = false;
    private _mx: number;
    private _my: number;
    private _tx: number;
    private _ty: number;
    private _mrx: number;
    private _mry: number;
    private _hasTouch: boolean = ('ontouchstart' in window) || (<any>window).DocumentTouch; // && document instanceof DocumentTouch; // DocumentTouch is not defined!
    private _pressEvents: string = 'touchstart mousedown';
    private _moveEvents: string = 'touchmove mousemove';
    private _releaseEvents: string = 'touchend mouseup';
    private _dragHandle: any;

    private _myid: string | number;
    private _data: any = null;

    private _dragOffset: any = null;

    private _dragEnabled: boolean = false;

    private _pressTimer: any = null;

    private _elementStyle: any = {};

    private getDragData: any;
    private scrollDistance: number;
    private scrollParent: boolean = false;

    private prevDrag: any = null;
    private prevCenterAnchor: any = null;

    constructor(
        private elRef: ElementRef,
        private renderer: Renderer,
        private draggableService: PipDraggableService
    ) {

    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.initialize();
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    private initialize() {
        this.renderer.setElementAttribute(this.elRef.nativeElement, 'pip-draggable', 'false'); // prevent native drag
        // check to see if drag handle(s) was specified
        // if querySelectorAll is available, we use this instead of find
        // as JQLite find is limited to tagnames
        let dragHandles: any;
        if (this.elRef.nativeElement.querySelectorAll) {
            dragHandles = this.elRef.nativeElement.querySelectorAll('[pip-drag-handle]');
            // } else {
            //     dragHandles = this.$element.find('[pip-drag-handle]');
            // }
            if (dragHandles.length) {
                this._dragHandle = dragHandles;
            }
            this.toggleListeners(true);

            // Initialize scroll container
            if (this.scrollParent) {
                this.scrollContainer = this.elRef.nativeElement.parentElement;
            }
        }
    }

    private toggleListeners(enable) {
        if (!enable) return;

        // wire up touch events
        if (this._dragHandle) {
            // handle(s) specified, use those to initiate drag
            this._dragHandle.on(this._pressEvents, (event) => {
                this.onpress(event);
            });
        } else {
            // no handle(s) specified, use the element as the handle
            this.renderer.listen(this.elRef.nativeElement, this._pressEvents, (event) => {
                this.onpress(event);
            });
        }
        if (!this._hasTouch && this.elRef.nativeElement.nodeName.toLowerCase() == "img") {
            this.renderer.listen(this.elRef.nativeElement, 'mousedown', () => {
                return false;
            }); // prevent native drag for images
        }
    }

    private onDestroy() {
        this.toggleListeners(false);
    }

    private onEnableChange(newVal, oldVal) {
        this._dragEnabled = (newVal);
    }

    private onCenterAnchor(newVal, oldVal) {
        if (!_.isUndefined(newVal))
            this._centerAnchor = (newVal || 'true');
    }

    private isClickableElement(evt: any) {
        return (
            !_.isUndefined(evt.target.attributes.contains("pip-cancel-drag") || evt.target.attributes.contains("pipCancelDrag"))
        );
    }

    /*
        * When the element is clicked start the drag behaviour
        * On touch devices as a small delay so as not to prevent native window scrolling
        */
    private onpress(evt) {
        if (!this._dragEnabled) return;

        if (this.isClickableElement(evt)) {
            return;
        }

        if (evt.type == "mousedown" && evt.button != 0) {
            // Do not start dragging on right-click
            return;
        }

        this.saveElementStyles();

        if (this._hasTouch) {
            this.cancelPress();
            this._pressTimer = setTimeout(() => {
                this.cancelPress();
                this.onlongpress(evt);
            }, this.LONG_PRESS);
            document.addEventListener(this._moveEvents, () => {
                this.cancelPress();
            });
            document.addEventListener(this._releaseEvents, () => {
                this.cancelPress();
            });
        } else {
            this.onlongpress(evt);
        }
    }

    private saveElementStyles() {
        this._elementStyle.left = this.elRef.nativeElement.style.left || 0;
        this._elementStyle.top = this.elRef.nativeElement.style.top || 0;
        this._elementStyle.position = this.elRef.nativeElement.style.position;
        this._elementStyle.width = this.elRef.nativeElement.style.width;
    }

    private cancelPress() {
        clearTimeout(this._pressTimer);
        document.removeEventListener(this._moveEvents, () => {
            this.cancelPress();
        });
        document.removeEventListener(this._releaseEvents, () => {
            this.cancelPress();
        });
    }

    private onlongpress(evt) {
        if (!this._dragEnabled) return;
        evt.preventDefault();

        this.offset = this.elRef.nativeElement.getBoundingClientRect();
        if (this.allowTransform)
            this._dragOffset = this.offset;
        else {
            this._dragOffset = {
                left: document.body.scrollLeft,
                top: document.body.scrollTop
            };
        }


        this.elRef.nativeElement.centerX = this.elRef.nativeElement.offsetWidth / 2;
        this.elRef.nativeElement.centerY = this.elRef.nativeElement.offsetHeight / 2;

        this._mx = this.draggableService.inputEvent(evt).pageX;
        this._my = this.draggableService.inputEvent(evt).pageY;
        this._mrx = this._mx - this.offset.left;
        this._mry = this._my - this.offset.top;
        if (this._centerAnchor) {
            this._tx = this._mx - this.elRef.nativeElement.centerX - window.pageXOffset;
            this._ty = this._my - this.elRef.nativeElement.centerY - window.pageYOffset;
        } else {
            this._tx = this._mx - this._mrx - window.pageXOffset;
            this._ty = this._my - this._mry - window.pageYOffset;
        }

        document.addEventListener(this._moveEvents, (event) => {
            this.onmove(event);
        });
        document.addEventListener(this._releaseEvents, (event) => {
            this.onrelease(event);
        });
    }

    private onmove(evt) {
        if (!this._dragEnabled) return;
        evt.preventDefault();
        if (!this.elRef.nativeElement.classList.contains('pip-dragging')) {
            this._data = this.dragData;
            this.elRef.nativeElement.classList.add('pip-dragging');
            this.draggableService.broadcast('draggable:start', {
                x: this._mx,
                y: this._my,
                tx: this._tx,
                ty: this._ty,
                event: evt,
                element: this.elRef.nativeElement,
                data: this._data
            });

            if (this.dragStart) {
                this.dragStart.emit({
                    $data: this._data,
                    $event: evt
                });
            }
        }

        this._mx = this.draggableService.inputEvent(evt).pageX;
        this._my = this.draggableService.inputEvent(evt).pageY;

        if (this.horizontalScroll || this.verticalScroll) {
            this.dragToScroll();
        }

        if (this._centerAnchor) {
            this._tx = this._mx - this.elRef.nativeElement.centerX - this._dragOffset.left;
            this._ty = this._my - this.elRef.nativeElement.centerY - this._dragOffset.top;
        } else {
            this._tx = this._mx - this._mrx - this._dragOffset.left;
            this._ty = this._my - this._mry - this._dragOffset.top;
        }

        this.moveElement(this._tx, this._ty);

        this.draggableService.broadcast('draggable:move', {
            x: this._mx,
            y: this._my,
            tx: this._tx,
            ty: this._ty,
            event: evt,
            element: this.elRef.nativeElement,
            data: this._data,
            uid: this._myid,
            dragOffset: this._dragOffset
        });

        if (this.dragMove) {
            this.dragMove.emit({
                $data: this._data,
                $event: evt
            });
        }
    }

    private onrelease(evt) {
        if (!this._dragEnabled)
            return;
        evt.preventDefault();
        this.draggableService.broadcast('draggable:end', {
            x: this._mx,
            y: this._my,
            tx: this._tx,
            ty: this._ty,
            event: evt,
            element: this.elRef.nativeElement,
            data: this._data,
            callback: this.onDragComplete,
            uid: this._myid
        });
        this.elRef.nativeElement.classList.remove('pip-dragging');
        let dragEnterelemets = this.elRef.nativeElement.parentElement.getElementsByClass('pip-drag-enter');
        _.each(dragEnterelemets, (element: HTMLElement) => {
            element.classList.remove('pip-drag-enter');
        });

        this.reset();
        document.removeEventListener(this._moveEvents);
        document.removeEventListener(this._releaseEvents);
        if (this.dragStop) {
            this.dragStop.emit({
                $data: this._data,
                $event: evt
            });
        }
    }

    private onDragComplete(evt) {
        if (!this.dragSuccess) return;

        this.dragSuccess.emit({
            $data: this._data,
            $event: evt
        });
    }

    private reset() {
        if (this.allowTransform) {
            // this.$element.css({
            //     transform: '',
            //     'z-index': '',
            //     '-webkit-transform': '',
            //     '-ms-transform': ''
            // });
            this.elRef.nativeElement.style.cssText = 'transform: "", z-index: "", -webkit-transform: "", -ms-transform: ""';
        } else {
            // this.$element.css({
            //     position: this._elementStyle.position,
            //     top: this._elementStyle.top,
            //     left: this._elementStyle.left,
            //     'z-index': '',
            //     width: this._elementStyle.width
            // });
            this.elRef.nativeElement.style.cssText = 'position:' + this._elementStyle.position
                + ', top:' + this._elementStyle.top
                + ', left:' + this._elementStyle.left
                + ', z-index:"", width:' + this._elementStyle.width;
        }
    }

    private moveElement(x, y) {
        const eWidth = this.elRef.nativeElement.style.width;
        if (this.allowTransform) {
            // this.$element.css({
            //     transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
            //     'z-index': 99999,
            //     '-webkit-transform': 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + x + ', ' + y + ', 0, 1)',
            //     '-ms-transform': 'matrix(1, 0, 0, 1, ' + x + ', ' + y + ')'
            // });
        } else {
            // this.$element.css({
            //     'left': x + 'px',
            //     'top': y + 'px',
            //     'position': 'fixed',
            //     'z-index': 100,
            //     width: eWidth
            // });
            this.elRef.nativeElement.style.cssText = 'position:' + this._elementStyle.position
                + ', top:' + x + 'px'
                + ', left:' + y + 'px'
                + ', positions: fixed',
                + ', z-index: 100, width:' + eWidth;
        }
    }

    private dragToScroll() {
        let scrollX = 0,
            scrollY = 0,
            offset = (element) => {
                return element.offset() || {
                    left: 0,
                    top: 0
                };
            };

        if (this.horizontalScroll) {
            const
                containerLeft = offset(this.scrollContainer).left,
                containerWidth = this.scrollContainer.innerWidth(),
                containerRight = containerLeft + containerWidth;

            if ((this._mx - containerLeft) < this.activationDistance) {
                scrollX = -this.scrollDistance;
            } else if ((containerRight - this._mx) < this.activationDistance) {
                scrollX = this.scrollDistance;
            }
        }

        if (this.verticalScroll) {
            const
                containerTop = offset(this.scrollContainer).top,
                containerHeight = this.scrollContainer.innerHeight(),
                containerBottom = containerTop + containerHeight;

            if ((this._my - containerTop) < this.activationDistance) {
                scrollY = -this.scrollDistance + 30;
            } else if ((containerBottom - this._my) < this.activationDistance) {
                scrollY = this.scrollDistance - 30;
            }
        }
        if (scrollX !== 0 || scrollY !== 0) {
            const
                containerScrollLeft = this.scrollContainer.scrollLeft(),
                containerScrollTop = this.scrollContainer.scrollTop();

            this.scrollContainer.scrollLeft(containerScrollLeft + scrollX);
            this.scrollContainer.scrollTop(containerScrollTop + scrollY);
        }

    }
}