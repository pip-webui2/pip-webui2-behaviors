import * as _ from 'lodash';
import { Component } from '@angular/core';

@Component({
  selector: 'infinite-scroll-example',
  templateUrl: './infinite-scroll-example.component.html',
  styleUrls: ['./infinite-scroll-example.component.scss']
})
export class InfiniteScrollExampleComponent {

  public items: any[] = [];

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
      itemCount = 0,
      colors = ['red', 'blue', 'yellow', 'green'];

    for (let i = 0; i < count; i++) {
      let item = {
        id: itemCount,
        name: 'Item ' + itemCount,
        color: colors[_.random(0, colors.length - 1)]
      };
      itemCount++;

      this.items.push(item);
    }
  };
}
