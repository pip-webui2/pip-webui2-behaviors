import * as _ from 'lodash';
import { Component } from '@angular/core';

@Component({
  selector: 'infinite-scroll-example',
  templateUrl: './infinite-scroll-example.component.html',
  styleUrls: ['./infinite-scroll-example.component.scss']
})
export class InfiniteScrollExampleComponent {

  public items: any[] = [];
  private _itemCount: number = 0;

  constructor() {
    this.generateItems(20);
  }

  public onSelect(event) {
    //console.log('event', event);
  }

  public generateItems = function (count) {
    if (this.items.length >= 200) return;
    console.log('Generating ' + count + ' items');

    let
      colors = ['red', 'blue', 'yellow', 'green'];

    for (let i = 0; i < count; i++) {
      let item = {
        id: this._itemCount,
        name: 'Item ' + this._itemCount,
        color: colors[_.random(0, colors.length - 1)]
      };
      this._itemCount++;

      this.items.push(item);
    }
  };
}
