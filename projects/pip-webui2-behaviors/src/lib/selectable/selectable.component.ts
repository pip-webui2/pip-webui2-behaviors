import {
    Component, Input, Output, OnDestroy, AfterViewInit, EventEmitter, Renderer,
    ElementRef, ContentChildren, QueryList, HostListener
} from '@angular/core';
import { DOWN_ARROW, UP_ARROW, RIGHT_ARROW, LEFT_ARROW } from '@angular/cdk/keycodes';
import { Subscription, BehaviorSubject, merge } from 'rxjs';
import { distinct, distinctUntilChanged, tap } from 'rxjs/operators';

import { PipSelectableDirective } from './selectable.directive';

export interface PipSelectableResolveEvent {
    index: number | null;
    nextIndex: number | null;
    item: ElementRef;
    nextItem: ElementRef;
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
    item: ElementRef;
    target: HTMLElement;
    value?: any;
}

export type PipSelectableResolverFunction = ($event?: PipSelectableResolveEvent) => Promise<boolean>;

@Component({
    selector: 'pip-selectable',
    template: '<ng-content></ng-content>',
    styleUrls: ['./selectable.component.scss']
})
export class PipSelectableComponent implements OnDestroy, AfterViewInit {

    // private _defaultResolver: PipSelectableResolverFunction;
    private _index$ = new BehaviorSubject<number>(-1);
    // private _latestIndex: number;
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
    private _subs = new Subscription();

    @Input() public itemClass = 'pip-selectable';
    @Input() public selectedItemClass = 'pip-selected-item';
    @Input() public skipHidden = true;
    @Input() public scrollToItem = true;
    @Input() set index(index: number) {
        this._index$.next(index);
    }

    @Input() set resolver(r: PipSelectableResolverFunction) {
        if (r) {
            this._resolver = r;
        }
    }

    @Output() selected: EventEmitter<PipSelectableResolveEmitData> = new EventEmitter<PipSelectableResolveEmitData>();

    @ContentChildren(PipSelectableDirective, { descendants: true }) elements: QueryList<PipSelectableDirective>;

    constructor(
        private renderer: Renderer,
        private elRef: ElementRef
    ) {
        // this._defaultResolver = () => new Promise<boolean>((resolve, reject) => resolve(true));
        this.renderer.setElementClass(elRef.nativeElement, 'pip-selectable', true);
        this.renderer.setElementAttribute(elRef.nativeElement, 'tabindex', '1');
        this.renderer.setElementStyle(elRef.nativeElement, 'outline', 'none');
    }


    ngOnDestroy() { this._subs.unsubscribe(); }

    ngAfterViewInit() {
        this._subs.add(merge(
            this.elements.changes,
            this._index$.asObservable().pipe(
                tap(idx => console.log('[_idx_]', idx)),
                distinctUntilChanged()
            )
        ).subscribe((arg) => {
            console.group('ELEMENTS/INDEX changed');
            console.log('arg is', arg);
            const element = this._findElementByIndex(this._index$.value);
            console.log('this element found', element);
            this._updateClasses(element);
            this._scrollToItem(element);
            console.groupEnd();
        }));
    }

    private _findElementByIndex(idx: number): ElementRef {
        const dir = this.elements && this.elements.find((d, i) => i === idx) || null;
        return dir ? dir.elRef : null;
    }

    private _findIndexByElement(element: ElementRef): number {
        let idx = -1;
        if (this.elements) {
            this.elements.forEach((d, i) => {
                if (d.elRef === element) {
                    idx = i;
                }
            });
        }
        return idx;
    }

    private _selectItemResolve(params: {
        emitEvent?: boolean,
        index?: number,
        item?: ElementRef
    } = { emitEvent: true }) {
        const nextIndex = typeof params.index !== 'undefined'
            ? params.index
            : (params.item ? this._findIndexByElement(params.item) : this._index$.value);
        const item = this._findElementByIndex(this._index$.value);
        const nextItem = params.item || this._findElementByIndex(nextIndex);
        if (this._resolver) {
            this._resolver({
                index: this._index$.value,
                nextIndex,
                item,
                nextItem,
                target: this.elRef.nativeElement
            }).then(res => (res ? this._selectItem({ index: nextIndex, item: nextItem, emitEvent: params.emitEvent }) : null));
        } else {
            this._selectItem({ index: nextIndex, item: nextItem, emitEvent: params.emitEvent });
        }
    }

    private _selectItem(params: {
        emitEvent?: boolean,
        index: number,
        item: ElementRef
    }) {
        this._index$.next(params.index);
        const dir = this.elements && this.elements.find((d, i) => i === params.index);
        if (params.emitEvent) {
            this.selected.emit({
                index: params.index,
                item: params.item,
                target: this.elRef.nativeElement,
                value: dir && dir.value || undefined
            });
        }
    }

    private _updateClasses(element: ElementRef) {
        if (this._prevItem) {
            console.log('has prev element', this._prevItem);
            this.renderer.setElementClass(this._prevItem, this.selectedItemClass, false);
            this.renderer.setElementClass(this._prevItem, 'mat-list-item-focus', false);
        }
        if (element) {
            const item = element.nativeElement;
            console.log('set all the classes for new item', item);
            this.renderer.setElementClass(item, this.selectedItemClass, true);
            this.renderer.setElementClass(item, 'mat-list-item-focus', true);
            item.focus();
            this._prevItem = item;
        }
    }

    private _isItemVisible(item: HTMLElement, full: boolean = true): PipVisibilityResult {
        let rect = item.getBoundingClientRect();
        const top = rect.top;
        const height = rect.height;
        let res: PipVisibilityResult;
        let el: HTMLElement = item.parentElement;
        if (rect.bottom < 0) { return PipVisibilityResult.Hidden; }
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

    private _scrollToItem(element: ElementRef) {
        if (!this.scrollToItem || !element) { return; }
        const item = element.nativeElement;
        const offset = (el) => {
            return {
                left: el.getBoundingClientRect().left || 0,
                top: el.getBoundingClientRect().top || 0
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

    public onClickEvent(element: ElementRef) {
        this._selectItemResolve({
            item: element,
            emitEvent: true
        });
    }

    @HostListener('keydown', ['$event']) keydown(event: KeyboardEvent) {
        let index;
        switch (event.keyCode) {
            case DOWN_ARROW:
            case RIGHT_ARROW:
                index = this._index$.value + 1;
                break;
            case UP_ARROW:
            case LEFT_ARROW:
                index = this._index$.value - 1;
                break;
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (index < 0) { index = this.elements.length - 1; }
        if (index >= this.elements.length) { index = 0; }
        this._selectItemResolve({
            index,
            emitEvent: true
        });
    }
}
