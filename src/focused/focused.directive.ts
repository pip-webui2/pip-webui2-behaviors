import * as _ from 'lodash';
import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy, Renderer, Host, Input, Output, EventEmitter } from '@angular/core';
import { KEY_CODE } from '../shared/key-code.model';

@Directive({
    selector: '[pipFocused]'
})
export class PipFocusedDirective implements AfterViewInit {
    private _focusedColor: string;
    private _focusedClass: string = 'mat-focused';
    private _focusedRebind: boolean;
    private _focusedTabindex: number;
    private _focusedOpacity: boolean = false;
    private _focusedData: Function;
    private _withHidden: Function;
    private _rebind: Function;

    private controls: HTMLElement[];
    private controlsLength: number;
    private color: string;
    private opacityDelta: number = 0.04;
    private opacityLimit: number = 0.1;
    private oldBackgroundColor: string;
    private _prevTrigger: any = null;

    @Input() focusedOpacityClass: string = 'pip-focused-opaicty'

    @Input() set focusedRebind(rebind) {
        this._focusedRebind = rebind;
    }
    @Input() set focusedOpacity(isOpacity) {
        this._focusedOpacity = isOpacity;
    }
    @Input() set focusedClass(className) {
        this._focusedClass = className;
    }
    @Input() set focusedColor(color) {
        this._focusedColor = color;
    }
    @Input() set focusedTabIndex(index) {
        this._focusedTabindex = index;
    }
    @Input() model: any;
    @Input() focusedData: any;
    @Input() withHidden: boolean = true;
    @Input() onFocusClass: string = '';
    @Input() set dynamicTrigger(changed: any) {
        if (this._prevTrigger == null) this._prevTrigger = changed;
        else if (this._prevTrigger != changed) {
            setTimeout(() => {
                this.init();
            }, 500);
            this._prevTrigger = changed;
        }
    }

    @Output() onEnterSpacePress: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDeletePress: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private elRef: ElementRef,
        private renderer: Renderer
    ) {
        renderer.setElementAttribute(this.elRef.nativeElement, 'tabindex', '1');
        renderer.setElementStyle(this.elRef.nativeElement, 'outline', 'none');
        renderer.listen(elRef.nativeElement, 'keydown', (event) => {
            this.keydownListener(event);
        });
        renderer.listen(elRef.nativeElement, 'focus', () => {
            if (this.controls.length > 0) this.controls[0].focus();
        });
    }

    private setControls() {
        const selector = this.withHidden ? '.pip-focusable' : '.pip-focusable:visible';
        this.controls = this.elRef.nativeElement.querySelectorAll(selector);
    }

    private init() {
        this.setControls();
        this.controlsLength = this.controls.length;
        this.checkTabindex(this.controls);
        // Add event listeners
        _.each(this.controls, (element: HTMLElement) => {
            element.addEventListener('focus', (event) => {
                const target = event.currentTarget;
                if (element.classList.contains('mat-focused')) {
                    return;
                }
                if (this._rebind && this._rebind()) {
                    this.init();
                }
                this.elRef.nativeElement.classList.add('pip-focused-container');
                this.renderer.setElementStyle(element, 'outline', 'none');
                if (this.onFocusClass) element.classList.add(this.onFocusClass);
                if (!this._focusedOpacity) {
                    this.color = element.style.backgroundColor || 'rgba(0, 0, 0, 0)';
                    this.oldBackgroundColor = this.color;
                    this.renderer.setElementStyle(element, 'background-color', this.rgba(this.color));
                    if (this._focusedClass) element.classList.add(this._focusedClass);
                } else {
                    if (this._focusedClass) element.classList.add(this._focusedClass);
                    if (this.focusedOpacityClass) element.classList.add(this.focusedOpacityClass);
                }
            })

            element.addEventListener('focusout', (event) => {
                const target = event.currentTarget;
                if (!element.classList.contains(this._focusedClass)) {
                    return;
                }
                this.elRef.nativeElement.classList.remove('pip-focused-container');
                if (this.onFocusClass) element.classList.remove(this.onFocusClass);
                if (!this._focusedOpacity) {
                    this.renderer.setElementStyle(element, 'background-color', this.oldBackgroundColor);
                    if (this._focusedClass) element.classList.remove(this._focusedClass);
                } else {
                    if (this._focusedClass) element.classList.remove(this._focusedClass);
                    if (this.focusedOpacityClass) element.classList.remove(this.focusedOpacityClass);
                }
            })
        });

    }

    ngAfterViewInit() {
        this.init();
    }

    private rgba(color) {
        if (this._focusedColor) {
            return this._focusedColor;
        }

        const arr = color.split("(")[1].split(")")[0].split(",");

        if (!arr || arr.length < 3) {
            return ''
        }

        let red, blue, green, opacity;

        opacity = arr.length == 3 ? 1 : parseFloat(arr[3]);
        red = arr[0];
        blue = arr[1];
        green = arr[2];

        if (opacity < this.opacityLimit) {
            opacity += this.opacityDelta;
        } else {
            opacity -= this.opacityDelta;
        }

        return 'rgba(' + red + ', ' + blue + ', ' + green + ', ' + opacity + ')';
    }

    private setTabindex(element, value) {
        element.attr('tabindex', value);
    }

    private checkTabindex(controls) {
        const index = _.findIndex(controls, (c) => {
            return c['tabindex'] > -1;
        });

        if (index == -1 && controls.length > 0 && this._focusedTabindex) {
            this.setTabindex(controls[0], this._focusedTabindex);
        }
    }

    private keydownListener(e) {
        const keyCode = e.which || e.keyCode;
        // Check control keyCode
        if (keyCode == KEY_CODE.LEFT_ARROW ||
            keyCode == KEY_CODE.UP_ARROW ||
            keyCode == KEY_CODE.RIGHT_ARROW ||
            keyCode == KEY_CODE.DOWN_ARROW
        ) {
            e.preventDefault();

            const
                increment = (keyCode == KEY_CODE.RIGHT_ARROW || keyCode == KEY_CODE.DOWN_ARROW) ? 1 : -1,
                moveToControl = this.getElementIndex(this.controls) + increment;
            // Move focus to next control
            if (moveToControl >= 0 && moveToControl < this.controlsLength) {
                this.controls[moveToControl].focus();
            }
        } else if (keyCode == KEY_CODE.ENTER || keyCode == KEY_CODE.SPACE) {
            let index = this.getElementIndex(this.controls);
            this.onEnterSpacePress.emit({ event: e, index: index });
        } else if (keyCode == KEY_CODE.DELETE || keyCode == KEY_CODE.BACKSPACE) {
            let index = this.getElementIndex(this.controls);
            this.onDeletePress.emit({ event: e, index: index });
            setTimeout(() => {
                this.setControls();
                if (index < this.controls.length) this.controls[index].focus();
                else if (this.controls.length > 0) {
                    while(index >= this.controls.length && index > -1) index--;
                    this.controls[index].focus();
                }
            }, 200);
        }
    }

    private getElementIndex(elements) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains(this._focusedClass)) return i;
        }

        return -1;
    }
}