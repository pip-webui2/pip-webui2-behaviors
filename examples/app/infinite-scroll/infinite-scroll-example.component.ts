import { Component } from '@angular/core';


@Component({
  selector: 'infinite-scroll-example',
  templateUrl: './infinite-scroll-example.component.html',
  styleUrls: ['./infinite-scroll-example.component.scss']
})
export class InfiniteScrollExampleComponent {
 
  constructor() {

  }

  public onSelect(event) {
    //console.log('event', event);
  }
}
