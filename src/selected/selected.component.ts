import { Component, Input, Output, OnInit, AfterViewInit, EventEmitter, Renderer, ElementRef, HostListener } from '@angular/core';
import { KEY_CODE } from '../shared/key-code.model';

@Component({
    selector: 'pip-selected',
    template: '<ng-content></ng-content>',
    styleUrls: ['./selected.component.scss']
})
export class PipSelectedComponent implements OnInit, AfterViewInit {
    private _index: number = 0;
    private _modifier: string = ':visible';
    private _prevItem: any = null;

    @Input() public set index(index: number) {
        this._index = index;
        // Add class to index
    }

    @Input() public set skipHidden(skip: boolean) {
        this._modifier = skip ? ':visible' : '';
    }
    @Input() public itemClass: string = 'pip-selectable';
    @Input() public selectedItemClass: string = 'pip-selected-item';

    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEnterSpacePress: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() { }

    constructor(
        private renderer: Renderer,
        private elRef: ElementRef
    ) {
        renderer.setElementClass(elRef.nativeElement, 'pip-selected', true);
        renderer.setElementAttribute(elRef.nativeElement, 'tabindex', '1');
        renderer.setElementStyle(elRef.nativeElement, 'outline', 'none');
        renderer.listen(elRef.nativeElement, 'focusin', (event) => {

        });
        renderer.listen(elRef.nativeElement, 'keydown', (event) => {
            this.onKeyDown(event);
        });
    }

    ngAfterViewInit() {
        this.selectItem({
            itemIndex: this._index
        });
    }

    private getElements() {
        return this.elRef.nativeElement.getElementsByClassName(this.itemClass);
    }

    private defineIndex(items) {
        const oldSelectedIndex = this._index;
        this._index = -1;
        for (let index = 0; index < items.length; index++) {
            if (items[index].classList.contains(this.selectedItemClass)) {
                this._index = index;

                break;
            }
        }
    }

    private selectItem(itemParams: any) {
        let itemIndex = itemParams.itemIndex,
            itemId = itemParams.itemId,
            items: HTMLCollection = itemParams.items || this.getElements(),
            itemsLength = items.length,
            item = () => {
                if (itemParams.item) {
                    return itemParams.item;
                }
                if (itemIndex === undefined || itemIndex === -1) {
                    //itemIndex = items.index(items.filter('[pip-id=' + itemId + ']'));
                }
                if (itemIndex >= 0 && itemIndex < itemsLength) {
                    return items[itemIndex];
                }

                return false;
            },
            raiseEvent = itemParams.raiseEvent;
        item = item();
        if (item) {
            if (this._prevItem) {
                this._prevItem.classList.remove(this.selectedItemClass);
                this._prevItem.classList.remove('mat-list-item-focus');
            }
            item['classList'].add(this.selectedItemClass);
            item['classList'].add('mat-list-item-focus');
            item['focus']();
            this._prevItem = item;
            this.scrollToItem(item);

            if (itemIndex === undefined || itemIndex === -1) {
                this.defineIndex(items);
            }

            if (this.onSelect && itemParams.raiseEvent) {
                this.onSelect.emit({
                    index: this._index,
                    target: this.elRef.nativeElement,
                    item: item,
                    prevItem: this._prevItem
                });
            }
        }
    };

    private scrollToItem(item: any) {
        let offset = (element) => {
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
            containerScrollTop = this.elRef.nativeElement.scrollTop;

        if (containerTop > itemTop) {
            this.elRef.nativeElement.scrollTop = containerScrollTop + itemTop - containerTop;
        } else if (containerBottom < itemBottom) {
            this.elRef.nativeElement.scrollTop = containerScrollTop + itemBottom - containerBottom;
        }
    }

    public onClickEvent = (element) => {
        this.selectItem({
            item: element,
            raiseEvent: true
        });
    }

    private onKeyDown(event) {
        var keyCode = event.which || event.keyCode;
        // Check control keyCode
        if (keyCode == KEY_CODE.ENTER || keyCode == KEY_CODE.SPACE) {
            event.preventDefault();
            event.stopPropagation();

            if (this.onEnterSpacePress) {
                this.onEnterSpacePress.emit({
                    event: {
                        target: this.elRef.nativeElement,
                        index: this._index,
                        item: this.elRef.nativeElement.querySelector('.selected')
                    }
                });
            }

        } else
            if (keyCode == KEY_CODE.LEFT_ARROW || keyCode == KEY_CODE.RIGHT_ARROW ||
                keyCode == KEY_CODE.UP_ARROW || keyCode == KEY_CODE.DOWN_ARROW
            ) {
                event.preventDefault();
                event.stopPropagation();

                // Get next selectable control index
                const items = this.getElements(),
                    inc = (keyCode == KEY_CODE.RIGHT_ARROW || keyCode == KEY_CODE.DOWN_ARROW) ? 1 : -1;

                this._index = this._index + inc >= items.length ? 0 : this._index + inc < 0 ? items.length - 1 : this._index + inc;

                // Set next control as selected
                this.selectItem({
                    itemIndex: this._index,
                    items: items,
                    raiseEvent: true
                });
            }
    }
}