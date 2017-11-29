import * as _ from 'lodash';
import { Directive, ElementRef, OnInit, AfterViewInit, OnDestroy, Renderer, Host, Input, Output, EventEmitter } from '@angular/core';
import { KEY_CODE } from '../shared/key-code.model';

@Directive({
    selector: '[pipFocused]',
    /*host: {
        '(click)': 'click()',
        '(keypress)': 'keydown()'
    }*/
})
export class PipFocusedDirective implements AfterViewInit {
    private _focusedColor: Function;
    private _focusedClass: Function;
    private _focusedRebind: Function;
    private _focusedTabindex: Function;
    private _focusedOpacity: Function;
    private _focusedData: Function;
    private _withHidden: Function;
    private _rebind: Function;

    private controls: HTMLElement[];
    private controlsLength: number;
    private color: string;
    private opacityDelta: number = 0.4;
    private opacityLimit: number = 0.5;
    private oldBackgroundColor: string;

    @Input() model: any;
    @Input() focusedData: any;
    @Input() withHidden: boolean = true;
    @Input() onFocusClass: string = '';

    constructor(
        private elRef: ElementRef,
        private renderer: Renderer
    ) { }

    private init() {
        const selector = this.withHidden ? '.pip-focusable' : '.pip-focusable:visible';
        this.controls = this.elRef.nativeElement.querySelectorAll(selector);
        this.controlsLength = this.controls.length;
        this.checkTabindex(this.controls);
        // Add event listeners
        _.each(this.controls, (element: HTMLElement) => {
            element.addEventListener('focus', (event) => {
                const target = event.currentTarget;
                if (element.classList.contains('md-focused')) {
                    return;
                }
                if (this._rebind && this._rebind()) {
                    this.init();
                }
                this.elRef.nativeElement.classList.add('pip-focused-container');
                element.classList.add(this.onFocusClass);
                if (!this._focusedOpacity || !this._focusedOpacity()) {
                    this.color = element.style.backgroundColor;
                    this.oldBackgroundColor = this.color;
                    element.style.cssText = 'backgroundColor:' + this.rgba(this.color);
                    element.classList.add('md-focused');
                } else {
                    element.classList.add('md-focused md-focused-opacity');
                }
            })

            element.addEventListener('focusout', (event) => {
                const target = event.currentTarget;
                if (!element.classList.contains('md-focused')) {
                    return;
                }
                this.elRef.nativeElement.classList.remove('pip-focused-container');
                element.classList.remove(this.onFocusClass);
                if (!this._focusedOpacity || !this._focusedOpacity()) {
                    element.style.cssText = 'backgroundColor:' + this.oldBackgroundColor;
                    element.classList.remove('md-focused md-focused-opacity');
                } else {
                    element.classList.remove('md-focused');
                }
            })
        });

    }

    ngAfterViewInit() {

    }

    private rgba(color) {
        if (this._focusedColor && this._focusedColor()) {
            return this._focusedColor();
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
            this.setTabindex(controls[0], this._focusedTabindex());
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

            // const
            //     increment = (keyCode == KEY_CODE.RIGHT_ARROW || keyCode == KEY_CODE.DOWN_ARROW) ? 1 : -1,
            //     moveToControl = //this.controls.index(this.controls.filter(".md-focused")) + increment;
            // Move focus to next control
            // if (moveToControl >= 0 && moveToControl < this.controlsLength) {
            //     this.controls[moveToControl].focus();
            // }
        }
    }

    private getElementIndex(elements) {
        // for () {

        // }
    }
}