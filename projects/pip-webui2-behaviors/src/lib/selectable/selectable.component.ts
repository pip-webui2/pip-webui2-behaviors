import { Component, Input, Output, OnInit, AfterViewInit, EventEmitter, Renderer, ElementRef } from '@angular/core';
import { KeyCode } from '../shared/key-code.model';

export interface PipSelectableResolveEvent {
    index: number | null;
    nextIndex: number | null;
    item: HTMLElement;
    nextItem: HTMLElement;
    target: HTMLElement;
}

export enum PipVisibilityResult {
    Visible = 'visible',
    Hidden = 'hidden',
    CuttedFromTop = 'cutted_top',
    CuttedFromBottom = 'cutted_bottom',
    Cutted = 'cutted'
}

export interface PipSelectableResolveEmitData {
    index: number | null;
    item: HTMLElement;
    target: HTMLElement;
}

export type PipSelectableResolverFunction = ($event?: PipSelectableResolveEvent) => Promise<boolean>;

@Component({
    selector: 'pip-selectable',
    template: '<ng-content></ng-content>',
    styleUrls: ['./selectable.component.scss']
})
export class PipSelectableComponent implements OnInit, AfterViewInit {

    private _defaultResolver: PipSelectableResolverFunction;
    private _index = -1;
    private _latestIndex: number;
    private _prevItem: HTMLElement = null;
    private _resolver: PipSelectableResolverFunction;
    private _requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            (<any>window).mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    @Input() public itemClass = 'pip-selectable';
    @Input() public selectedItemClass = 'pip-selected-item';
    @Input() public skipHidden = true;
    @Input() public scrollToItem = true;
    @Input() set index(index: number) {
        if (this._index === index) { return; }
        this._latestIndex = index;
        this._selectItem({ index, emitEvent: false });
    }

    @Input() set resolver(r: PipSelectableResolverFunction) {
        if (r) {
            this._resolver = r;
        } else {
            this._resolver = this._defaultResolver;
        }
    }

    @Output() selected: EventEmitter<PipSelectableResolveEmitData> = new EventEmitter<PipSelectableResolveEmitData>();

    constructor(
        renderer: Renderer,
        private elRef: ElementRef
    ) {
        this._defaultResolver = () => new Promise<boolean>((resolve, reject) => resolve(true));
        this._resolver = this._defaultResolver;
        renderer.setElementClass(elRef.nativeElement, 'pip-selectable', true);
        renderer.setElementAttribute(elRef.nativeElement, 'tabindex', '1');
        renderer.setElementStyle(elRef.nativeElement, 'outline', 'none');
        renderer.listen(elRef.nativeElement, 'keydown', (event) => {
            this.onKeyDown(event);
        });
    }

    ngOnInit() { }

    ngAfterViewInit() {
        this._selectItem({ index: this._latestIndex, emitEvent: false, forceUpdate: true });
    }

    private _getIndexByItem(items: HTMLCollection, item: HTMLElement): number {
        let idx = -1;
        for (let index = 0; index < items.length; index++) {
            if (items[index].nodeType === items[index].ELEMENT_NODE) {
                if (item.isEqualNode(items[index])) {
                    idx = index;
                    break;
                }
            }
        }
        return idx;
    }

    private _getElements(): HTMLCollection {
        return this.elRef.nativeElement.getElementsByClassName(this.itemClass);
    }

