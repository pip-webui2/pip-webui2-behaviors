import { Component } from '@angular/core';
import { PipSelectableResolverFunction, PipSelectableResolveEvent } from 'pip-webui2-behaviors';

@Component({
    selector: 'app-selectable-example',
    templateUrl: './selectable-example.component.html',
    styleUrls: ['./selectable-example.component.scss']
})
export class SelectableExampleComponent {

    private _disableResolver: PipSelectableResolverFunction;
    private _items: any[] = [
        { id: '1', title: 'Banana', },
        { id: '2', title: 'Pineapple', },
        { id: '3', title: 'Apple', },
        { id: '4', title: 'Carrot', },
        { id: '5', title: 'Tomato', },
        { id: '6', title: 'Potato', },
        { id: '7', title: 'Cucumber', },
        { id: '8', title: 'Radish', },
        { id: '1', title: 'Banana', },
        { id: '2', title: 'Pineapple', },
        { id: '3', title: 'Apple', },
        { id: '4', title: 'Carrot', },
        { id: '5', title: 'Tomato', },
        { id: '6', title: 'Potato', },
        { id: '7', title: 'Cucumber', },
        { id: '8', title: 'Radish', }
    ];

    public height = 200;
    public items: any[];
    public resolver = null;
    public restricted = true;
    public selectedIndex = 4;

    constructor() {
        this._disableResolver = ($event: PipSelectableResolveEvent) => {
            return new Promise<boolean>((resolve, reject) => resolve($event.nextIndex % 2 === 0));
        };
        this.items = this._items;
    }

    public changeDisabled(state) {
        if (!state) {
            this.resolver = null;
        } else {
            this.resolver = this._disableResolver;
        }
    }

    public selected($event) {
        if ($event) { this.selectedIndex = $event.index; }
    }

}