    private _selectItem(options: {
        emitEvent?: boolean,
        items?: HTMLCollection,
        index?: number,
        item?: any,
        forceUpdate?: boolean
    } = { emitEvent: true }) {
        const items: HTMLCollection = options.items || this._getElements();
        const nextIndex = typeof options.index !== 'undefined'
            ? options.index
            : (options.item ? this._getIndexByItem(items, options.item) : this._index);
        const item = (this._index >= 0 && this._index < items.length && items[this._index]) as HTMLElement || null;
        const nextItem = options.item || (nextIndex >= 0 && nextIndex < items.length && items[nextIndex]) as HTMLElement || null;
        this._resolver({
            index: this._index,
            nextIndex,
            item,
            nextItem,
            target: this.elRef.nativeElement
        }).then(res => {
            if (!res || (this._index === nextIndex && !options.forceUpdate)) { return; }
            this._index = nextIndex;
            if (nextItem) {
                if (this._prevItem) {
                    this._prevItem.classList.remove(this.selectedItemClass);
                    this._prevItem.classList.remove('mat-list-item-focus');
                }
                nextItem['classList'].add(this.selectedItemClass);
                nextItem['classList'].add('mat-list-item-focus');
                nextItem['focus']();
                this._prevItem = nextItem;
                const visibility = this._isItemVisible(nextItem);
                if (visibility !== PipVisibilityResult.Visible) {
                    this._scrollToItem(nextItem);
                }

            }
            if (options.emitEvent) {
                this.selected.emit({
                    index: this._index,
                    item: nextItem,
                    target: this.elRef.nativeElement,
                });
            }
        });
    }

    private _isItemVisible(item: HTMLElement, full: boolean = true): PipVisibilityResult {
        let rect = item.getBoundingClientRect();
        const top = rect.top;
        const height = rect.height;
        let res: PipVisibilityResult;
        let el: HTMLElement = item.parentElement;
        // Check if bottom of the element is off the page
        if (rect.bottom < 0) { return PipVisibilityResult.Hidden; }
        // Check its within the document viewport
        if (top > document.documentElement.clientHeight) { return PipVisibilityResult.Hidden; }
        do {
            rect = el.getBoundingClientRect();
            if (!full) {
                if (top < rect.top && res !== PipVisibilityResult.Cutted) {
                    res = res === PipVisibilityResult.CuttedFromBottom ? PipVisibilityResult.Cutted : PipVisibilityResult.CuttedFromTop;
                }
                if ((top + height) > rect.bottom && res !== PipVisibilityResult.Cutted) {
                    res = res === PipVisibilityResult.CuttedFromTop ? PipVisibilityResult.Cutted : PipVisibilityResult.CuttedFromBottom;
                }
            }
            if (top <= rect.top && (full && !res)) { return PipVisibilityResult.Hidden; }
            if ((top + height) >= rect.bottom && (full && !res)) { return PipVisibilityResult.Hidden; }
            el = el.parentElement;
        } while (el.parentElement !== document.body);
        if (!res) { res = PipVisibilityResult.Visible; }
        return res;
    }

    private _scrollLoop(scrollTo = 0, speed = 2000, easing = 'easeOutSine') {

        const scrollY = this.elRef.nativeElement.scrollTop;
        let currentTime = 0;

        // min time .1, max time .8 seconds
        const time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTo) / speed, .8));

        const easingEquations = {
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };

        // add animation loop
        const tick = () => {
            currentTime += 1 / 60;

            const p = currentTime / time;
            const t = easingEquations[easing](p);

            if (p < 1) {
                this._requestAnimFrame(tick);

                this.elRef.nativeElement.scrollTo(0, scrollY + ((scrollTo - scrollY) * t));
            } else {
                this.elRef.nativeElement.scrollTo(0, scrollTo);
            }
        };

        // call it once to get started
        tick();
    }

    private _getContainerVisibleHeights(): { hiddenTop: number, visible: number, hiddenBottom: number } {
        const hs = {
            hiddenTop: 0,
            visible: this.elRef.nativeElement.offsetHeight,
            hiddenBottom: 0
        };
        let top = this.elRef.nativeElement.getBoundingClientRect().top;
        let bottom = this.elRef.nativeElement.getBoundingClientRect().bottom;
        let el = this.elRef.nativeElement;
        let rect;
        do {
            el = el.parentElement;
            rect = el.getBoundingClientRect();
            if (top < rect.top) {
                hs.visible -= (rect.top - top);
                hs.hiddenTop += (rect.top - top);
                top = rect.top;
            } else if (bottom > rect.bottom && hs.visible - bottom + rect.bottom >= 0) {
                hs.visible -= (bottom - rect.bottom);
                hs.hiddenBottom += (bottom - rect.bottom);
                bottom = rect.bottom;
            }
        } while (el !== document.body);
        return hs;
    }

    private _scrollToItem(item: any) {
        if (!this.scrollToItem) { return; }
        const offset = (element) => {
            return {
                left: element.getBoundingClientRect().left || 0,
                top: element.getBoundingClientRect().top || 0
            };
        };

        const
            containerTop = offset(this.elRef.nativeElement).top,
            containerHeight = this.elRef.nativeElement.offsetHeight,
            containerBottom = containerTop + containerHeight,
            itemTop = offset(item).top,
            itemHeight = item.offsetHeight,
            itemBottom = itemTop + itemHeight,
            containerScrollTop = this.elRef.nativeElement.scrollTop,
            containerHeights = this._getContainerVisibleHeights();

        // const containerVisibility = this._isItemVisible(this.elRef.nativeElement, false);
        switch (this._isItemVisible(this.elRef.nativeElement, false)) {
            case PipVisibilityResult.Visible: {
                if (containerTop > itemTop) {
                    this._scrollLoop(containerScrollTop + itemTop - containerTop, 200);
                } else if (containerBottom < itemBottom) {
                    this._scrollLoop(containerScrollTop + itemBottom - containerBottom, 200);
                }
                break;
            }
            case PipVisibilityResult.CuttedFromTop: {
                const hiddenHeight = containerHeight - containerHeights.hiddenTop;
                if (containerTop + hiddenHeight > itemTop) {
                    this._scrollLoop(containerScrollTop + itemTop - containerTop - containerHeights.hiddenTop, 200);
                } else if (containerBottom - hiddenHeight < itemBottom) {
                    this._scrollLoop(containerScrollTop + itemBottom - containerBottom, 200);
                }
                break;
            }
            case PipVisibilityResult.CuttedFromBottom: {
                const hiddenHeight = containerHeight - containerHeights.hiddenBottom;
                if (containerTop > itemTop) {
                    this._scrollLoop(containerScrollTop + itemTop - containerTop, 200);
                } else if (containerBottom - hiddenHeight < itemBottom) {
                    this._scrollLoop(containerScrollTop + itemBottom - containerBottom + containerHeights.hiddenBottom, 200);
                }
                break;
            }
            case PipVisibilityResult.Cutted: {
                if (containerTop + containerHeights.hiddenTop > itemTop) {
                    this._scrollLoop(containerScrollTop + itemTop - containerTop - containerHeights.hiddenTop, 200);
                } else if (containerBottom - containerHeights.hiddenBottom < itemBottom) {
                    this._scrollLoop(containerScrollTop + itemBottom - containerBottom + containerHeights.hiddenBottom, 200);
                }
                break;
            }
        }
    }

    public onClickEvent = (element) => {
        this._selectItem({
            item: element,
            emitEvent: true
        });
    }

    private onKeyDown(event) {
        const keyCode = event.which || event.keyCode;
        if (keyCode === KeyCode.LEFT_ARROW || keyCode === KeyCode.RIGHT_ARROW ||
            keyCode === KeyCode.UP_ARROW || keyCode === KeyCode.DOWN_ARROW
        ) {
            event.preventDefault();
            event.stopPropagation();

            // Get next selectable control index
            const items = this._getElements(),
                inc = (keyCode === KeyCode.RIGHT_ARROW || keyCode === KeyCode.DOWN_ARROW) ? 1 : -1;

            const index = this._index + inc >= items.length ? 0 : this._index + inc < 0 ? items.length - 1 : this._index + inc;

            // Set next control as selected
            this._selectItem({
                index,
                items: items,
                emitEvent: true
            });
        }
    }
}
